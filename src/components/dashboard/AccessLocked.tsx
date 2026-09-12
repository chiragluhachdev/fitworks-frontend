"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  ShieldAlert,
  Lock,
  ArrowRight,
  Check,
  CheckCircle2,
  Search,
  Send,
  Sparkles,
  BadgeCheck,
  FileUp,
} from "lucide-react";

export type LockReason = "pending_review" | "rejected" | "not_activated";

export interface LockInfo {
  reason: LockReason;
  title: string;
  message: string;
  /** Lets the review screen offer activation while the trainer waits. */
  isActivated?: boolean;
}

/** What the one-time ₹99 actually buys. Concrete, not adjectives. */
const BENEFITS = [
  { Icon: Search, label: "Browse every open vacancy", body: "Live roles from partner gyms across India." },
  { Icon: Send, label: "Apply to unlimited roles", body: "No per-application fees, ever." },
  { Icon: BadgeCheck, label: "Your profile goes with it", body: "The gym sees your full profile on every application." },
  { Icon: Sparkles, label: "Paid once, not monthly", body: "No renewal, no recurring charge, ever." },
];

const REVIEW_STEPS = [
  { label: "Documents received", body: "Your certificates and ID are with our team." },
  { label: "Verification in progress", body: "We check every credential by hand — usually within 24 hours." },
  { label: "Your profile goes live", body: "Vacancies unlock and gyms can discover you." },
];

const FIX_STEPS = [
  { label: "Upload a valid certificate", body: "ACE, ISSA, K11, Yoga Alliance or equivalent." },
  { label: "Add a clear government ID", body: "Aadhaar or PAN — all four corners visible, no glare." },
  { label: "We re-check within 24 hours", body: "You'll see the badge update on your dashboard." },
];

/**
 * Shown in place of gated content so a blocked trainer always knows exactly why
 * and what to do next, rather than staring at an empty list.
 *
 * Three registers, deliberately different: the paywall sells, the review screen
 * reassures, the rejection screen instructs.
 */
export default function AccessLocked({
  lock,
  trainerSlug,
  onActivate,
}: {
  lock: LockInfo;
  trainerSlug: string;
  onActivate?: () => void;
}) {
  /* ─────────────────── Paywall ─────────────────── */
  if (lock.reason === "not_activated") {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Hero */}
          <div className="relative bg-gradient-to-br from-[#d91a24] to-[#a8111a] px-6 sm:px-10 pt-9 pb-8 text-center text-white overflow-hidden">
            {/* Soft light bloom, purely decorative */}
            <span
              aria-hidden
              className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl"
            />
            <span className="relative inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] bg-white/15 backdrop-blur-md px-3 py-1 rounded-full mb-4">
              <Lock className="w-3 h-3" />
              One-time payment
            </span>

            <h2 className="relative text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2.5">
              {lock.title}
            </h2>
            <p className="relative text-[13px] sm:text-sm text-white/85 leading-relaxed max-w-md mx-auto">
              {lock.message}
            </p>

            <div className="relative flex items-baseline justify-center gap-1.5 mt-6">
              <span className="text-2xl font-bold">₹</span>
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums">99</span>
              <span className="text-sm font-semibold text-white/75">once</span>
            </div>
            <p className="relative text-[11px] text-white/70 mt-1.5">
              Pay once · no monthly fee · no renewal
            </p>
          </div>

          {/* What you get */}
          <div className="px-6 sm:px-10 py-7">
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-7">
              {BENEFITS.map(({ Icon, label, body }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold text-gray-900 leading-snug">{label}</span>
                    <span className="block text-[11px] text-gray-500 leading-relaxed mt-0.5">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            {onActivate ? (
              <button
                onClick={onActivate}
                className="w-full h-14 rounded-2xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-[15px] font-extrabold shadow-[0_10px_26px_rgb(217,26,36,0.26)] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                Activate for ₹99
                <ArrowRight className="w-[18px] h-[18px]" />
              </button>
            ) : (
              <Link
                href={`/trainer/${trainerSlug}/subscription`}
                className="w-full h-14 rounded-2xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-[15px] font-extrabold shadow-[0_10px_26px_rgb(217,26,36,0.26)] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
              >
                Activate for ₹99
                <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
            )}

            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-gray-400 mt-4">
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Activates instantly
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Secure UPI &amp; card payment
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Charged once, never again
              </span>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          Already paid?{" "}
          <Link href={`/trainer/${trainerSlug}/subscription`} className="font-bold text-gray-600 hover:text-[#d91a24]">
            Check your activation status
          </Link>
        </p>
      </div>
    );
  }

  /* ──────────── Under review / rejected ──────────── */
  const isReview = lock.reason === "pending_review";
  const steps = isReview ? REVIEW_STEPS : FIX_STEPS;
  const Icon = isReview ? Clock : ShieldAlert;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-6 sm:p-10">
        <div className="text-center mb-8">
          <span
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isReview ? "bg-amber-50 text-amber-600" : "bg-red-50 text-[#d91a24]"
            }`}
          >
            <Icon className="w-8 h-8" />
          </span>

          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border mb-3.5 ${
              isReview
                ? "bg-amber-50 text-amber-700 border-amber-200/70"
                : "bg-red-50 text-red-700 border-red-200/70"
            }`}
          >
            {isReview ? "Verification in progress" : "Action needed"}
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2.5">
            {lock.title}
          </h2>
          <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">{lock.message}</p>
        </div>

        {/* Where they are in the process */}
        <ol className="space-y-0 mb-8">
          {steps.map((step, i) => {
            const done = isReview && i === 0;
            const current = isReview ? i === 1 : i === 0;
            return (
              <li key={step.label} className="flex gap-3.5">
                <div className="flex flex-col items-center shrink-0">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 transition-colors ${
                      done
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : current
                        ? isReview
                          ? "bg-amber-50 border-amber-300 text-amber-700"
                          : "bg-red-50 border-red-300 text-[#d91a24]"
                        : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </span>
                  {i < steps.length - 1 && <span className="w-px flex-1 bg-gray-200 my-1" />}
                </div>

                <div className={`min-w-0 pb-6 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <p
                    className={`text-[13px] font-bold leading-snug ${
                      current ? "text-gray-900" : done ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {current && (
                      <span
                        className={`ml-2 text-[10px] font-bold uppercase tracking-wide ${
                          isReview ? "text-amber-600" : "text-[#d91a24]"
                        }`}
                      >
                        {isReview ? "· Now" : "· Start here"}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mt-1">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {isReview ? (
          <Link
            href={`/trainer/${trainerSlug}/verification`}
            className="w-full h-13 min-h-[52px] rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm font-bold hover:bg-gray-50 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
          >
            Review my documents <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/trainer/${trainerSlug}/verification`}
            className="w-full h-13 min-h-[52px] rounded-2xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_10px_26px_rgb(217,26,36,0.22)] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
          >
            <FileUp className="w-4 h-4" /> Re-upload my documents
          </Link>
        )}

        {/* Let them clear the second gate while the first is still in progress. */}
        {isReview && lock.isActivated === false && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed flex-1">
              <span className="font-bold text-gray-700">One more step after this:</span> a one-time ₹99
              activation. You can pay now so your profile goes live the moment you&apos;re approved.
            </p>
            {onActivate ? (
              <button
                onClick={onActivate}
                className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold shrink-0 active:scale-[0.98] transition-all cursor-pointer"
              >
                Activate ₹99
              </button>
            ) : (
              <Link
                href={`/trainer/${trainerSlug}/subscription`}
                className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold shrink-0 active:scale-[0.98] transition-all inline-flex items-center justify-center"
              >
                Activate ₹99
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
