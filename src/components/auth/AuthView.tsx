"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Star,
  AlertCircle,
  Loader2,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardPath, safeNextPath } from "@/lib/session";

import RegisterGymFlow from "@/components/auth/RegisterGymFlow";
import RegisterTrainerFlow from "@/components/auth/RegisterTrainerFlow";
import OtpVerification from "@/components/auth/OtpVerification";

export type AuthMode = "login" | "register_select" | "register_gym" | "register_trainer";

/** Each mode has its own URL so it can be linked to directly (ads, emails, QR). */
export const AUTH_MODE_PATHS: Record<AuthMode, string> = {
  login: "/auth",
  register_select: "/auth/signup",
  register_gym: "/auth/gym-signup",
  register_trainer: "/auth/trainer-signup",
};

export default function AuthView({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Where to land after signing in — set by a guard that bounced us here. */
  const nextPath = safeNextPath(searchParams?.get("next"));
  // Nothing renders until we know whether there's already a session, so a
  // signed-in user never sees a flash of the login form.
  const [checkingSession, setCheckingSession] = useState(true);

  /**
   * An existing session means these pages have nothing to ask for. Send them
   * where they were going, or to their own dashboard. Signing in as someone
   * else is done by logging out from there.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("fitworks_token");
    const stored = localStorage.getItem("fitworks_user");
    if (!token || !stored) {
      setCheckingSession(false);
      return;
    }
    try {
      const user = JSON.parse(stored);
      const target = nextPath || dashboardPath(user);
      if (target) {
        router.replace(target);
        return;
      }
    } catch {
      // Corrupt session object — clear it and show the form.
      localStorage.removeItem("fitworks_token");
      localStorage.removeItem("fitworks_user");
    }
    setCheckingSession(false);
  }, [router, nextPath]);

  /** Switch mode by navigating, so the URL always reflects what's on screen. */
  const go = (next: AuthMode) => router.push(AUTH_MODE_PATHS[next]);
  const [role, setRole] = useState<"gym" | "trainer">("gym");
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  // Passwordless path: prove the number by OTP, then exchange for a session.
  const [otpMode, setOtpMode] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const routeToDashboard = (user: any) => {
    // A guard sent us here from a page they were trying to reach — honour it,
    // so a link shared over WhatsApp survives the login it triggers.
    if (nextPath && user?.role !== "admin") {
      router.push(nextPath);
      return;
    }
    const target = dashboardPath(user);
    // Without a slug there is no dashboard to open. Sending them to a guessed
    // one lands them on someone else's URL, so say what's wrong instead.
    if (!target) {
      setError("Your profile couldn't be found. Please contact FitWorks support.");
      setLoading(false);
      return;
    }
    router.push(target);
  };

  const completeOtpLogin = async (verificationToken: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpPhone, verificationToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpMode(false);
        setError(data.message || "Could not sign you in. Please try again.");
        return;
      }
      localStorage.setItem("fitworks_token", data.token);
      localStorage.setItem("fitworks_user", JSON.stringify(data.user));
      routeToDashboard(data.user);
    } catch {
      setOtpMode(false);
      setError("Unable to connect to the server.");
    }
  };

  const startOtpLogin = () => {
    const digits = identifier.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter your 10-digit mobile number to sign in with an OTP.");
      return;
    }
    setError(null);
    setOtpPhone(digits);
    setOtpMode(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please enter your mobile number or email, and your password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials. Check your mobile number or email, and password.");
        setLoading(false);
        return;
      }

      // Store auth state
      if (typeof window !== "undefined") {
        localStorage.setItem("fitworks_token", data.token);
        localStorage.setItem("fitworks_user", JSON.stringify(data.user));
      }

      routeToDashboard(data.user);
    } catch (err: any) {
      console.error("Login network error:", err);
      setError("Unable to connect to server. Please check your backend connection.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
        <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full bg-white overflow-hidden">
      
      {/* Left Side - Dark Hero Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-[#0a0b0f] flex-col justify-between overflow-hidden">
        
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/auth_hero.jpg" 
            alt="FitWorks Hero" 
            fill 
            className="object-cover object-center opacity-90"
            priority
          />
          {/* Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0f]/90 via-[#0a0b0f]/40 to-[#0a0b0f]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0f]/80 to-transparent" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 p-10 xl:p-14">
          <div className="flex items-center justify-between mb-10">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all duration-200 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <Link href="/" className="inline-block relative w-[120px] h-[34px]">
              <Image
                src="/images/logo.png"
                alt="FitWorks"
                fill
                className="object-contain object-right invert brightness-0"
              />
            </Link>
          </div>

          <h1 className="text-4xl xl:text-[44px] font-extrabold text-white leading-[1.15] tracking-tight mb-5 max-w-[400px]">
            Stronger connections. <br />
            <span className="text-[#d91a24]">Better</span> results.
          </h1>
          <p className="text-gray-300 text-base xl:text-lg leading-relaxed max-w-[420px]">
            FitWorks connects gyms with verified fitness professionals and helps trainers find the right opportunities to grow their career.
          </p>
        </div>

        {/* Bottom Floating Elements */}
        <div className="relative z-10 p-10 xl:p-14 pb-12 w-full">
          
          {/* Glassmorphism Stats Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-2xl mb-8">
            <div className="flex flex-col items-center justify-center text-center px-4 border-r border-white/10 w-1/3">
              <ShieldCheck className="w-6 h-6 text-[#d91a24] mb-2" />
              <p className="text-white font-bold text-sm">100% Verified</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Trusted profiles</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 border-r border-white/10 w-1/3">
              <Users className="w-6 h-6 text-[#d91a24] mb-2" />
              <p className="text-white font-bold text-sm">Partner Gyms</p>
              <p className="text-gray-400 text-[11px] mt-0.5">HOPE &amp; ANYDAY</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4 w-1/3">
              <Star className="w-6 h-6 text-[#d91a24] mb-2" />
              <p className="text-white font-bold text-sm">Direct Match</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Verified connections</p>
            </div>
          </div>

          {/* Quote */}
          <div className="flex gap-4 items-start max-w-[480px]">
            <span className="text-[#d91a24] text-4xl font-serif leading-none mt-1">"</span>
            <p className="text-white/90 text-lg font-medium leading-snug">
              The right match can transform a gym. The right opportunity can transform a career.
            </p>
            <span className="text-[#d91a24] text-4xl font-serif leading-none self-end rotate-180">"</span>
          </div>

        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col relative bg-[#fcfcfc] overflow-y-auto min-h-full">
        
        {/* Top Header Bar for Mobile ONLY */}
        <div className="w-full flex lg:hidden items-center justify-between px-5 pt-4 pb-1">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100/90 active:bg-gray-200 px-3 py-1.5 rounded-full transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:-translate-x-0.5 group-hover:text-gray-900 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="relative w-[100px] h-[30px]">
            <Image src="/images/logo.png" alt="FitWorks" fill className="object-contain object-right" />
          </Link>
        </div>

        {mode === "login" && otpMode && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 w-full my-auto">
            <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 md:p-10 border border-gray-100/80">
              <OtpVerification
                phone={otpPhone}
                purpose="login"
                onChangeNumber={() => setOtpMode(false)}
                onVerified={completeOtpLogin}
              />
            </div>
          </div>
        )}

        {mode === "login" && !otpMode && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 w-full my-auto">
            <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 md:p-10 border border-gray-100/80">
              
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1.5">Welcome!</h2>
                <p className="text-gray-500 text-xs sm:text-sm">Log in or sign up to continue</p>
              </div>

              {/* Role Toggle Tabs */}
              <div className="grid grid-cols-2 bg-gray-100/80 p-1.5 rounded-2xl mb-7 border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setRole("gym")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    role === "gym" 
                      ? "bg-white text-[#d91a24] shadow-[0_2px_8px_rgb(0,0,0,0.06)] border border-gray-100" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Building2 className={`w-4 h-4 shrink-0 ${role === "gym" ? "text-[#d91a24]" : "text-gray-400"}`} />
                  <span className="whitespace-nowrap">Gym Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("trainer")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    role === "trainer" 
                      ? "bg-white text-[#d91a24] shadow-[0_2px_8px_rgb(0,0,0,0.06)] border border-gray-100" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User className={`w-4 h-4 shrink-0 ${role === "trainer" ? "text-[#d91a24]" : "text-gray-400"}`} />
                  <span className="whitespace-nowrap">Trainer</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#d91a24]" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block ml-1">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="98765 43210 or you@example.com"
                      className="block w-full h-12 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1 pr-1">
                    <label className="text-xs font-semibold text-gray-700">Password</label>
                    <Link href="#" className="text-xs font-semibold text-[#d91a24] hover:text-[#cc1616]">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full h-12 pl-10 pr-10 bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.98] transition-all duration-200 text-white h-12 rounded-xl text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.2)] mt-5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={startOtpLogin}
                className="w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-gray-500" />
                Sign in with OTP
              </button>

              <div className="text-center mt-6 text-xs sm:text-sm text-gray-500">
                New to FitWorks? <button onClick={() => go("register_select")} className="text-[#d91a24] hover:text-[#cc1616] font-bold transition-colors bg-transparent border-none p-0 cursor-pointer">Create an account</button>
              </div>

              <div className="text-center mt-8 text-[11px] font-medium text-gray-400 flex items-center justify-center gap-1.5 leading-tight">
                <Lock className="w-3 h-3 shrink-0" /> Your data is secure with us. We never share your personal information.
              </div>

            </div>
          </div>
        )}

        {mode === "register_select" && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 w-full my-auto">
            <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 md:p-10 border border-gray-100/80">
              <button onClick={() => go("login")} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
              
              <div className="text-center mb-7">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1.5">How will you use FitWorks?</h2>
                <p className="text-gray-500 text-xs sm:text-sm">Select your account type to get started</p>
              </div>

              <div className="space-y-3.5">
                <button
                  onClick={() => go("register_gym")}
                  className="w-full flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border border-gray-200/80 hover:border-[#d91a24] hover:shadow-[0_8px_20px_rgb(217,26,36,0.08)] transition-all group text-left bg-white"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50/70 group-hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">
                    <Building2 className="w-5 h-5 text-[#d91a24] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5">I'm a Gym Owner</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">Hire verified trainers for my gym.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#d91a24] shrink-0 transition-colors" />
                </button>

                <button
                  onClick={() => go("register_trainer")}
                  className="w-full flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border border-gray-200/80 hover:border-[#d91a24] hover:shadow-[0_8px_20px_rgb(217,26,36,0.08)] transition-all group text-left bg-white"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50/70 group-hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">
                    <User className="w-5 h-5 text-[#d91a24] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5">I'm a Trainer</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">Find top coaching opportunities.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#d91a24] shrink-0 transition-colors" />
                </button>
              </div>

            </div>
          </div>
        )}

        {mode === "register_gym" && <RegisterGymFlow onBack={() => go("register_select")} />}
        {mode === "register_trainer" && <RegisterTrainerFlow onBack={() => go("register_select")} />}

      </div>
    </div>
  );
}
