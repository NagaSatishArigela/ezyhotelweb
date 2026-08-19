"use client";

import { useState, useEffect, Suspense } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { setUser, setLoading, clearUser } from "@/store/authSlice";
import { selectIsAuthenticated, selectRole } from "@/store/selectors/authSelectors";
import { useToast } from "@/components/client/Toast";
import { authApi, ApiError } from "@/lib/api";
import { clearAuth, saveAuthImmediate } from "@/lib/persist";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);

  // Honor ?redirect=<path> (e.g. set by the booking flow), but only allow
  // same-site absolute paths — never an external URL (open-redirect guard).
  const rawRedirect = searchParams.get("redirect");
  const safeRedirect = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : null;
  const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";

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
          // Owners belong in the partner portal; /owner/* routes were removed.
          window.location.href = role === "owner" ? `${PORTAL_URL}/login` : (safeRedirect ?? "/hotels");
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
  }, [isAuthenticated, role, dispatch, safeRedirect, PORTAL_URL]);

  // Shown when redirected from /register after existing phone detected
  const existingAccount = searchParams.get("existing") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setFieldError("");
    setIsSubmitting(true);
    dispatch(setLoading(true));
    try {
      const res = await authApi.login(email, password);
      const { user, tokens } = res;

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
      window.location.href = safeRedirect ?? "/";
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </button>

              <div className="relative flex items-center py-3">
                <div className="grow border-t border-gray-100" />
                <span className="shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Or Continue With</span>
                <div className="grow border-t border-gray-100" />
              </div>

              <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700 active:scale-[0.98]">
                <GoogleIcon /> Google
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
