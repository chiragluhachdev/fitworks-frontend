"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldAlert, Save, IndianRupee, RotateCcw, Info } from "lucide-react";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import { Field, Input } from "@/components/workspace/Field";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [otpEnabled, setOtpEnabled] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>("/admin/settings");
    if (res.ok && res.data?.data) {
      const d = res.data.data;
      setOtpEnabled(d.otpEnabled !== false);
      setError("");
    } else {
      setError(res.error || "We couldn't load the settings.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    const res = await api<{ data?: any }>("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ otpEnabled }),
    });
    setSaving(false);
    toast[res.ok ? "success" : "error"](
      res.ok ? "Settings saved" : res.error || "Couldn't save the settings."
    );
  };

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
            Platform-wide configuration. FitWorks is free for gyms and trainers, so there is
          nothing to price here.
          </p>
        </div>
        <Button onClick={save} loading={saving} className="shrink-0">
          {!saving && <Save className="w-4 h-4" />} Save changes
        </Button>
      </header>

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
