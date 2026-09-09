"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Lock,
  Loader2,
  Receipt,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import SectionCard from "@/components/dashboard/SectionCard";
import EmptyState from "@/components/dashboard/EmptyState";
import RazorpayPaymentModal from "@/components/RazorpayPaymentModal";
import type { SubscriptionState } from "@/components/dashboard/SubscriptionBanner";

interface Payment {
  orderId: string;
  paymentId: string;
  amount: number;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
}

const fmt = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const STATUS = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border-emerald-200/80", Icon: CheckCircle2 },
  expiring_soon: { label: "Expiring soon", cls: "bg-amber-50 text-amber-700 border-amber-200/80", Icon: Clock },
  expired: { label: "Expired", cls: "bg-red-50 text-red-700 border-red-200/80", Icon: AlertTriangle },
  inactive: { label: "Not activated", cls: "bg-gray-100 text-gray-600 border-gray-200", Icon: Lock },
} as const;

export default function TrainerSubscriptionPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "";

  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const load = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
    const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;
    const auth = { Authorization: `Bearer ${token || ""}` };
    try {
      const [s, h] = await Promise.all([
        fetch(`${apiUrl}/payments/status/${trainerSlug}`).then((r) => r.json()),
        fetch(`${apiUrl}/payments/history/${trainerSlug}`, { headers: auth }).then((r) => r.json()),
      ]);
      if (s.success) setSubscription(s.subscription);
      if (h.success) setHistory(h.history || []);
    } catch (err) {
      console.error("Subscription load error:", err);
    } finally {
      setLoading(false);
    }
  }, [trainerSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading your membership…</p>
      </div>
    );
  }

  const state = STATUS[subscription?.status || "inactive"];
  const isRenewal = (subscription?.cyclesPaid ?? 0) > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Membership
        </h1>
        <p className="text-[13px] sm:text-sm text-gray-500 mt-1.5">
          Your ₹99/month plan, renewal date and payment history.
        </p>
      </header>

      {/* ── Current status ── */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Trainer membership
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${state.cls}`}
              >
                <state.Icon className="w-3.5 h-3.5" />
                {state.label}
              </span>
            </div>

            <p className="flex items-baseline gap-1 text-gray-900 mb-1">
              <IndianRupee className="w-5 h-5 self-center" />
              <span className="text-3xl font-extrabold tracking-tight">99</span>
              <span className="text-sm font-semibold text-gray-500">/ month</span>
            </p>

            <p className="text-[13px] text-gray-500 leading-relaxed">
              {subscription?.isActive
                ? `Renews ${fmt(subscription.expiresAt)} · ${subscription.daysRemaining} day${
                    subscription.daysRemaining === 1 ? "" : "s"
                  } remaining`
                : isRenewal
                ? `Expired on ${fmt(subscription?.expiresAt)} — your profile is hidden from gym search.`
                : "Not activated yet — your profile is hidden from gym search."}
            </p>
          </div>

          {(!subscription?.isActive || subscription.status === "expiring_soon") && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.22)] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              {isRenewal ? "Renew for ₹99" : "Activate for ₹99"}
            </button>
          )}
        </div>

        {/* Period summary */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
          {[
            { label: "Started", value: fmt(subscription?.startedAt), Icon: CalendarClock },
            {
              label: subscription?.isActive ? "Renews on" : "Expired on",
              value: fmt(subscription?.expiresAt),
              Icon: CalendarClock,
            },
            { label: "Cycles paid", value: String(subscription?.cyclesPaid ?? 0), Icon: Receipt },
            {
              label: "Days left",
              value: subscription?.isActive ? String(subscription.daysRemaining) : "0",
              Icon: Clock,
            },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <dt className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                <Icon className="w-3.5 h-3.5" /> {label}
              </dt>
              <dd className="text-[13px] font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Billing history ── */}
      <SectionCard title="Payment history" description="Every membership cycle you've paid for">
        {history.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            description="Once you activate your membership, each cycle will be listed here with its receipt."
          />
        ) : (
          <ul className="space-y-2.5">
            {history.map((p) => (
              <li
                key={p.paymentId}
                className="flex items-center gap-3 p-3.5 sm:p-4 bg-gray-50/70 rounded-2xl border border-gray-100"
              >
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">₹{p.amount} · 30 days</p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {fmt(p.periodStart)} → {fmt(p.periodEnd)}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{p.paymentId}</p>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 shrink-0 hidden sm:block">
                  {fmt(p.paidAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <RazorpayPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        trainerSlug={trainerSlug}
        isRenewal={isRenewal}
        expiresAt={subscription?.expiresAt ?? null}
        onSuccess={() => {
          setShowPaymentModal(false);
          load();
        }}
      />
    </div>
  );
}
