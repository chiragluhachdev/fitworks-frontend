"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  FileUp,
} from "lucide-react";

export type LockReason = "rejected";

export interface LockInfo {
  reason: LockReason;
  title: string;
  message: string;
}

const FIX_STEPS = [
  { label: "Upload a valid certificate", body: "ACE, ISSA, K11, Yoga Alliance or equivalent." },
  { label: "Add a clear government ID", body: "Aadhaar or PAN — all four corners visible, no glare." },
  { label: "We re-check within 24 hours", body: "You'll see the badge update on your dashboard." },
];

/**
 * Shown in place of gated content when a profile was rejected, so the trainer
 * knows why and exactly what to re-upload. Nothing else blocks access — the
 * platform is free and a pending review does not hold anyone back.
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
  const steps = FIX_STEPS;
  const Icon = ShieldAlert;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-6 sm:p-10">
        <div className="text-center mb-8">
          <span
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              "bg-red-50 text-[#d91a24]"
            }`}
          >
            <Icon className="w-8 h-8" />
          </span>

          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border mb-3.5 bg-red-50 text-red-700 border-red-200/70"
          >
            Action needed
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2.5">
            {lock.title}
          </h2>
          <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">{lock.message}</p>
        </div>

        {/* Where they are in the process */}
        <ol className="space-y-0 mb-8">
          {steps.map((step, i) => {
            const current = i === 0;
            return (
              <li key={step.label} className="flex gap-3.5">
                <div className="flex flex-col items-center shrink-0">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 transition-colors ${
                      current
                        ? "bg-red-50 border-red-300 text-[#d91a24]"
                        : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && <span className="w-px flex-1 bg-gray-200 my-1" />}
                </div>

                <div className={`min-w-0 pb-6 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <p
                    className={`text-[13px] font-bold leading-snug ${
                      current ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {current && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-[#d91a24]">
                        · Start here
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mt-1">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <Link
          href={`/trainer/${trainerSlug}/verification`}
          className="w-full h-13 min-h-[52px] rounded-2xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_10px_26px_rgb(217,26,36,0.22)] active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
        >
          <FileUp className="w-4 h-4" /> Re-upload my documents
        </Link>
      </div>
    </div>
  );
}
