"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldAlert, Save, IndianRupee, RotateCcw, Info } from "lucide-react";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import { Field, Input } from "@/components/workspace/Field";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import { DEFAULT_GYM_ACCESS_PRICE, rupees } from "@/lib/hiring";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [otpEnabled, setOtpEnabled] = useState(true);
  const [price, setPrice] = useState(String(DEFAULT_GYM_ACCESS_PRICE));
  /** What was last saved, so we can tell whether anything changed. */
  const [saved, setSaved] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>("/admin/settings");
    if (res.ok && res.data?.data) {
      const d = res.data.data;
      setOtpEnabled(d.otpEnabled !== false);
      const next = String(d.gymAccessPrice ?? DEFAULT_GYM_ACCESS_PRICE);
      setPrice(next);
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

  const numeric = Math.round(Number(price));
  const valid = Number.isFinite(numeric) && Number.isInteger(Number(price)) && numeric >= 1;
  const dirty = saved !== null && price !== saved;

  const save = async () => {
    if (!valid) return toast.error("Enter a whole number of rupees, at least ₹1.");

    setSaving(true);
    const res = await api<{ data?: any }>("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ otpEnabled, gymAccessPrice: numeric }),
    });
    setSaving(false);

    if (res.ok) {
      setSaved(price);
      toast.success("Settings saved — the new price is live.");
    } else {
      toast.error(res.error || "Couldn't save the settings.");
    }
  };

  const reset = () => setPrice(String(DEFAULT_GYM_ACCESS_PRICE));

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

      {/* ── Gym access price ── */}
      <Panel
        className="mb-5"
        title="Gym access price"
        description="What a gym pays, once, for full access. There is no renewal."
        aside={
          <button
            onClick={reset}
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-brand transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <Field
            label="One-time price"
            htmlFor="gymAccessPrice"
            hint="Whole rupees."
            error={!valid ? "Enter a whole number, at least ₹1." : undefined}
            className="sm:w-56"
          >
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                id="gymAccessPrice"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-9 font-bold tabular-nums"
              />
            </div>
          </Field>

          {/* Rendered the way a gym will see it, so the preview cannot flatter
              the reality. */}
          <div className="flex-1 rounded-xl ring-1 ring-gray-200/70 bg-gray-50/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
              How this reads to a gym
            </p>
            <p className="text-[26px] font-extrabold text-gray-900 tracking-[-0.03em] leading-none mt-2 tabular-nums">
              {valid ? rupees(numeric) : "—"}
              <span className="text-[13px] font-semibold text-gray-400 ml-1.5">once</span>
            </p>
            <p className="text-[11.5px] text-gray-500 mt-1.5">No renewal, no expiry.</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 text-[12px] text-gray-500 leading-relaxed">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-px" />
          <p>
            A new price applies to the next payment only. Gyms that have already paid keep their
            access, and their receipt keeps the amount they were actually charged.
            {dirty && <span className="font-bold text-brand"> You have unsaved changes.</span>}
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
