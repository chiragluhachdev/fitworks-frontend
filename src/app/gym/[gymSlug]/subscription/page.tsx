"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Check,
  Sparkles,
  CalendarDays,
  Clock,
  MessageCircle,
  ShieldCheck,
  Receipt,
  Crown,
  Lock,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
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

/* ─────────────────────────── Membership ─────────────────────────── */

function MembershipCard({
  sub,
  plan,
  term,
  onChoose,
}: {
  sub: Membership;
  plan: { name: string } | null;
  term?: { periodStart: string; periodEnd: string };
  onChoose: () => void;
}) {
  const active = sub.isActive;
  const expired = !active && sub.status === "expired";

  let elapsed: number | null = null;
  if (active && term) {
    const start = new Date(term.periodStart).getTime();
    const end = new Date(term.periodEnd).getTime();
    if (end > start) {
      elapsed = Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
    }
  }

  const soon = active && sub.daysLeft != null && sub.daysLeft <= 14;

  return (
    <section
      className={`relative overflow-hidden rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 transition-all ${
        active
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white shadow-[0_20px_50px_-16px_rgba(16,24,40,0.5)]"
          : "bg-white ring-1 ring-gray-200/70 shadow-sm hover:shadow-md"
      }`}
    >
      {active && (
        <>
          <span
            aria-hidden
            className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-brand opacity-20 blur-[80px] pointer-events-none"
          />
          <span
            aria-hidden
            className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-amber-500 opacity-15 blur-[60px] pointer-events-none"
          />
        </>
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <span
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
              active ? "bg-white/10 text-amber-300 ring-1 ring-white/20 backdrop-blur-md" : "bg-gray-50 text-gray-400 ring-1 ring-gray-200/50"
            }`}
          >
            {active ? <Crown className="w-5 h-5 sm:w-6 sm:h-6" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6" />}
          </span>
          <div className="min-w-0">
            <p
              className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] ${
                active ? "text-white/50" : "text-gray-400"
              }`}
            >
              Your membership
            </p>
            <p
              className={`text-[17px] sm:text-[20px] font-extrabold tracking-[-0.02em] mt-0.5 truncate ${
                active ? "text-white" : "text-gray-900"
              }`}
            >
              {active && plan ? plan.name : expired ? "Plan Expired" : "No Active Plan"}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 shrink-0 text-[11px] sm:text-[12px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full ring-1 ${
            active
              ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
              : expired
              ? "bg-amber-50 text-amber-700 ring-amber-200/70"
              : "bg-gray-100 text-gray-500 ring-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-emerald-400 animate-pulse" : expired ? "bg-amber-500" : "bg-gray-400"
            }`}
          />
          {active ? "Active" : expired ? "Expired" : "Inactive"}
        </span>
      </div>

      {active ? (
        <div className="relative mt-8">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[36px] sm:text-[42px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
              {sub.daysLeft ?? "—"}
              <span className="text-[15px] font-bold text-white/50 ml-2.5">
                day{sub.daysLeft === 1 ? "" : "s"} left
              </span>
            </p>
            {soon && (
              <span className="text-[12px] font-bold text-amber-900 bg-amber-400 px-3 py-1 rounded-full shadow-sm mb-1.5 animate-pulse">
                Renew soon
              </span>
            )}
          </div>

          {elapsed !== null && (
            <div className="mt-5 h-2.5 w-full rounded-full bg-white/10 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-[width] duration-700 relative"
                style={{ width: `${elapsed}%` }}
              >
                 <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          )}

          <dl className="flex flex-wrap gap-x-10 gap-y-4 mt-8 pt-6 border-t border-white/10">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Member since
              </dt>
              <dd className="text-[15px] font-semibold mt-1.5">
                {sub.startedAt ? shortDate(sub.startedAt) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Renews on
              </dt>
              <dd className="text-[15px] font-semibold mt-1.5">
                {sub.expiresAt ? shortDate(sub.expiresAt) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[13px] text-gray-500 leading-relaxed max-w-sm hidden sm:block">
            {expired
              ? "Renew to keep posting vacancies and having our team find trainers for you."
              : "Post vacancies and let the FitWorks team find suitable trainers for you. Every plan includes the same features."}
          </p>
          <Button size="md" onClick={onChoose} className="w-full sm:w-auto shrink-0 shadow-sm">
            {expired ? "Renew Plan" : "View Plans"} <ArrowDown className="w-4 h-4 ml-1 opacity-70" />
          </Button>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────── Plan card ─────────────────────────── */

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
      className={`relative flex flex-col justify-between rounded-[24px] bg-white p-5 sm:p-6 transition-all duration-300 ${
        plan.best
          ? "ring-2 ring-gray-900 shadow-[0_20px_50px_-12px_rgba(16,24,40,0.18)] hover:shadow-[0_25px_60px_-12px_rgba(16,24,40,0.25)] hover:-translate-y-1.5 z-10"
          : "ring-1 ring-gray-200/80 shadow-sm hover:shadow-xl hover:ring-gray-300 hover:-translate-y-1"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 min-h-[28px]">
          {plan.best ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-[0.1em] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Recommended
            </span>
          ) : (
            <span />
          )}
          {plan.savingsPercent > 0 && (
            <span className="inline-flex items-center shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-[11px] font-extrabold">
              Save {plan.savingsPercent}%
            </span>
          )}
        </div>

        <h3 className="text-[16px] font-bold text-gray-500 mt-5">{plan.name.replace("FitWorks ", "")}</h3>

        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-[36px] sm:text-[40px] font-extrabold text-gray-900 tracking-[-0.035em] leading-none">
            {rupees(plan.price)}
          </span>
          <span className="text-[13px] font-semibold text-gray-400">{plan.cadence}</span>
        </div>

        <p className="text-[13px] text-gray-500 mt-4 leading-relaxed pr-2">
          {plan.months === 1 ? (
            <>Billed every month. Cancel by simply not renewing.</>
          ) : (
            <>
              Works out to <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-md">{rupees(plan.perMonth)}</span> a month, paid once upfront.
            </>
          )}
        </p>

        <ul className="mt-5 space-y-2.5">
          {PLAN_FEATURES.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-gray-600 leading-snug">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-px" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100/80">
        {current ? (
          <>
            <div className="h-12 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700 text-[14px] font-bold flex items-center justify-center gap-2">
              <Check className="w-4.5 h-4.5" /> Current Plan
            </div>
            <button
              onClick={onChoose}
              disabled={busy || disabled}
              className="w-full text-[13px] font-bold text-gray-500 hover:text-brand mt-3 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {busy ? "Opening…" : "Extend this plan"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <Button
            block
            size="lg"
            variant={plan.best ? "primary" : "secondary"}
            loading={busy}
            disabled={disabled}
            onClick={onChoose}
            className="w-full text-[14px] shadow-sm"
          >
            {renewing ? "Switch to this" : "Choose plan"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function GymSubscriptionPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [sub, setSub] = useState<Membership | null>(null);
  const [plans, setPlans] = useState<GymPlan[]>(FALLBACK_PLANS);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plansRef = useRef<HTMLDivElement>(null);
  const [visibleCard, setVisibleCard] = useState(0);

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

  const recommended = Math.max(0, plans.findIndex((p) => p.best));

  useEffect(() => {
    if (loading) return;
    const track = trackRef.current;
    const card = cardRefs.current[recommended];
    if (!track || !card) return;
    if (track.scrollWidth <= track.clientWidth) return;

    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "instant" as ScrollBehavior,
    });
    setVisibleCard(recommended);
  }, [loading, recommended, plans.length]);

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let best = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - mid);
      if (d < best) {
        best = d;
        closest = i;
      }
    });
    setVisibleCard(closest);
  };

  const scrollToCard = (i: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[i];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  };

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
        theme: { color: "#111827" }, // Updated to match sleek dark styling
        modal: {
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
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="mb-6 mt-2">
        <h1 className="text-[24px] sm:text-[28px] font-extrabold text-gray-900 tracking-[-0.02em] leading-tight">
          Subscription
        </h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Every plan includes the exact same features. Longer terms simply cost less per month.
        </p>
      </div>

      {!paymentsEnabled && (
        <div className="mb-6">
          <Callout
            icon={MessageCircle}
            tone="warning"
            title="Online payment is temporarily unavailable"
            action={
              <a
                href={supportWhatsAppUrl("Hi FitWorks! 👋\n\nI'd like to set up a plan for my gym.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-white ring-1 ring-gray-200 shadow-sm text-[13px] font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Message us
              </a>
            }
          >
            Our team can set your membership up directly in the meantime.
          </Callout>
        </div>
      )}

      {expiringSoon && (
        <div className="mb-6">
          <Callout
            icon={Clock}
            tone="warning"
            title={`Your plan ends in ${sub.daysLeft} day${sub.daysLeft === 1 ? "" : "s"}`}
          >
            Renew below and the new term starts when this one finishes — you won't lose the days
            you've already paid for.
          </Callout>
        </div>
      )}

      <MembershipCard
        sub={sub}
        plan={currentPlan}
        term={history[0]}
        onChoose={() => plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
      />

      {/* ── Plans ── */}
      <div ref={plansRef} className="mt-10 sm:mt-14 scroll-mt-24">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-[20px] sm:text-[24px] font-extrabold text-gray-900 tracking-tight">
            {active ? "Change or extend your plan" : "Choose your plan"}
          </h2>
          <p className="text-gray-500 mt-1.5 text-sm">Select the billing cycle that works best for you.</p>
        </div>

        {/* Added py-4 -my-4 to prevent hover shadows from being clipped inside the hidden overflow wrapper */}
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 py-4 -my-4
            md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible items-stretch"
        >
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="snap-center shrink-0 w-[82%] sm:w-[55%] md:w-auto h-auto"
            >
              <PlanCard
                plan={plan}
                current={active && sub.plan === plan.id}
                renewing={active}
                busy={busy === plan.id}
                disabled={!paymentsEnabled || (!!busy && busy !== plan.id)}
                onChoose={() => pay(plan)}
              />
            </div>
          ))}
        </div>

        <div className="flex md:hidden items-center justify-center gap-2 mt-6">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => scrollToCard(i)}
              aria-label={`Show ${plan.name}`}
              aria-current={visibleCard === i}
              className={`h-2 rounded-full transition-all duration-300 ${
                visibleCard === i ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <Panel
        className="mt-10 sm:mt-12 bg-gray-50 border-none ring-1 ring-gray-200/50"
        title="Every plan includes"
        description="Full access to FitWorks platform. Nothing is held back from the shorter terms."
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {PLAN_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[14px] text-gray-700 leading-snug">
              <span className="bg-emerald-100 rounded-full p-0.5 mt-0.5 shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </Panel>

      {/* ── Receipts ── */}
      {history.length > 0 && (
        <Panel
          className="mt-8 shadow-sm ring-1 ring-gray-200/70"
          title="Payment History"
          description="A record of every term you've paid for."
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-gray-100">
            {history.map((h) => (
              <li key={h.paymentId} className="flex items-center gap-4 px-5 sm:px-6 py-4.5 hover:bg-gray-50/50 transition-colors">
                <span className="w-12 h-12 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] sm:text-[15px] font-bold text-gray-900">
                    {findPlan(h.plan, plans)?.name || h.plan}
                  </p>
                  <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1">
                    {shortDate(h.periodStart)} – {shortDate(h.periodEnd)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono truncate">{h.paymentId}</p>
                </div>
                <span className="text-[15px] sm:text-[16px] font-extrabold text-gray-900 tabular-nums shrink-0">
                  {rupees(h.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="mt-8 flex items-start sm:items-center gap-4 p-5 rounded-[24px] bg-gray-50 ring-1 ring-gray-200/70">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed">
          Payments are securely handled by Razorpay. FitWorks never sees or stores your card details, and
          there is no auto-renewal — your plan simply ends unless you renew it manually.
        </p>
      </div>
    </div>
  );
}