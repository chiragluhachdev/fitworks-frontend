"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Sparkles, CalendarDays, CreditCard, Clock, MessageCircle } from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import StatusPill from "@/components/workspace/StatusPill";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import { GYM_PLANS, PLAN_FEATURES, findPlan, rupees, shortDate, type GymPlan } from "@/lib/hiring";
import { supportWhatsAppUrl } from "@/lib/whatsapp";

/** WhatsApp is how our team actually sets a plan up. */
const supportLink = (gymName: string, planName: string) =>
  supportWhatsAppUrl(`Hi FitWorks! 👋\n\nI'd like to activate the ${planName} plan for ${gymName}.`);

function PlanCard({
  plan,
  current,
  requested,
  onChoose,
  busy,
}: {
  plan: GymPlan;
  current: boolean;
  requested: boolean;
  onChoose: () => void;
  busy: boolean;
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
          <div className="h-11 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-sm font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Current plan
          </div>
        ) : (
          <Button
            block
            variant={plan.best ? "primary" : "secondary"}
            loading={busy}
            onClick={onChoose}
          >
            {requested ? "Requested" : "Choose plan"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function GymSubscriptionPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [gym, setGym] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any; subscription?: any }>(`/gyms/${gymSlug}`);
    if (res.ok && res.data?.data) {
      setGym(res.data.data);
      setSub(res.data.subscription);
      setError("");
    } else {
      setError(res.error || "We couldn't load your subscription.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const choose = async (plan: GymPlan) => {
    setBusy(plan.id);
    const res = await api<{ subscription?: any }>(`/gyms/${gymSlug}/plan-request`, {
      method: "POST",
      body: JSON.stringify({ plan: plan.id }),
    });
    setBusy(null);
    if (res.ok) {
      setSub(res.data?.subscription ?? sub);
      toast.success("Request received — our team will be in touch.");
      // Billing is handled by hand for now, so hand them straight to the team.
      window.open(supportLink(gym?.gymName || "our gym", plan.name), "_blank", "noopener");
    } else {
      toast.error(res.error || "Couldn't send your request.");
    }
  };

  if (loading) return <PageSkeleton stats={0} rows={3} />;
  if (!gym) return <ErrorState message={error} onRetry={load} />;

  const active = !!sub?.isActive;
  const currentPlan = findPlan(sub?.plan);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Subscription"
        description="Every plan includes the same features. Longer terms simply cost less per month."
      />

      {/* ── Where this gym stands today ── */}
      <Panel
        className="mb-5 sm:mb-6"
        title="Your membership"
        aside={
          active ? (
            <StatusPill label="Active" chip="text-emerald-700 bg-emerald-50 border-emerald-200/70" dot="bg-emerald-500" />
          ) : sub?.status === "expired" ? (
            <StatusPill label="Expired" chip="text-amber-700 bg-amber-50 border-amber-200/70" dot="bg-amber-500" />
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
              <CalendarDays className="w-3.5 h-3.5" /> Started
            </dt>
            <dd className="text-[14px] font-bold text-gray-900 mt-1.5">
              {active ? shortDate(sub.startedAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Expires
            </dt>
            <dd className="text-[14px] font-bold text-gray-900 mt-1.5">
              {active ? shortDate(sub.expiresAt) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Days left
            </dt>
            <dd className="text-[14px] font-bold text-gray-900 mt-1.5 tabular-nums">
              {active && sub.daysLeft != null ? sub.daysLeft : "—"}
            </dd>
          </div>
        </dl>

        {sub?.requestedPlan && !active && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-gray-600 leading-relaxed">
              You've requested the{" "}
              <span className="font-bold text-gray-900">{findPlan(sub.requestedPlan)?.name}</span> plan.
              Our team will get in touch to set it up.
            </p>
          </div>
        )}
      </Panel>

      {/* ── The three plans ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:mt-8">
        {GYM_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            current={active && sub?.plan === plan.id}
            requested={sub?.requestedPlan === plan.id}
            busy={busy === plan.id}
            onChoose={() => choose(plan)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-2xl bg-white border border-gray-200/80">
        <MessageCircle className="w-5 h-5 text-[#d91a24] shrink-0" />
        <p className="text-[13px] text-gray-600 leading-relaxed flex-1">
          Plans are set up by our team, so there's nothing to pay online. Choose one and we'll take it
          from there — usually the same day.
        </p>
      </div>
    </div>
  );
}
