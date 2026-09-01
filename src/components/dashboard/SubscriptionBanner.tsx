"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, Clock, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export interface SubscriptionState {
  status: "inactive" | "active" | "expiring_soon" | "expired";
  isActive: boolean;
  daysRemaining: number;
  expiresAt: string | null;
  needsRenewal: boolean;
  cyclesPaid: number;
}

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

/**
 * The membership prompt shown at the top of the trainer dashboard.
 *
 * Four states, each with a different level of urgency — never shown at all
 * while the membership is comfortably active, so it doesn't become wallpaper
 * the trainer learns to ignore.
 */
export default function SubscriptionBanner({
  subscription,
  onActivate,
  loading = false,
}: {
  subscription?: SubscriptionState | null;
  onActivate: () => void;
  loading?: boolean;
}) {
  const state = subscription?.status || "inactive";

  // Comfortably active — a slim confirmation strip, nothing more.
  if (state === "active") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200/70 rounded-2xl">
        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-emerald-900 leading-tight">Membership active</p>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">
            Renews {formatDate(subscription?.expiresAt ?? null)} · {subscription?.daysRemaining} days left
          </p>
        </div>
      </div>
    );
  }

  const COPY = {
    inactive: {
      badge: "Activation required",
      Icon: Lock,
      title: "Activate your membership",
      body: "Your profile stays hidden from gyms until your membership is active. ₹99/month unlocks it.",
      cta: "Activate for ₹99",
      accent: "from-[#d91a24] to-[#a8111a]",
      chip: "bg-white/20",
    },
    expiring_soon: {
      badge: `${subscription?.daysRemaining ?? 0} days left`,
      Icon: Clock,
      title: "Your membership expires soon",
      body: `Renew before ${formatDate(subscription?.expiresAt ?? null)} to stay visible to hiring gyms without a break.`,
      cta: "Renew for ₹99",
      accent: "from-amber-500 to-amber-600",
      chip: "bg-white/25",
    },
    expired: {
      badge: "Expired",
      Icon: AlertTriangle,
      title: "Your membership has expired",
      body: "Your profile is hidden from gym search right now. Renew to be discoverable again — your data is safe.",
      cta: "Renew for ₹99",
      accent: "from-[#d91a24] to-[#a8111a]",
      chip: "bg-white/20",
    },
  }[state as "inactive" | "expiring_soon" | "expired"];

  const { Icon } = COPY;

  return (
    <div
      className={`bg-gradient-to-br ${COPY.accent} rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-[0_10px_30px_rgb(0,0,0,0.14)]`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <span className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h2 className="font-extrabold text-[15px] sm:text-base leading-tight">{COPY.title}</h2>
            <span
              className={`text-[10px] font-bold ${COPY.chip} px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0`}
            >
              {COPY.badge}
            </span>
          </div>
          <p className="text-[13px] text-white/85 leading-relaxed">{COPY.body}</p>
        </div>

        <button
          onClick={onActivate}
          disabled={loading}
          className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-900 text-sm font-extrabold shrink-0 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {COPY.cta}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/** Compact membership pill for the dashboard header / profile areas. */
export function MembershipPill({ subscription }: { subscription?: SubscriptionState | null }) {
  const state = subscription?.status || "inactive";
  const map = {
    active: { label: `Active · ${subscription?.daysRemaining}d left`, cls: "text-emerald-700 bg-emerald-50 border-emerald-200/80", Icon: ShieldCheck },
    expiring_soon: { label: `${subscription?.daysRemaining}d left`, cls: "text-amber-700 bg-amber-50 border-amber-200/80", Icon: Clock },
    expired: { label: "Expired", cls: "text-red-700 bg-red-50 border-red-200/80", Icon: AlertTriangle },
    inactive: { label: "Not activated", cls: "text-gray-600 bg-gray-100 border-gray-200", Icon: Lock },
  }[state];

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${map.cls}`}
    >
      <map.Icon className="w-3.5 h-3.5 shrink-0" />
      {map.label}
    </span>
  );
}
