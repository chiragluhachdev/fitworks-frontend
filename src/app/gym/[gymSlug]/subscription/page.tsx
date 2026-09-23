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
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
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

/**
 * Where this gym stands.
 *
 * Two genuinely different states rather than one table: an inactive gym has
 * nothing to report, so showing it four fields of em-dashes said nothing and
 * looked broken. It gets the reason and the way out instead.
 */
function MembershipCard({
  sub,
  plan,
  term,
  onChoose,
}: {
  sub: Membership;
  plan: { name: string } | null;
  /** The term currently paid for, for the progress bar. */
  term?: { periodStart: string; periodEnd: string };
  onChoose: () => void;
}) {
  const active = sub.isActive;
  const expired = !active && sub.status === "expired";

  // How far through the paid term we are. Only meaningful with both ends.
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
      className={`relative overflow-hidden rounded-[20px] p-4 sm:p-6 ring-1 ${
        active
          ? "bg-gray-900 ring-gray-900 text-white"
          : "bg-white ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute -top-20 -right-12 w-64 h-64 rounded-full bg-brand opacity-25 blur-3xl pointer-events-none"
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              active ? "bg-white/10 text-amber-300 ring-1 ring-white/15" : "bg-gray-100 text-gray-500"
            }`}
          >
            {active ? <Crown className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </span>
          <div className="min-w-0">
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.12em] ${
                active ? "text-white/45" : "text-gray-400"
              }`}
            >
              Your membership
            </p>
            <p
              className={`text-[16px] sm:text-[18px] font-extrabold tracking-[-0.01em] mt-0.5 truncate ${
                active ? "text-white" : "text-gray-900"
              }`}
            >
              {active && plan ? plan.name : expired ? "Your plan has expired" : "No active plan"}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ${
            active
              ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/40"
              : expired
              ? "bg-amber-50 text-amber-700 ring-amber-200/70"
              : "bg-gray-100 text-gray-500 ring-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-emerald-400" : expired ? "bg-amber-500" : "bg-gray-400"
            }`}
          />
          {active ? "Active" : expired ? "Expired" : "Inactive"}
        </span>
      </div>

      {active ? (
        <div className="relative mt-5">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[26px] sm:text-[30px] font-extrabold leading-none tracking-[-0.02em] tabular-nums">
              {sub.daysLeft ?? "—"}
              <span className="text-[13px] font-bold text-white/50 ml-1.5">
                day{sub.daysLeft === 1 ? "" : "s"} left
              </span>
            </p>
            {soon && (
              <span className="text-[11px] font-bold text-amber-300 pb-1">Renew soon</span>
            )}
          </div>

          {elapsed !== null && (
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/12 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/70 transition-[width] duration-700"
                style={{ width: `${elapsed}%` }}
              />
            </div>
          )}

          <dl className="flex flex-wrap gap-x-7 gap-y-2.5 mt-5 pt-5 border-t border-white/10">
            <div>
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40 flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" /> Member since
              </dt>
              <dd className="text-[13px] font-bold mt-1">
                {sub.startedAt ? shortDate(sub.startedAt) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Renews on
              </dt>
              <dd className="text-[13px] font-bold mt-1">
                {sub.expiresAt ? shortDate(sub.expiresAt) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-[13px] text-gray-500 leading-relaxed">
            {expired
              ? "Renew to keep posting vacancies and having our team find trainers for you."
              : "Post vacancies and let the FitWorks team find suitable trainers for you. Every plan includes the same features."}
          </p>
          <Button size="md" onClick={onChoose} className="mt-4 w-full sm:w-auto">
            <ArrowDown className="w-4 h-4" /> {expired ? "Renew your plan" : "Choose a plan"}
          </Button>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────── Plan card ─────────────────────────── */

/**
 * One term, priced.
 *
 * The feature list used to be repeated inside all three cards. Every plan
 * carries the same features, so nine identical ticks three times was nine
 * lines of noise that pushed the actual decision — how long, how much — off
 * the bottom of a phone. The list now appears once, below.
 */
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
      className={`relative flex flex-col rounded-[20px] bg-white p-5 transition-all ${
        plan.best
          ? "ring-2 ring-gray-900 shadow-[0_18px_44px_-20px_rgba(16,24,40,0.35)]"
          : "ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 min-h-[26px]">
        {plan.best ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-[0.1em]">
            <Sparkles className="w-3 h-3" /> Recommended
          </span>
        ) : (
          <span />
        )}
        {plan.savingsPercent > 0 && (
          <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 text-[10.5px] font-extrabold">
            Save {plan.savingsPercent}%
          </span>
        )}
      </div>

      <h3 className="text-[14px] font-bold text-gray-500 mt-4">{plan.name.replace("FitWorks ", "")}</h3>

      <div className="flex items-baseline gap-1.5 mt-1.5">
        <span className="text-[32px] font-extrabold text-gray-900 tracking-[-0.035em] leading-none">
          {rupees(plan.price)}
        </span>
        <span className="text-[12.5px] font-semibold text-gray-400">{plan.cadence}</span>
      </div>

      <p className="text-[12px] text-gray-500 mt-2.5 leading-relaxed">
        {plan.months === 1 ? (
          <>Billed every month. Cancel by simply not renewing.</>
        ) : (
          <>
            Works out to{" "}
            <span className="font-bold text-gray-900">{rupees(plan.perMonth)}</span> a month, paid
            once.
          </>
        )}
      </p>

      <div className="mt-5">
        {current ? (
          <>
            <div className="h-11 rounded-xl bg-emerald-50 ring-1 ring-emerald-200/70 text-emerald-700 text-[13.5px] font-bold flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Current plan
            </div>
            <button
              onClick={onChoose}
              disabled={busy || disabled}
              className="w-full text-[12.5px] font-bold text-gray-500 hover:text-brand mt-2.5 transition-colors cursor-pointer disabled:opacity-50"
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
  // Prices are set by an admin, so they arrive with the membership rather
  // than being compiled in. The launch prices only fill the first paint.
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

  /**
   * Open the carousel on the recommended plan.
   *
   * Instant rather than smooth: the page sets scroll-behavior globally, and a
   * carousel that slides itself sideways on load looks like a glitch.
   */
  const recommended = Math.max(0, plans.findIndex((p) => p.best));

  useEffect(() => {
    if (loading) return;
    const track = trackRef.current;
    const card = cardRefs.current[recommended];
    if (!track || !card) return;
    // Only when it actually scrolls — on desktop this is a grid.
    if (track.scrollWidth <= track.clientWidth) return;

    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "instant" as ScrollBehavior,
    });
    setVisibleCard(recommended);
  }, [loading, recommended, plans.length]);

  /** Which card is centred, for the dots. */
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
        theme: { color: "#E92E3D" },
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
        <div className="mb-4">
          <Callout
            icon={MessageCircle}
            tone="warning"
            title="Online payment is temporarily unavailable"
            action={
              <a
                href={supportWhatsAppUrl("Hi FitWorks! 👋\n\nI'd like to set up a plan for my gym.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg bg-white ring-1 ring-gray-200 text-[13px] font-bold text-gray-800 hover:bg-gray-50 transition-colors"
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
        <div className="mb-4">
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
      <div ref={plansRef} className="mt-6 sm:mt-8 scroll-mt-24">
        <h2 className="text-[15px] sm:text-[16px] font-bold text-gray-900 px-1">
          {active ? "Change or extend your plan" : "Choose a plan"}
        </h2>

        {/*
          One track, two behaviours: a snapping carousel on a phone, where three
          cards side by side would be 110px each, and a plain grid from md up.
          The cards sit at 78% so the next and previous ones peek in — that edge
          is the only thing that tells a thumb there is more to see.
        */}
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="mt-3.5 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-3 px-3
            md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible"
        >
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="snap-center shrink-0 w-[78%] sm:w-[52%] md:w-auto py-1"
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

        {/* Dots, mobile only — they say how many there are and where you are. */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => scrollToCard(i)}
              aria-label={`Show ${plan.name}`}
              aria-current={visibleCard === i}
              className={`h-1.5 rounded-full transition-all ${
                visibleCard === i ? "w-6 bg-gray-900" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Features, once ── */}
      <Panel
        className="mt-5 sm:mt-6"
        title="Every plan includes"
        description="Nothing is held back from the shorter terms."
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {PLAN_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-gray-600 leading-snug">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
              {f}
            </li>
          ))}
        </ul>
      </Panel>

      {/* ── Receipts ── */}
      {history.length > 0 && (
        <Panel
          className="mt-5"
          title="Payments"
          description="Every term you've paid for."
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-gray-100">
            {history.map((h) => (
              <li key={h.paymentId} className="flex items-center gap-3.5 px-4 sm:px-5 py-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] sm:text-[14px] font-bold text-gray-900">
                    {findPlan(h.plan, plans)?.name || h.plan}
                  </p>
                  <p className="text-[11.5px] sm:text-[12px] text-gray-500 mt-0.5">
                    {shortDate(h.periodStart)} – {shortDate(h.periodEnd)}
                  </p>
                  <p className="text-[10.5px] text-gray-400 mt-0.5 font-mono truncate">{h.paymentId}</p>
                </div>
                <span className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 tabular-nums shrink-0">
                  {rupees(h.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="mt-5 sm:mt-6 flex items-start sm:items-center gap-3 p-4 sm:p-5 rounded-[20px] bg-white ring-1 ring-gray-200/70">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[12.5px] sm:text-[13px] text-gray-600 leading-relaxed">
          Payments are handled by Razorpay. FitWorks never sees or stores your card details, and
          there is no auto-renewal — your plan simply ends unless you renew it.
        </p>
      </div>
    </div>
  );
}
