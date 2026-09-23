"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  User,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Settings,
} from "lucide-react";
import Button from "@/components/workspace/Button";
import StatusPill from "@/components/workspace/StatusPill";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";

const VERIFICATION: Record<string, { label: string; chip: string; dot: string }> = {
  verified: {
    label: "Verified",
    chip: "text-emerald-700 bg-emerald-50 border-emerald-200/70",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Under review",
    chip: "text-amber-700 bg-amber-50 border-amber-200/70",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Needs attention",
    chip: "text-red-700 bg-red-50 border-red-200/70",
    dot: "bg-brand",
  },
};

const STEPS = [
  {
    num: "1",
    title: "Complete your profile",
    desc: "Add your experience, specializations, certifications and a photo.",
  },
  {
    num: "2",
    title: "Get verified",
    desc: "Upload your fitness certificate and government ID for our team to review.",
  },
  {
    num: "3",
    title: "We contact you",
    desc: "When a gym needs someone like you, FitWorks reaches out directly — no applying needed.",
  },
];

export default function TrainerOverviewPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>(`/trainers/${trainerSlug}/dashboard`);
    if (res.ok && res.data?.data) {
      setData(res.data.data);
      setError("");
    } else {
      setError(res.error || "We couldn't load your dashboard.");
    }
    setLoading(false);
  }, [trainerSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton />;
  if (!data) return <ErrorState title="Dashboard unavailable" message={error} onRetry={load} />;

  const { trainer, completion } = data;
  const status = trainer?.verificationStatus;
  const badge = VERIFICATION[status] || VERIFICATION.pending;
  const active = status === "verified";
  const firstName = trainer?.personal?.fullName?.split(" ")[0] || "Trainer";
  const percent = completion?.percent ?? 0;

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300 pb-10">

      {/* ── Hero header ── */}
      <section className="relative overflow-hidden bg-[#0a0a0a] rounded-[20px] sm:rounded-[24px] px-5 py-8 sm:px-10 sm:py-12 mb-4 sm:mb-6 shadow-sm flex flex-col justify-center min-h-[240px] sm:min-h-[300px]">
        {/* Background Image Masked to the right — same technique as gym dashboard */}
        <div 
          className="absolute inset-y-0 right-0 w-[80%] sm:w-[60%] bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-lighten pointer-events-none"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 60%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 60%)' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 max-w-xl">
          {trainer?.personal?.profilePhoto ? (
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative shrink-0 ring-2 ring-white/20">
              <Image src={trainer.personal.profilePhoto} alt="" fill className="object-cover" />
            </span>
          ) : (
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 text-white flex items-center justify-center font-extrabold text-2xl shrink-0 ring-1 ring-white/15">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[24px] sm:text-[32px] font-extrabold text-white tracking-[-0.02em] leading-tight">
                Hello, {firstName}
              </h1>
              <StatusPill label={badge.label} chip={badge.chip} dot={badge.dot} />
            </div>
            <p className="text-[13px] sm:text-[14px] text-white/55 mt-2 leading-relaxed max-w-lg">
              {active
                ? "Your profile is live. Our team puts it in front of gyms whose roles match what you do."
                : status === "rejected"
                ? "Your documents weren't approved. Re-upload them and we'll take another look."
                : "Our team is reviewing your documents. Your profile goes live once approved."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Two stat tiles ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Link
          href={`/trainer/${trainerSlug}/profile`}
          className="group relative overflow-hidden bg-white rounded-[20px] p-5 ring-1 ring-gray-200/70 group-hover:ring-blue-200/80
            min-h-[148px] flex flex-col justify-between
            shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_16px_34px_-14px_rgba(16,24,40,0.22)]
            hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <span aria-hidden className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-blue-500" />
          <div className="relative flex items-start justify-between gap-3">
            <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 bg-blue-50 text-blue-600">
              <User className="w-5 h-5" />
            </span>
            <span
              className={`text-[26px] font-extrabold leading-none tracking-[-0.02em] tabular-nums ${
                percent >= 100 ? "text-emerald-600" : "text-gray-900"
              }`}
            >
              {percent}
              <span className="text-[14px] font-bold opacity-50">%</span>
            </span>
          </div>
          <div className="relative flex items-end justify-between gap-3 mt-4">
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold text-gray-900 leading-tight">Profile</p>
              <p className="text-[11.5px] text-gray-500 mt-1 leading-snug">
                {percent >= 100 ? "Complete" : "Finish it to get picked"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </Link>

        <Link
          href={`/trainer/${trainerSlug}/verification`}
          className="group relative overflow-hidden bg-white rounded-[20px] p-5 ring-1 ring-gray-200/70 group-hover:ring-emerald-200/80
            min-h-[148px] flex flex-col justify-between
            shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_16px_34px_-14px_rgba(16,24,40,0.22)]
            hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <span aria-hidden className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-emerald-500" />
          <div className="relative flex items-start justify-between gap-3">
            <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 bg-emerald-50 text-emerald-600">
              <FileCheck className="w-5 h-5" />
            </span>
            {active ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/70 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified
              </span>
            ) : status === "rejected" ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-red-700 bg-red-50 ring-1 ring-red-200/70 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Action needed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-amber-700 bg-amber-50 ring-1 ring-amber-200/70 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pending
              </span>
            )}
          </div>
          <div className="relative flex items-end justify-between gap-3 mt-4">
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold text-gray-900 leading-tight">Verification</p>
              <p className="text-[11.5px] text-gray-500 mt-1 leading-snug">
                {active ? "Documents approved" : "Awaiting our team"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </Link>
      </div>

      {/* ── Next action callout ── */}
      {!active && (
        <div
          className={`rounded-[20px] p-4 sm:p-5 ring-1 flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6 ${
            status === "rejected"
              ? "bg-red-50/50 ring-red-200/60"
              : "bg-amber-50/50 ring-amber-200/60"
          }`}
        >
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {status === "rejected" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-gray-900">
                {status === "rejected"
                  ? "Re-upload your documents"
                  : "Your documents are being reviewed"}
              </p>
              <p className="text-[12.5px] text-gray-600 mt-1 leading-relaxed">
                {status === "rejected"
                  ? "We couldn't verify what you sent. A valid fitness certificate and a clear government ID is all we need."
                  : "Usually done within 24 hours. Once approved, we start matching you to gym requirements."}
              </p>
            </div>
          </div>
          <Button href={`/trainer/${trainerSlug}/verification`} size="sm" className="shrink-0">
            {status === "rejected" ? "Fix now" : "View"}
          </Button>
        </div>
      )}

      {active && percent < 100 && (
        <div className="rounded-[20px] p-4 sm:p-5 ring-1 bg-blue-50/40 ring-blue-200/50 flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
              <User className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-gray-900">
                Your profile is {percent}% complete
              </p>
              <p className="text-[12.5px] text-gray-600 mt-1 leading-relaxed">
                {completion?.missing?.length
                  ? `Add ${completion.missing.slice(0, 2).join(" and ").toLowerCase()} — it's what our team searches on.`
                  : "A fuller profile is easier for our team to place."}
              </p>
            </div>
          </div>
          <Button href={`/trainer/${trainerSlug}/profile`} size="sm" variant="secondary" className="shrink-0">
            Complete
          </Button>
        </div>
      )}

      {/* ── Profile strength + missing items ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        <div className="lg:col-span-3 bg-white rounded-[20px] sm:rounded-[24px] ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 sm:p-6">
          <h2 className="text-[16px] font-bold text-gray-900 mb-5">Profile strength</h2>

          {/* Progress bar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${
                  percent >= 100
                    ? "bg-emerald-500"
                    : percent >= 60
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
            <span
              className={`text-[15px] font-extrabold tabular-nums ${
                percent >= 100 ? "text-emerald-600" : "text-gray-900"
              }`}
            >
              {percent}%
            </span>
          </div>

          {!!completion?.missing?.length && (
            <ul className="space-y-2.5">
              {completion.missing.slice(0, 5).map((m: string) => (
                <li key={m} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          )}

          {percent >= 100 && (
            <div className="flex items-center gap-2.5 text-[13px] text-emerald-700 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Nothing left to add — your profile is complete.
            </div>
          )}

          <Button href={`/trainer/${trainerSlug}/profile`} variant="secondary" className="mt-5 w-full sm:w-auto">
            {percent >= 100 ? "Update profile" : "Complete profile"}
          </Button>

          <div className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-500 leading-relaxed">
              FitWorks is completely free for trainers. We never ask you to pay to be introduced to a gym.
            </p>
          </div>
        </div>

        {/* ── How FitWorks works for trainers ── */}
        <div className="lg:col-span-2 bg-white rounded-[20px] sm:rounded-[24px] ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 sm:p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-gray-900 mb-6">How it works</h2>

          <div className="flex-1 flex flex-col gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-3.5">
                <div className="w-8 h-8 rounded-full bg-brand-tint text-brand flex items-center justify-center font-bold text-[14px] shrink-0 ring-1 ring-red-100">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">{step.title}</h4>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-gray-900">Need help?</p>
              <p className="text-[11px] text-gray-500">Our team is here to support you.</p>
            </div>
            <Link
              href={`/trainer/${trainerSlug}/settings`}
              className="text-[12px] font-bold text-brand bg-brand-tint px-3 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
