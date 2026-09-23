"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Check,
  Sparkles,
  CalendarDays,
  CreditCard,
  Clock,
  MessageCircle,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import StatusPill from "@/components/workspace/StatusPill";
import Callout from "@/components/workspace/Callout";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import { openCheckout, type RazorpayResult } from "@/lib/razorpay";
import {
  FALLBACK_PLANS,
  PLAN_FEATURES,
  findPlan,
  normalizeGymPlans,
  rupees,
  shortDate,
  type GymPlan,
} from "@/lib/hiring";
import { supportWhatsAppUrl } from "@/lib/whatsapp";

interface Membership {
  isActive: boolean;
  status: "inactive" | "active" | "expired";
  plan: string;
  startedAt?: string;
  expiresAt?: string;
  daysLeft?: number | null;
}

interface PaymentRecord {
  orderId: string;
  paymentId: string;
  plan: string;
  amount: number;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
}

function PlanCard({
  plan,
  current,
  renewing,
  busy,
  disabled,
  onChoose,
}: {
  plan: GymPlan;
  current: boolean;
  renewing: boolean;
  busy: boolean;
  disabled: boolean;
  onChoose: () => void;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-5 sm:p-6 transition-all ${
        plan.best ? "border-gray-900 shadow-[0_0_0_1px_rgb(17,24,39)]" : "border-gray-200/80"
      }`}
    >
      {plan.best && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[10.5px] font-extrabold uppercase tracking-[0.08em]">
          <Sparkles className="w-3 h-3" /> Best value
        </span>
      )}

      <div className="mb-5">
        <h3 className="text-[15px] font-bold text-gray-900">{plan.name}</h3>
        <div className="flex items-baseline gap-1.5 mt-2.5">
          <span className="text-[34px] font-extrabold text-gray-900 tracking-[-0.03em] leading-none">
            {rupees(plan.price)}
          </span>
          <span className="text-[13px] font-semibold text-gray-400">{plan.cadence}</span>
        </div>
        <p className="text-[12.5px] text-gray-500 mt-2">
          {plan.months === 1 ? (
            "Billed monthly"
          ) : (
            <>
              Works out to {rupees(plan.perMonth)}/month —{" "}
              <span className="font-bold text-emerald-600">save {plan.savingsPercent}%</span>
            </>
          )}
        </p>
      </div>

      <div className="flex-1">
        <ul className="space-y-2">
          {PLAN_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-gray-600 leading-snug">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {current ? (
          <>
            <div className="h-11 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-sm font-bold flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Current plan
            </div>
            <button
              onClick={onChoose}
              disabled={busy || disabled}
              className="w-full text-[12.5px] font-bold text-gray-500 hover:text-[#d91a24] mt-2.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {busy ? "Opening…" : "Extend this plan"}
            </button>
          </>
        ) : (
          <Button
            block
            variant={plan.best ? "primary" : "secondary"}
            loading={busy}
            disabled={disabled}
            onClick={onChoose}
          >
            {renewing ? "Switch to this plan" : "Choose plan"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function GymSubscriptionPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [sub, setSub] = useState<Membership | null>(null);
  // Prices are set by an admin, so they arrive with the membership rather
  // than being compiled in. The launch prices only fill the first paint.
  const [plans, setPlans] = useState<GymPlan[]>(FALLBACK_PLANS);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{
      subscription?: Membership;
      plans?: GymPlan[];
      history?: PaymentRecord[];
      paymentsEnabled?: boolean;
    }>(`/gyms/${gymSlug}/membership`);
    if (res.ok && res.data?.subscription) {
      setSub(res.data.subscription);
      if (res.data.plans?.length) setPlans(normalizeGymPlans(res.data.plans));
      setHistory(res.data.history || []);
      setPaymentsEnabled(res.data.paymentsEnabled !== false);
      setError("");
    } else {
      setError(res.error || "We couldn't load your subscription.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Raise the order on our server, hand it to Razorpay, then verify the result
   * on our server. The browser never decides what was bought — it only carries
   * the signature back.
   */
  const pay = async (plan: GymPlan) => {
    setBusy(plan.id);

    const order = await api<any>(`/gyms/${gymSlug}/membership/order`, {
      method: "POST",
      body: JSON.stringify({ plan: plan.id }),
    });

    if (!order.ok) {
      setBusy(null);
      if (order.data?.code === "PAYMENT_UNAVAILABLE") {
        toast.error("Online payment is unavailable right now — message us and we'll sort it out.");
      } else {
        toast.error(order.error || "Couldn't start the payment.");
      }
      return;
    }

    const d = order.data;

    try {
      await openCheckout({
        key: d.keyId,
        amount: d.amount,
        currency: d.currency || "INR",
        name: "FitWorks",
        description: `${d.plan?.name || plan.name} membership`,
        order_id: d.orderId,
        prefill: {
          name: d.contactName || d.gymName,
          email: d.contactEmail || undefined,
          contact: d.contactPhone || undefined,
        },
        notes: { gym: d.gymName || gymSlug },
        theme: { color: "#d91a24" },
        modal: {
          // Closing the window is not a failure — just stop the spinner.
          ondismiss: () => setBusy(null),
        },
        handler: async (result: RazorpayResult) => {
          const verify = await api<{ subscription?: Membership; message?: string }>(
            `/gyms/${gymSlug}/membership/verify`,
            { method: "POST", body: JSON.stringify(result) }
          );
          setBusy(null);

          if (verify.ok && verify.data?.subscription) {
            setSub(verify.data.subscription);
            toast.success(verify.data.message || "Payment received — your membership is active.");
            load();
          } else {
            // The money may well have left their account; never imply it didn't.
            toast.error(
              verify.error ||
                "We couldn't confirm the payment yet. If it was debited, it'll appear here shortly."
            );
            load();
          }
        },
      });
    } catch (err: any) {
      setBusy(null);
      toast.error(err?.message || "Couldn't open the payment window.");
    }
  };

  if (loading) return <PageSkeleton stats={0} rows={3} />;
  if (!sub) return <ErrorState message={error} onRetry={load} />;

  const active = sub.isActive;
  const currentPlan = findPlan(sub.plan, plans);
  const expiringSoon = active && sub.daysLeft != null && sub.daysLeft <= 7;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Subscription"
        description="Every plan includes the same features. Longer terms simply cost less per month."
      />

      {!paymentsEnabled && (
        <Callout
          icon={MessageCircle}
          tone="warning"
          title="Online payment is temporarily unavailable"
          action={
            <a
              href={supportWhatsAppUrl("Hi FitWorks! 👋\n\nI'd like to set up a plan for my gym.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg bg-white border border-gray-200 text-[13px] font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              Message us
            </a>
          }
        >
          Our team can set your membership up directly in the meantime.
        </Callout>
      )}

      {expiringSoon && (
        <Callout
          icon={Clock}
          tone="warning"
          title={`Your plan ends in ${sub.daysLeft} day${sub.daysLeft === 1 ? "" : "s"}`}
        >
          Renew below and the new term starts when this one finishes — you won't lose the days you've
          already paid for.
        </Callout>
      )}

      {/* ── Where this gym stands today ── */}
      <Panel
        className={expiringSoon || !paymentsEnabled ? "mt-4 mb-5 sm:mb-6" : "mb-5 sm:mb-6"}
        title="Your membership"
        aside={
          active ? (
            <StatusPill
              label="Active"
              chip="text-emerald-700 bg-emerald-50 border-emerald-200/70"
              dot="bg-emerald-500"
            />
          ) : sub.status === "expired" ? (
            <StatusPill
              label="Expired"
              chip="text-amber-700 bg-amber-50 border-amber-200/70"
              dot="bg-amber-500"
            />
          ) : (
            <StatusPill label="Inactive" chip="text-gray-600 bg-gray-100 border-gray-200" dot="bg-gray-400" />
          )
        }
      >
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Plan
            </dt>
            <dd className="text-[14px] font-bold text-gray-900 mt-1.5">
              {active && currentPlan ? currentPlan.name : "No active plan"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Member since
            </dt>
            <dd className="text-[14px] font-bold text-gray-900 mt-1.5">
              {sub.startedAt ? shortDate(sub.startedAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> {active ? "Renews on" : "Expired on"}
            </dt>
            <dd className="text-[14px] font-bold text-gray-900 mt-1.5">
              {sub.expiresAt ? shortDate(sub.expiresAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Days left
            </dt>
            <dd
              className={`text-[14px] font-bold mt-1.5 tabular-nums ${
                expiringSoon ? "text-[#d91a24]" : "text-gray-900"
              }`}
            >
              {active && sub.daysLeft != null ? sub.daysLeft : "—"}
            </dd>
          </div>
        </dl>
      </Panel>

      {/* ── The three plans ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:mt-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            current={active && sub.plan === plan.id}
            renewing={active}
            busy={busy === plan.id}
            disabled={!paymentsEnabled || (!!busy && busy !== plan.id)}
            onChoose={() => pay(plan)}
          />
        ))}
      </div>

      {/* ── Receipts ── */}
      {history.length > 0 && (
        <Panel className="mt-5" title="Payments" description="Every term you've paid for." bodyClassName="p-0">
          <ul className="divide-y divide-gray-100">
            {history.map((h) => (
              <li key={h.paymentId} className="flex items-center gap-3.5 px-5 py-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-gray-900">
                    {findPlan(h.plan)?.name || h.plan}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {shortDate(h.periodStart)} – {shortDate(h.periodEnd)} · paid {shortDate(h.paidAt)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono truncate">{h.paymentId}</p>
                </div>
                <span className="text-[15px] font-extrabold text-gray-900 tabular-nums shrink-0">
                  {rupees(h.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-2xl bg-white border border-gray-200/80">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-[13px] text-gray-600 leading-relaxed flex-1">
          Payments are handled by Razorpay. FitWorks never sees or stores your card details, and there is
          no auto-renewal — your plan simply ends unless you renew it.
        </p>
      </div>
    </div>
  );
}
