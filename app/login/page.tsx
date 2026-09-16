"use client";

import { useState, useEffect, Suspense } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { setUser, setLoading, clearUser } from "@/store/authSlice";
import { selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { useToast } from "@/components/client/Toast";
import { authApi, ApiError } from "@/lib/api";
import { safeInternalRedirect } from "@/lib/navigation";
import { clearAuth, saveAuthImmediate } from "@/lib/persist";

const DEV_LOGIN_EMAIL = "dev@example.com";
const DEV_LOGIN_PASSWORD = "Dev@12345";


function isDevMode() {
  return process.env.NODE_ENV !== "production";
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(isDevMode() ? DEV_LOGIN_EMAIL : "");
  const [password, setPassword] = useState(isDevMode() ? DEV_LOGIN_PASSWORD : "");
  const [fieldError, setFieldError] = useState("");

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Honor ?redirect=<path> (e.g. set by the booking flow), but only allow
  // same-site absolute paths — never an external URL (open-redirect guard).
  const rawRedirect = searchParams.get("redirect");
  const safeRedirect = safeInternalRedirect(rawRedirect);

  // Already logged in — redirect away from login page.
  // Persisted auth state (localStorage) can be stale relative to the httpOnly
  // pph_session cookie the proxy actually checks, so verify it first — otherwise
  // a missing/expired cookie causes an infinite redirect loop with proxy.ts.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data: { valid: boolean }) => {
        if (cancelled) return;
        if (data.valid) {
          const target = safeRedirect ?? "/hotels";
          const currentUrl = window.location.href;
          if (!currentUrl.startsWith(target) && currentUrl !== target) {
            window.location.href = target;
          }
        } else {
          dispatch(clearUser());
          clearAuth();
        }
      })
      .catch((err: unknown) => {
        // Session check failed — treat as stale auth and clear it so the user
        // can log in again rather than being stuck in a redirect loop.
        console.warn('[login] session validation error:', err);
        if (!cancelled) { dispatch(clearUser()); clearAuth(); }
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, dispatch, safeRedirect]);

  // Shown when redirected from /register after existing phone detected
  const existingAccount = searchParams.get("existing") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setFieldError("");
    setIsSubmitting(true);
    dispatch(setLoading(true));
    try {
      let result: { user: { email: string }; tokens: { accessToken: string; refreshToken: string } };

      if (isDevMode() && email === DEV_LOGIN_EMAIL && password === DEV_LOGIN_PASSWORD) {
        result = {
          user: { email: DEV_LOGIN_EMAIL },
          tokens: {
            accessToken: "dev-access-token",
            refreshToken: "dev-refresh-token",
          },
        };
      } else {
        result = await authApi.login(email, password);
      }

      const { user, tokens } = result;

      // Store access token in httpOnly cookie for proxy.ts
      const sessionRes = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      });
      if (!sessionRes.ok) throw new Error("Failed to store session");

      const authUser = {
        id: 0,
        name: user.email.split("@")[0],
        username: user.email.split("@")[0],
        email: user.email,
      };

      dispatch(
        setUser({
          user: authUser,
          role: "guest",
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      );

      // Write synchronously — the full-page navigation below would otherwise
      // race the debounced store subscriber and drop the tokens on reload.
      saveAuthImmediate({
        user: authUser,
        role: "guest",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      success("Welcome back!");
      const target = safeRedirect ?? "/hotels";
      if (window.location.href !== target) {
        window.location.href = target;
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Login failed. Check your credentials.";
      setFieldError(msg);
      error(msg);
      dispatch(setLoading(false));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-500 p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">

        {/* Left: Branding */}
        <div className="text-white space-y-6 hidden md:block">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Experience Comfort <br /> Like Never Before
          </h1>
          <p className="text-lg opacity-90">Join the family of 1,500,000+ Happy Customers</p>
          <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20">
            <ShieldCheck className="w-5 h-5 text-green-300" />
            <span className="text-sm font-medium">Best price guarantee</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Flexibility</p>
              <p className="text-sm">Pay-per-hour stays</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Network</p>
              <p className="text-sm">8000+ Hotels nationwide</p>
            </div>
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="flex justify-center md:justify-end">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-xs text-gray-500 mt-1">Enter your details to sign in.</p>
            </div>

            {existingAccount && (
              <div className="mb-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
                This phone number already has an account. Sign in below.
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-3">
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>

              {fieldError && (
                <p className="text-xs text-red-500">{fieldError}</p>
              )}

              {/* Forgot password not yet implemented in backend */}

              {isDevMode() && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail(DEV_LOGIN_EMAIL);
                    setPassword(DEV_LOGIN_PASSWORD);
                    setFieldError("");
                  }}
                  className="w-full py-2.5 border border-amber-300 bg-amber-50 text-amber-800 rounded-xl font-semibold text-sm transition hover:bg-amber-100"
                >
                  Use Dev Login
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </button>

            </form>

            <p className="text-center text-xs text-gray-500 mt-8">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-orange-600 font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
