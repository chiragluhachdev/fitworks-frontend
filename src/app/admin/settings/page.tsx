"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldAlert, Save, IndianRupee, RotateCcw, Info } from "lucide-react";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import { Field, Input } from "@/components/workspace/Field";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import {
  DEFAULT_GYM_PRICES,
  buildGymPlans,
  rupees,
  type GymPlanId,
  type GymPrices,
} from "@/lib/hiring";

const PLAN_LABELS: { id: GymPlanId; label: string; hint: string }[] = [
  { id: "monthly", label: "Monthly", hint: "1 month of membership" },
  { id: "quarterly", label: "3 Months", hint: "3 months of membership" },
  { id: "annual", label: "Annual", hint: "12 months of membership" },
];

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [otpEnabled, setOtpEnabled] = useState(true);
  const [prices, setPrices] = useState<Record<GymPlanId, string>>({
    monthly: String(DEFAULT_GYM_PRICES.monthly),
    quarterly: String(DEFAULT_GYM_PRICES.quarterly),
    annual: String(DEFAULT_GYM_PRICES.annual),
  });
  /** What was last saved, so we can tell whether anything changed. */
  const [saved, setSaved] = useState<Record<GymPlanId, string> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>("/admin/settings");
    if (res.ok && res.data?.data) {
      const d = res.data.data;
      setOtpEnabled(d.otpEnabled !== false);
      const next = {
        monthly: String(d.gymPlanPrices?.monthly ?? DEFAULT_GYM_PRICES.monthly),
        quarterly: String(d.gymPlanPrices?.quarterly ?? DEFAULT_GYM_PRICES.quarterly),
        annual: String(d.gymPlanPrices?.annual ?? DEFAULT_GYM_PRICES.annual),
      };
      setPrices(next);
      setSaved(next);
      setError("");
    } else {
      setError(res.error || "We couldn't load the settings.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const numeric = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
  };

  const asPrices = (): GymPrices => ({
    monthly: numeric(prices.monthly),
    quarterly: numeric(prices.quarterly),
    annual: numeric(prices.annual),
  });

  // Previewed with the same maths the gym and pricing pages use, so what an
  // admin sees here is exactly what a customer will see.
  const preview = buildGymPlans(asPrices());

  const ordered =
    numeric(prices.quarterly) >= numeric(prices.monthly) &&
    numeric(prices.annual) >= numeric(prices.quarterly);
  const allValid = PLAN_LABELS.every(({ id }) => numeric(prices[id]) >= 1);
  const dirty =
    !saved || PLAN_LABELS.some(({ id }) => prices[id] !== saved[id]);

  const save = async () => {
    if (!allValid) return toast.error("Every plan needs a price of at least ₹1.");
    if (!ordered) return toast.error("Each longer term should cost more in total than the one before.");

    setSaving(true);
    const res = await api<{ data?: any }>("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ otpEnabled, gymPlanPrices: asPrices() }),
    });
    setSaving(false);

    if (res.ok) {
      setSaved({ ...prices });
      toast.success("Settings saved — new prices are live.");
    } else {
      toast.error(res.error || "Couldn't save the settings.");
    }
  };

  const reset = () =>
    setPrices({
      monthly: String(DEFAULT_GYM_PRICES.monthly),
      quarterly: String(DEFAULT_GYM_PRICES.quarterly),
      annual: String(DEFAULT_GYM_PRICES.annual),
    });

  if (loading) return <PageSkeleton stats={0} rows={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-3xl animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-gray-900 tracking-[-0.02em]">
            Settings
          </h1>
          <p className="text-[14px] text-gray-500 mt-1.5">
            Platform-wide configuration. Changes take effect immediately.
          </p>
        </div>
        <Button onClick={save} loading={saving} className="shrink-0">
          {!saving && <Save className="w-4 h-4" />} Save changes
        </Button>
      </header>

      {/* ── Gym membership prices ── */}
      <Panel
        className="mb-5"
        title="Gym membership prices"
        description="What a gym pays for each term. Every plan includes the same features."
        aside={
          <button
            onClick={reset}
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-[#E92E3D] transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to defaults
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLAN_LABELS.map(({ id, label, hint }) => (
            <Field
              key={id}
              label={label}
              htmlFor={`price-${id}`}
              hint={hint}
              error={numeric(prices[id]) < 1 ? "Enter a price." : undefined}
            >
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id={`price-${id}`}
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={prices[id]}
                  onChange={(e) => setPrices((p) => ({ ...p, [id]: e.target.value }))}
                  className="pl-9 font-bold tabular-nums"
                />
              </div>
            </Field>
          ))}
        </div>

        {!ordered && allValid && (
          <p className="mt-4 text-[12.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 rounded-xl px-3.5 py-2.5">
            Each longer term should cost more in total than the one before it — otherwise the pricing
            page reads as a mistake.
          </p>
        )}

        {/* What a gym will actually see. */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-gray-400 mb-3">
            How this will read to a gym
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {preview.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-gray-200/80 bg-gray-50/60 p-4">
                <p className="text-[12.5px] font-bold text-gray-500">
                  {plan.name.replace("FitWorks ", "")}
                </p>
                <p className="text-[24px] font-extrabold text-gray-900 tracking-[-0.02em] leading-none mt-1.5 tabular-nums">
                  {rupees(plan.price)}
                </p>
                <p className="text-[11.5px] text-gray-500 mt-1.5">{plan.cadence}</p>
                <p className="text-[11.5px] text-gray-500 mt-1">
                  {plan.months === 1 ? (
                    "the benchmark rate"
                  ) : (
                    <>
                      {rupees(plan.perMonth)}/month ·{" "}
                      <span
                        className={
                          plan.savingsPercent > 0 ? "font-bold text-emerald-600" : "text-gray-400"
                        }
                      >
                        {plan.savingsPercent > 0 ? `saves ${plan.savingsPercent}%` : "no saving"}
                      </span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 text-[12px] text-gray-500 leading-relaxed">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-px" />
          <p>
            A new price applies to the next payment only. Gyms already on a plan keep the term they
            paid for, and their receipts keep the amount they were actually charged.
            {dirty && <span className="font-bold text-[#E92E3D]"> You have unsaved changes.</span>}
          </p>
        </div>
      </Panel>

      {/* ── Auth ── */}
      <Panel
        title="Authentication & security"
        description="How people sign up and log in."
      >
        <div className="flex items-start justify-between gap-5 p-4 sm:p-5 bg-gray-50/70 rounded-xl border border-gray-200/80">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-gray-600 shrink-0" />
              <h3 className="text-[14px] font-bold text-gray-900">OTP verification</h3>
            </div>
            <p className="text-[12.5px] text-gray-500 leading-relaxed">
              Require a phone number to be verified by SMS during registration and login. With this
              off, people can register without an OTP and cannot use one to sign in.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={otpEnabled}
              onChange={(e) => setOtpEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E92E3D]" />
            <span className="ml-3 text-[13px] font-bold text-gray-700 w-9">
              {otpEnabled ? "ON" : "OFF"}
            </span>
          </label>
        </div>
      </Panel>

      <div className="flex justify-end mt-5">
        <Button onClick={save} loading={saving} size="lg">
          {!saving && <Save className="w-4 h-4" />} Save changes
        </Button>
      </div>
    </div>
  );
}
