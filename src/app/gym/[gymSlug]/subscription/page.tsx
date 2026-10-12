"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Check,
  CalendarDays,
  MessageCircle,
  ShieldCheck,
  Receipt,
  Crown,
  Lock,
  Infinity as InfinityIcon,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import Callout from "@/components/workspace/Callout";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import { openCheckout, type RazorpayResult } from "@/lib/razorpay";
import {
  FALLBACK_PLAN,
  PLAN_FEATURES,
  normalizeGymPlan,
  rupees,
  shortDate,
  type GymAccessPlan,
} from "@/lib/hiring";
import { supportWhatsAppUrl } from "@/lib/whatsapp";

interface Access {
  isActive: boolean;
  status: "inactive" | "active";
  activatedAt?: string | null;
  amountPaid?: number;
}

interface PaymentRecord {
  orderId: string;
  paymentId: string;
  amount: number;
  paidAt: string;
}

export default function GymAccessPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [access, setAccess] = useState<Access | null>(null);
  // The price is set by an admin, so it arrives with the account rather than
  // being compiled in. The launch price only fills the first paint.
  const [plan, setPlan] = useState<GymAccessPlan>(FALLBACK_PLAN);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{
      subscription?: Access;
      plan?: GymAccessPlan;
      history?: PaymentRecord[];
      paymentsEnabled?: boolean;
    }>(`/gyms/${gymSlug}/membership`);
    if (res.ok && res.data?.subscription) {
      setAccess(res.data.subscription);
      if (res.data.plan) setPlan(normalizeGymPlan(res.data.plan));
      setHistory(res.data.history || []);
      setPaymentsEnabled(res.data.paymentsEnabled !== false);
      setError("");
    } else {
      setError(res.error || "We couldn't load your account.");
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
  const pay = async () => {
    setBusy(true);

    const order = await api<any>(`/gyms/${gymSlug}/membership/order`, {
      method: "POST",
      body: JSON.stringify({}),
    });

    if (!order.ok) {
      setBusy(false);
      if (order.data?.code === "PAYMENT_UNAVAILABLE") {
        toast.error("Online payment is unavailable right now — message us and we'll sort it out.");
      } else if (order.data?.code === "ALREADY_ACTIVE") {
        toast.success("Your gym already has access.");
        load();
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
        description: "Gym access — one-time",
        order_id: d.orderId,
        prefill: {
          name: d.contactName || d.gymName,
          email: d.contactEmail || undefined,
          contact: d.contactPhone || undefined,
        },
        notes: { gym: d.gymName || gymSlug },
        theme: { color: "#E92E3D" },
        modal: {
          // Closing the window is not a failure — just stop the spinner.
          ondismiss: () => setBusy(false),
        },
        handler: async (result: RazorpayResult) => {
          const verify = await api<{ subscription?: Access; message?: string }>(
            `/gyms/${gymSlug}/membership/verify`,
            { method: "POST", body: JSON.stringify(result) }
          );
          setBusy(false);

          if (verify.ok && verify.data?.subscription) {
            setAccess(verify.data.subscription);
            toast.success(verify.data.message || "Payment received — your gym now has access.");
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
      setBusy(false);
      toast.error(err?.message || "Couldn't open the payment window.");
    }
  };

  if (loading) return <PageSkeleton stats={0} rows={3} />;
  if (!access) return <ErrorState message={error} onRetry={load} />;

  const active = access.isActive;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Gym access"
        description="One payment, and your gym keeps full access to FitWorks. No renewals, no expiry."
      />

      {!paymentsEnabled && !active && (
        <div className="mb-4">
          <Callout
            icon={MessageCircle}
            tone="warning"
            title="Online payment is temporarily unavailable"
            action={
              <a
                href={supportWhatsAppUrl("Hi FitWorks! 👋\n\nI'd like to set up access for my gym.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg bg-white ring-1 ring-gray-200 text-[13px] font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Message us
              </a>
            }
          >
            Our team can set your access up directly in the meantime.
          </Callout>
        </div>
      )}

      {/* ── Where this gym stands ── */}
      {active ? (
        <section className="relative overflow-hidden rounded-[20px] p-5 sm:p-7 bg-gray-900 ring-1 ring-gray-900 text-white">
          <span
            aria-hidden
            className="absolute -top-20 -right-12 w-64 h-64 rounded-full bg-brand opacity-25 blur-3xl pointer-events-none"
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-11 h-11 rounded-xl bg-white/10 text-amber-300 ring-1 ring-white/15 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
                  Your access
                </p>
                <p className="text-[17px] sm:text-[19px] font-extrabold tracking-[-0.01em] mt-0.5">
                  Full access, permanently
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>

          <p className="relative text-[13px] text-white/60 leading-relaxed mt-4 max-w-md">
            You paid once and that's it — there is nothing to renew and nothing that runs out. Post
            as many vacancies as you need.
          </p>

          <dl className="relative flex flex-wrap gap-x-8 gap-y-3 mt-5 pt-5 border-t border-white/10">
            <div>
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40 flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" /> Member since
              </dt>
              <dd className="text-[13.5px] font-bold mt-1">
                {access.activatedAt ? shortDate(access.activatedAt) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40 flex items-center gap-1.5">
                <InfinityIcon className="w-3 h-3" /> Expires
              </dt>
              <dd className="text-[13.5px] font-bold mt-1">Never</dd>
            </div>
            {!!access.amountPaid && (
              <div>
                <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40 flex items-center gap-1.5">
                  <Receipt className="w-3 h-3" /> Paid
                </dt>
                <dd className="text-[13.5px] font-bold mt-1 tabular-nums">
                  {rupees(access.amountPaid)}
                </dd>
              </div>
            )}
          </dl>
        </section>
      ) : (
        /* ── The offer ── */
        <section className="relative overflow-hidden rounded-[20px] bg-white ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="p-5 sm:p-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-[0.1em]">
              <Sparkles className="w-3 h-3" /> One-time payment
            </span>

            <div className="flex items-baseline gap-2 mt-5">
              <span className="text-[44px] sm:text-[56px] font-extrabold text-gray-900 tracking-[-0.04em] leading-none">
                {rupees(plan.price)}
              </span>
              <span className="text-[14px] font-semibold text-gray-400">once</span>
            </div>

            <p className="text-[13.5px] sm:text-[15px] text-gray-500 leading-relaxed mt-3 max-w-md">
              Pay once and your gym keeps full access to FitWorks. No monthly fee, no renewal, no
              expiry date.
            </p>

            <Button
              size="lg"
              loading={busy}
              disabled={!paymentsEnabled}
              onClick={pay}
              className="mt-6 w-full sm:w-auto"
            >
              {!busy && <Lock className="w-4 h-4" />} Pay {rupees(plan.price)} &amp; unlock
            </Button>

            <p className="text-[11.5px] text-gray-400 mt-3">
              Secured by Razorpay. We never see your card details.
            </p>
          </div>

          <div className="px-5 sm:px-8 py-5 sm:py-6 bg-gray-50/70 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-3.5">
              What you get
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {PLAN_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-gray-700 leading-snug"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── What they bought, once they have ── */}
      {active && (
        <Panel className="mt-5" title="What your access includes">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {PLAN_FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-gray-600 leading-snug"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
                {f}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* ── Receipt ── */}
      {history.length > 0 && (
        <Panel className="mt-5" title="Payment" bodyClassName="p-0">
          <ul className="divide-y divide-gray-100">
            {history.map((h) => (
              <li key={h.paymentId} className="flex items-center gap-3.5 px-4 sm:px-5 py-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] sm:text-[14px] font-bold text-gray-900">
                    Gym access — one-time
                  </p>
                  <p className="text-[11.5px] sm:text-[12px] text-gray-500 mt-0.5">
                    Paid {shortDate(h.paidAt)}
                  </p>
                  <p className="text-[10.5px] text-gray-400 mt-0.5 font-mono truncate">
                    {h.paymentId}
                  </p>
                </div>
                <span className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 tabular-nums shrink-0">
                  {rupees(h.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="mt-5 flex items-start sm:items-center gap-3 p-4 sm:p-5 rounded-[20px] bg-white ring-1 ring-gray-200/70">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[12.5px] sm:text-[13px] text-gray-600 leading-relaxed">
          Payments are handled by Razorpay. FitWorks never sees or stores your card details, and
          there is no subscription to cancel — this is a single payment.
        </p>
      </div>
    </div>
  );
}
