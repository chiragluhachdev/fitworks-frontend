"use client";

import React from "react";
import Link from "next/link";
import { Clock, ShieldAlert, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export type LockReason = "pending_review" | "rejected" | "subscription_inactive";

export interface LockInfo {
  reason: LockReason;
  title: string;
  message: string;
}

const THEME: Record<
  LockReason,
  { Icon: typeof Clock; chip: string; ring: string; badge: string; cta: string | null }
> = {
  pending_review: {
    Icon: Clock,
    chip: "bg-amber-50 text-amber-600",
    ring: "border-amber-200/70",
    badge: "bg-amber-50 text-amber-700 border-amber-200/70",
    cta: null,
  },
  rejected: {
    Icon: ShieldAlert,
    chip: "bg-red-50 text-[#d91a24]",
    ring: "border-red-200/70",
    badge: "bg-red-50 text-red-700 border-red-200/70",
    cta: "Go to Verification",
  },
  subscription_inactive: {
    Icon: Lock,
    chip: "bg-red-50 text-[#d91a24]",
    ring: "border-red-200/70",
    badge: "bg-red-50 text-red-700 border-red-200/70",
    cta: "Activate for ₹99/month",
  },
};

const LABEL: Record<LockReason, string> = {
  pending_review: "Under review",
  rejected: "Action needed",
  subscription_inactive: "Membership inactive",
};

/**
 * Full-panel explanation shown in place of gated content, so a blocked trainer
 * always knows why and what to do next rather than seeing an empty list.
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
  const t = THEME[lock.reason];
  const { Icon } = t;

  const steps =
    lock.reason === "pending_review"
      ? ["Documents received", "Our team is reviewing them", "Vacancies unlock automatically"]
      : lock.reason === "rejected"
      ? ["Re-upload a valid certificate", "Add a clear government ID", "We re-check within 24 hours"]
      : ["Activate your ₹99/month membership", "Browse every open vacancy", "Apply to as many as you like"];

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl border ${t.ring} shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-6 sm:p-10`}>
      <div className="max-w-md mx-auto text-center">
        <span className={`w-14 h-14 rounded-2xl ${t.chip} flex items-center justify-center mx-auto mb-4`}>
          <Icon className="w-7 h-7" />
        </span>

        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-3 ${t.badge}`}>
          {LABEL[lock.reason]}
        </span>

        <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-tight mb-2.5">
          {lock.title}
        </h2>
        <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed mb-7">{lock.message}</p>

        <ol className="text-left space-y-2.5 mb-7">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
              <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                {lock.reason === "pending_review" && i === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="text-[10px] font-extrabold text-gray-500">{i + 1}</span>
                )}
              </span>
              <span className="text-[13px] font-semibold text-gray-700 leading-snug">{step}</span>
            </li>
          ))}
        </ol>

        {lock.reason === "subscription_inactive" && onActivate && (
          <button
            onClick={onActivate}
            className="w-full h-12 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.22)] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            {t.cta} <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {lock.reason === "rejected" && (
          <Link
            href={`/trainer/${trainerSlug}/verification`}
            className="w-full h-12 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.22)] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
          >
            {t.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {lock.reason === "pending_review" && (
          <Link
            href={`/trainer/${trainerSlug}/profile`}
            className="w-full h-12 rounded-xl border border-gray-200 text-gray-800 text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
          >
            Review my profile <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
