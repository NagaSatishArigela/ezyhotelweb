"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Clock,
  Building2,
  UserCircle2,
} from "lucide-react";
import { setUser, clearUser } from "@/store/authSlice";
import { selectIsAuthenticated, selectRole } from "@/store/selectors/authSelectors";
import { authApi, ApiError } from "@/lib/api";
import { clearAuth, saveAuthImmediate } from "@/lib/persist";
import { useToast } from "@/components/client/Toast";
import type { AppDispatch } from "@/store";

// ── Zod schema ──────────────────────────────────────────────────────────────

const credentialsSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Needs an uppercase letter")
      .regex(/[a-z]/, "Needs a lowercase letter")
      .regex(/[0-9]/, "Needs a number")
      .regex(/[^A-Za-z0-9]/, "Needs a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CredentialsForm = z.infer<typeof credentialsSchema>;

// ── Password strength ───────────────────────────────────────────────────────

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function strengthScore(password: string): number {
  return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

function strengthColor(score: number): string {
  if (score <= 2) return "bg-red-400";
  if (score === 3) return "bg-yellow-400";
  return "bg-green-500";
}

// ── Step type ───────────────────────────────────────────────────────────────

type Step = "PHONE" | "OTP" | "CREDENTIALS";

// ── Inner component (uses useSearchParams — must be wrapped in Suspense) ────

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { error: toastError } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const intent = searchParams.get("intent"); // "owner" | null

  const isOwnerIntent = intent === "owner";

  // Already logged in — redirect away from register.
  // intent=owner: any authenticated user goes straight to onboarding (no re-register needed)
  // no intent: go to hotels
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
          window.location.href = isOwnerIntent ? "/owner/onboarding/basics" : "/hotels";
        } else {
          dispatch(clearUser());
          clearAuth();
        }
      })
      .catch((err: unknown) => {
        console.warn('[register] session validation error:', err);
        if (!cancelled) { dispatch(clearUser()); clearAuth(); }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ── Step state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("PHONE");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CredentialsForm>({ resolver: zodResolver(credentialsSchema) });

  const passwordValue = watch("password") ?? "";
  const confirmValue = watch("confirmPassword") ?? "";
  const score = strengthScore(passwordValue);

  // cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── OTP timer ───────────────────────────────────────────────────────────
  function startTimer(seconds: number) {
    setOtpTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  // ── Step 1: Send OTP ────────────────────────────────────────────────────
  async function handleSendOtp() {
    const clean = phone.trim();
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setPhoneError("");
    setIsSubmitting(true);
    try {
      const res = await authApi.sendOtp(clean);
      startTimer(res.resendAfter);
      setStep("OTP");
    } catch (err) {
      setPhoneError(err instanceof ApiError ? err.message : "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────
  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError("Enter the 6-digit OTP");
      return;
    }
    setOtpError("");
    setIsSubmitting(true);
    try {
      const res = await authApi.verifyOtp(phone, otpValue);
      if (!res.needsRegistration) {
        // Existing user — send to login
        router.push("/login?existing=1");
        return;
      }
      setVerificationToken(res.verificationToken);
      setStep("CREDENTIALS");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Step 3: Register ────────────────────────────────────────────────────
  async function handleRegister(data: CredentialsForm) {
    setIsSubmitting(true);
    try {
      const res = await authApi.register(verificationToken, data.email, data.password);
      const { user, tokens } = res;

      // Store access token in httpOnly cookie so proxy.ts can verify it
      const sessionRes = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      });
      if (!sessionRes.ok) throw new Error("Failed to store session");

      const authUser = {
        id: 0, // server uses UUID strings; local User type uses number — will align in types update
        name: user.email.split("@")[0],
        username: user.email.split("@")[0],
        email: user.email,
      };
      const authRole = isOwnerIntent ? "owner" : "guest";

      dispatch(
        setUser({
          user: authUser,
          role: authRole,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      );

      // Write synchronously — the full-page navigation below would otherwise
      // race the debounced store subscriber and drop the tokens on reload.
      saveAuthImmediate({
        user: authUser,
        role: authRole,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      if (isOwnerIntent) {
        // SSO handoff via one-time code — tokens never appear in the URL.
        // The partner portal redeems the code server-to-server via GET /api/sso/handoff?code=<uuid>.
        const PORTAL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";
        // Phone/email travel inside the server-side handoff payload, NOT the URL,
        // so no PII lands in browser history / access logs / Referer.
        const handoff = await fetch("/api/sso/handoff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            phone,
            email: data.email,
          }),
        });
        const { code } = await handoff.json();
        window.location.href = `${PORTAL}/sso?code=${encodeURIComponent(code)}`;
      } else {
        window.location.href = "/hotels";
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Registration failed. Please try again.";
      setSubmitError(msg);
      toastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Left sidebar copy ───────────────────────────────────────────────────
  const sidebarContent = isOwnerIntent
    ? {
        icon: <Building2 className="w-8 h-8 text-orange-500" />,
        heading: "List your property.\nStart earning today.",
        bullets: [
          "Reach thousands of hourly travellers",
          "Full control over pricing and availability",
          "Dedicated owner dashboard & analytics",
          "24/7 support for property partners",
        ],
      }
    : {
        icon: <UserCircle2 className="w-8 h-8 text-orange-500" />,
        heading: "Book hotels\nby the hour.",
        bullets: [
          "Pay only for the hours you need",
          "Instant booking confirmation",
          "Best-in-class properties across India",
          "Flexible check-in & check-out",
        ],
      };

  // ── Progress indicator ──────────────────────────────────────────────────
  const steps: Step[] = ["PHONE", "OTP", "CREDENTIALS"];
  const stepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-white grid grid-cols-1 md:grid-cols-2">
      {/* Left sidebar */}
      <div className="hidden md:flex flex-col justify-center px-12 bg-brand-black text-white">
        <div className="mb-6">{sidebarContent.icon}</div>
        <h1 className="text-3xl font-bold leading-snug mb-6 whitespace-pre-line">
          {sidebarContent.heading}
        </h1>
        <ul className="space-y-3">
          {sidebarContent.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-12 text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= stepIndex ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {step === "PHONE" && "Create your account"}
            {step === "OTP" && "Verify your phone"}
            {step === "CREDENTIALS" && "Set up your login"}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {step === "PHONE" && "Enter your mobile number to get started"}
            {step === "OTP" && `OTP sent to +91 ${phone}`}
            {step === "CREDENTIALS" && "Almost done — add your email and password"}
          </p>

          {/* ── STEP 1: PHONE ─────────────────────────────────────────── */}
          {step === "PHONE" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile number
                </label>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 py-3">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    placeholder="Enter 10-digit number"
                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                )}
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-500 md:hidden">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: OTP ───────────────────────────────────────────── */}
          {step === "OTP" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  6-digit OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  placeholder="000000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] font-mono outline-none focus:ring-2 focus:ring-orange-500"
                />
                {otpError && (
                  <p className="mt-1 text-xs text-red-500">{otpError}</p>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
              >
                {isSubmitting ? "Verifying…" : "Verify OTP"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep("PHONE")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Change number
                </button>
                {otpTimer > 0 ? (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    Resend in {otpTimer}s
                  </span>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: CREDENTIALS ───────────────────────────────────── */}
          {step === "CREDENTIALS" && (
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div
                  className={`flex items-center gap-2 bg-gray-50 rounded-xl px-3 border focus-within:ring-2 focus-within:ring-orange-500 ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div
                  className={`flex items-center gap-2 bg-gray-50 rounded-xl px-3 border focus-within:ring-2 focus-within:ring-orange-500 ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <Lock className="w-4 h-4 text-gray-400" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength bars */}
                {passwordValue.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < score ? strengthColor(score) : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Rules checklist */}
                {passwordValue.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {PASSWORD_RULES.map((r) => {
                      const met = r.test(passwordValue);
                      return (
                        <li
                          key={r.label}
                          className={`flex items-center gap-1.5 text-xs ${
                            met ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {r.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 border focus-within:ring-2 focus-within:ring-orange-500 transition ${
                    confirmValue.length > 0
                      ? confirmValue === passwordValue
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Lock className="w-4 h-4 text-gray-400" />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    className="flex-1 bg-transparent py-3 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {confirmValue.length > 0 &&
                    (confirmValue === passwordValue ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    ))}
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitError("")}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating account…"
                  : isOwnerIntent
                  ? "Create account & start listing"
                  : "Create account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page export (Suspense boundary required for useSearchParams) ────────────

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
