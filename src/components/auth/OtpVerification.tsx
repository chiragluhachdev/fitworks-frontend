"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const OTP_LENGTH = 4;

export interface OtpVerificationProps {
  phone: string;
  purpose: "registration" | "login";
  /** Called with the short-lived proof once the number is verified. */
  onVerified: (verificationToken: string) => void;
  onChangeNumber: () => void;
  /** Sent already by the parent — skip the automatic first send. */
  alreadySent?: boolean;
}

const api = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const pretty = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

/**
 * Six-box OTP entry, mobile-first.
 *
 * Uses autoComplete="one-time-code" so iOS and Android offer the code straight
 * from the SMS, and handles paste across all six boxes.
 */
export default function OtpVerification({
  phone,
  purpose,
  onVerified,
  onChangeNumber,
  alreadySent = false,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(alreadySent ? 60 : 0);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const sentOnce = useRef(alreadySent);

  const code = digits.join("");

  useEffect(() => {
    if (!sentOnce.current) {
      sentOnce.current = true;
      void sendOtp();
    }
    inputs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendOtp() {
    setResending(true);
    setError(null);
    const { ok, data, error: failure } = await apiFetch<{
      success?: boolean;
      message?: string;
      resendAfterSeconds?: number;
      retryAfter?: number;
    }>(`${api()}/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose }),
    });

    if (ok && data.success) {
      if ((data as any).bypassed && (data as any).verificationToken) {
        toast.success("OTP Verification bypassed");
        onVerified((data as any).verificationToken);
        setResending(false);
        return;
      }
      toast.success(data.message || "OTP sent");
      setCooldown(data.resendAfterSeconds ?? 60);
    } else {
      setError(failure || data.message || "Could not send the OTP");
      // Keep the resend button disabled for as long as the server asked.
      if (data.retryAfter) setCooldown(data.retryAfter);
    }
    setResending(false);
  }

  async function submit(value: string) {
    if (value.length !== OTP_LENGTH || verifying) return;
    setVerifying(true);
    setError(null);
    const { ok, data, error: failure } = await apiFetch<{
      success?: boolean;
      message?: string;
      verificationToken?: string;
    }>(`${api()}/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: value, purpose }),
    });

    if (ok && data.success && data.verificationToken) {
      toast.success("Mobile number verified");
      onVerified(data.verificationToken);
    } else {
      setError(failure || data.message || "Incorrect OTP");
      // Only clear the boxes when the code itself was wrong. Wiping them after
      // a rate limit or a server hiccup makes the user retype a correct code.
      if (ok || data.success === false) {
        setDigits(Array(OTP_LENGTH).fill(""));
        inputs.current[0]?.focus();
      }
    }
    setVerifying(false);
  }

  const setAt = (i: number, v: string) => {
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    return next.join("");
  };

  const handleChange = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "");
    if (!v) {
      setAt(i, "");
      return;
    }
    // A paste or an SMS autofill lands as several digits at once.
    if (v.length > 1) {
      const next = [...digits];
      v.split("").slice(0, OTP_LENGTH - i).forEach((d, k) => (next[i + k] = d));
      setDigits(next);
      const filled = next.join("");
      inputs.current[Math.min(i + v.length, OTP_LENGTH - 1)]?.focus();
      if (filled.length === OTP_LENGTH && !filled.includes("")) void submit(filled);
      return;
    }
    const joined = setAt(i, v);
    if (i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
    if (joined.length === OTP_LENGTH && !joined.includes("")) void submit(joined);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <button
        onClick={onChangeNumber}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Change number
      </button>

      <div className="text-center mb-7">
        <span className="w-14 h-14 rounded-2xl bg-red-50 text-[#E92E3D] flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7" />
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5">
          Verify your mobile number
        </h2>
        <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed">
          We sent a 4-digit code to{" "}
          <span className="font-bold text-gray-800 whitespace-nowrap">{pretty(phone)}</span>
        </p>
      </div>

      {/* Code boxes — large enough to tap accurately on a phone */}
      <div className="flex justify-center gap-2 sm:gap-2.5 mb-5" dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={OTP_LENGTH}
            value={d}
            disabled={verifying}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={`w-12 h-14 sm:w-[52px] sm:h-16 text-center text-xl sm:text-2xl font-extrabold text-gray-900 bg-white border-2 rounded-2xl outline-none transition-all disabled:opacity-60 ${
              error
                ? "border-red-300 focus:border-[#E92E3D]"
                : d
                ? "border-[#E92E3D]"
                : "border-gray-200 focus:border-[#E92E3D] focus:ring-2 focus:ring-[#E92E3D]/10"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs font-semibold text-[#E92E3D] mb-4" role="alert">
          {error}
        </p>
      )}

      <button
        onClick={() => submit(code)}
        disabled={code.length !== OTP_LENGTH || verifying}
        className="w-full h-14 sm:h-12 bg-[#E92E3D] hover:bg-[#d42936] active:scale-[0.98] text-white rounded-xl text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.2)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none cursor-pointer"
      >
        {verifying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Verifying…
          </>
        ) : (
          "Verify & Continue"
        )}
      </button>

      <div className="text-center mt-5">
        {cooldown > 0 ? (
          <p className="text-xs text-gray-400 font-medium">
            Didn&apos;t get it? Resend in <span className="font-bold text-gray-600">{cooldown}s</span>
          </p>
        ) : (
          <button
            onClick={sendOtp}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E92E3D] hover:text-[#d42936] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
