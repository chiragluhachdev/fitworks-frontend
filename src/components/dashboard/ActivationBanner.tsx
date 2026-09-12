"use client";

import React from "react";
import { BadgeCheck, Lock, ArrowRight } from "lucide-react";

export interface ActivationState {
  status: "inactive" | "active";
  isActive: boolean;
  /** ISO date of the one-time payment, or null. */
  activatedAt: string | null;
  totalPaid: number;
  paymentsMade: number;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

/**
 * The activation prompt at the top of the trainer dashboard.
 *
 * Only two states now that billing is a single payment: activated, or not.
 * There is no expiry to warn about and no renewal to chase, so an activated
 * trainer gets a quiet confirmation strip rather than a recurring nag.
 */
export default function ActivationBanner({
  activation,
  onActivate,
  loading = false,
}: {
  activation?: ActivationState | null;
  onActivate: () => void;
  loading?: boolean;
}) {
  if (activation?.isActive) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200/70 rounded-2xl">
        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <BadgeCheck className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-emerald-900 leading-tight">Profile activated</p>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">
            {activation.activatedAt
              ? `Activated ${formatDate(activation.activatedAt)} · apply to any vacancy, nothing more to pay`
              : "Apply to any vacancy — nothing more to pay"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#d91a24] to-[#a8111a] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-[0_10px_30px_rgb(0,0,0,0.14)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <span className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h2 className="font-extrabold text-[15px] sm:text-base leading-tight">Activate your profile</h2>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
              One-time ₹99
            </span>
          </div>
          <p className="text-[13px] text-white/85 leading-relaxed">
            You can&apos;t apply to vacancies until your profile is activated. Pay ₹99 once — no monthly
            fee, no renewal.
          </p>
        </div>

        <button
          onClick={onActivate}
          disabled={loading}
          className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-900 text-sm font-extrabold shrink-0 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          Activate for ₹99
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/** Compact activation pill for the dashboard header. */
export function ActivationPill({ activation }: { activation?: ActivationState | null }) {
  const active = Boolean(activation?.isActive);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
        active
          ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
          : "text-gray-600 bg-gray-100 border-gray-200"
      }`}
    >
      {active ? <BadgeCheck className="w-3.5 h-3.5 shrink-0" /> : <Lock className="w-3.5 h-3.5 shrink-0" />}
      {active ? "Activated" : "Not activated"}
    </span>
  );
}
