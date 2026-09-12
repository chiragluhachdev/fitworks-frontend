"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  Lock,
  Loader2,
  Receipt,
  IndianRupee,
  CheckCircle2,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import SectionCard from "@/components/dashboard/SectionCard";
import EmptyState from "@/components/dashboard/EmptyState";
import RazorpayPaymentModal from "@/components/RazorpayPaymentModal";
import type { ActivationState } from "@/components/dashboard/ActivationBanner";

interface Payment {
  orderId: string;
  paymentId: string;
  amount: number;
  paidAt: string;
}

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

/** What activation unlocks — the same list the paywall shows. */
const INCLUDED = [
  { Icon: BadgeCheck, label: "Visible to every hiring gym in India" },
  { Icon: Search, label: "Browse all open vacancies" },
  { Icon: Send, label: "Apply to unlimited roles" },
  { Icon: Sparkles, label: "Receive direct interview invitations" },
];

export default function TrainerActivationPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "";

  const [activation, setActivation] = useState<ActivationState | null>(null);
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
      if (s.success) setActivation(s.activation);
      if (h.success) setHistory(h.history || []);
    } catch (err) {
      console.error("Activation load error:", err);
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
        <p className="text-xs font-semibold text-gray-500">Loading your activation…</p>
      </div>
    );
  }

  const isActive = Boolean(activation?.isActive);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Activation
        </h1>
        <p className="text-[13px] sm:text-sm text-gray-500 mt-1.5">
          A single ₹99 payment keeps your profile live. No monthly fee, no renewal.
        </p>
      </header>

      {/* ── Current status ── */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Profile activation
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {isActive ? <BadgeCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {isActive ? "Active" : "Not activated"}
              </span>
            </div>

            <p className="flex items-baseline gap-1 text-gray-900 mb-1">
              <IndianRupee className="w-5 h-5 self-center" />
              <span className="text-3xl font-extrabold tracking-tight">99</span>
              <span className="text-sm font-semibold text-gray-500">one-time</span>
            </p>

            <p className="text-[13px] text-gray-500 leading-relaxed">
              {isActive
                ? `Activated ${fmt(activation?.activatedAt)} — your profile stays live permanently. Nothing more to pay.`
                : "Not activated yet — your profile is hidden from gym search."}
            </p>
          </div>

          {!isActive && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.22)] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              Activate for ₹99
            </button>
          )}
        </div>

        {/* What it includes */}
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-6 pt-6 border-t border-gray-100">
          {INCLUDED.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className={`text-[13px] font-semibold ${isActive ? "text-gray-800" : "text-gray-500"}`}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Receipt ── */}
      <SectionCard title="Payment receipt" description="Your one-time activation payment">
        {history.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payment yet"
            description="Once you activate, your receipt appears here."
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
                  <p className="text-sm font-bold text-gray-900">₹{p.amount} · Profile activation</p>
                  <p className="text-[11px] text-gray-500 truncate">Paid {fmt(p.paidAt)}</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{p.paymentId}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <RazorpayPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        trainerSlug={trainerSlug}
        onSuccess={() => {
          setShowPaymentModal(false);
          load();
        }}
      />
    </div>
  );
}
