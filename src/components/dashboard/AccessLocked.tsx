"use client";

import React from "react";
import Link from "next/link";
import { Clock, ShieldAlert, ArrowRight, CheckCircle2, FileUp } from "lucide-react";

export type LockReason = "pending_review" | "rejected";

export interface LockInfo {
  reason: LockReason;
  title: string;
  message: string;
}

const REVIEW_STEPS = [
  { label: "Documents received", body: "Your certificates and ID are with our team." },
  { label: "Verification in progress", body: "We check every credential by hand — usually within 24 hours." },
  { label: "Your profile goes active", body: "Every gym vacancy unlocks and you can start applying." },
];

const FIX_STEPS = [
  { label: "Upload a valid certificate", body: "ACE, ISSA, K11, Yoga Alliance or equivalent." },
  { label: "Add a clear government ID", body: "Aadhaar or PAN — all four corners visible, no glare." },
  { label: "We re-check within 24 hours", body: "Your profile goes active as soon as it's approved." },
];

/**
 * Shown in place of gated content so a trainer always knows why it's withheld
 * and what happens next, rather than staring at an empty list.
 *
 * Two registers, deliberately different: waiting on review reassures, a
 * rejection instructs. Neither asks for money — FitWorks is free.
 */
export default function AccessLocked({ lock, trainerSlug }: { lock: LockInfo; trainerSlug: string }) {
  const isReview = lock.reason === "pending_review";
  const steps = isReview ? REVIEW_STEPS : FIX_STEPS;
  const Icon = isReview ? Clock : ShieldAlert;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-6 sm:p-10">
        <div className="text-center mb-8">
          <span
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isReview ? "bg-amber-50 text-amber-600" : "bg-red-50 text-[#E92E3D]"
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
                          : "bg-red-50 border-red-300 text-[#E92E3D]"
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
                          isReview ? "text-amber-600" : "text-[#E92E3D]"
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
            className="w-full h-13 min-h-[52px] rounded-2xl bg-[#E92E3D] hover:bg-[#d42936] text-white text-sm font-bold shadow-[0_10px_26px_rgb(217,26,36,0.22)] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
          >
            <FileUp className="w-4 h-4" /> Re-upload my documents
          </Link>
        )}

        <p className="text-center text-[11px] text-gray-400 mt-4">
          FitWorks is free for trainers — there is nothing to pay.
        </p>
      </div>
    </div>
  );
}
