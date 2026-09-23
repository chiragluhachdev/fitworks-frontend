"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  AlertCircle,
  User,
  FileCheck,
  Handshake,
  ArrowRight,
  MapPin,
  Banknote,
  Lock,
} from "lucide-react";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import Stat from "@/components/workspace/Stat";
import Empty from "@/components/workspace/Empty";
import Callout from "@/components/workspace/Callout";
import StatusPill from "@/components/workspace/StatusPill";
import { ProgressRing, ProgressBar } from "@/components/workspace/Progress";
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
    dot: "bg-[#d91a24]",
  },
};

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

  const { trainer, stats, completion, connections = [], recommendedJobs = [] } = data;
  const status = trainer?.verificationStatus;
  const badge = VERIFICATION[status] || VERIFICATION.pending;
  const active = status === "verified";
  const firstName = trainer?.personal?.fullName?.split(" ")[0] || "Trainer";
  const percent = completion?.percent ?? 0;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* ── Who you are, and whether you're live ── */}
      <header className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {trainer?.personal?.profilePhoto ? (
            <span className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border border-gray-200">
              <Image src={trainer.personal.profilePhoto} alt="" fill className="object-cover" />
            </span>
          ) : (
            <span className="w-16 h-16 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-extrabold text-xl shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 tracking-[-0.02em] leading-tight">
                Hello, {firstName}
              </h1>
              <StatusPill label={badge.label} chip={badge.chip} dot={badge.dot} />
            </div>
            <p className="text-[13.5px] text-gray-500 mt-1.5 leading-relaxed">
              {active
                ? "Your profile is live. Our team puts it in front of gyms whose roles match what you do."
                : status === "rejected"
                ? "Your documents weren't approved. Re-upload them and we'll take another look."
                : "Our team is reviewing your documents. Your profile goes live once approved."}
            </p>
          </div>

          <Button href={`/trainer/${trainerSlug}/profile`} variant="secondary" className="shrink-0">
            <User className="w-4 h-4" /> My profile
          </Button>
        </div>
      </header>

      {/* ── Three numbers, no applications anywhere ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <Stat
          label="Profile"
          value={`${percent}%`}
          icon={User}
          accent={percent < 100}
          href={`/trainer/${trainerSlug}/profile`}
          hint={percent >= 100 ? "Complete" : "Finish it to get picked"}
        />
        <Stat
          label="Verification"
          value={active ? "Verified" : status === "rejected" ? "Action needed" : "Pending"}
          icon={FileCheck}
          href={`/trainer/${trainerSlug}/verification`}
          hint={active ? "Documents approved" : "Awaiting our team"}
        />
        <Stat
          label="Introductions"
          value={stats?.introductions ?? connections.length}
          icon={Handshake}
          href={`/trainer/${trainerSlug}/opportunities`}
          hint="Gyms we've put you forward to"
        />
      </div>

      {/* ── The one thing to do next ── */}
      {!active && (
        <Callout
          icon={status === "rejected" ? AlertCircle : Clock}
          tone={status === "rejected" ? "warning" : "info"}
          title={
            status === "rejected"
              ? "Re-upload your documents"
              : "Your documents are being reviewed"
          }
          action={
            <Button href={`/trainer/${trainerSlug}/verification`} size="sm">
              {status === "rejected" ? "Fix now" : "View"}
            </Button>
          }
        >
          {status === "rejected"
            ? "We couldn't verify what you sent. A valid fitness certificate and a clear government ID is all we need."
            : "Usually done within 24 hours. Once approved, we start matching you to gym requirements."}
        </Callout>
      )}

      {active && percent < 100 && (
        <Callout
          icon={Sparkles}
          tone="neutral"
          title={`Your profile is ${percent}% complete`}
          action={
            <Button href={`/trainer/${trainerSlug}/profile`} size="sm" variant="secondary">
              Complete
            </Button>
          }
        >
          {completion?.missing?.length
            ? `Add ${completion.missing.slice(0, 2).join(" and ").toLowerCase()} — it's what our team searches on.`
            : "A fuller profile is easier for our team to place."}
        </Callout>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mt-4 sm:mt-5">
        {/* ── Opportunities ── */}
        <Panel
          className="lg:col-span-2"
          title="Opportunities"
          description="Roles our partner gyms are hiring for."
          action={
            recommendedJobs.length > 0
              ? { label: "See all", href: `/trainer/${trainerSlug}/opportunities` }
              : undefined
          }
          bodyClassName={recommendedJobs.length ? "p-2 sm:p-2.5" : ""}
        >
          {!active ? (
            <div className="px-5 py-10 text-center">
              <span className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <p className="text-[15px] font-bold text-gray-900">Unlocks once you're verified</p>
              <p className="text-[13px] text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Gym roles appear here as soon as your documents are approved — usually within 24 hours.
              </p>
              <Button href={`/trainer/${trainerSlug}/verification`} variant="secondary" className="mt-5">
                Go to verification <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : recommendedJobs.length === 0 ? (
            <Empty
              icon={Sparkles}
              title="No open roles right now"
              description="New gym requirements land here as they come in. We'll contact you directly when one fits."
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recommendedJobs.slice(0, 5).map((job: any) => (
                <li key={job._id} className="flex items-start gap-3.5 px-3 py-3.5">
                  {job.gymId?.gymLogo ? (
                    <span className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0 border border-gray-200">
                      <Image src={job.gymId.gymLogo} alt="" fill className="object-cover" />
                    </span>
                  ) : (
                    <span className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-extrabold shrink-0">
                      {job.gymId?.gymName?.charAt(0)?.toUpperCase() || "G"}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-gray-900 truncate">{job.position}</p>
                    <p className="text-[12px] text-gray-500 truncate mt-0.5">
                      {job.gymId?.gymName || "Partner gym"}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-gray-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Banknote className="w-3 h-3 text-gray-400" />
                        {job.salaryRange}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ── Profile strength ── */}
        <Panel title="Profile strength">
          <div className="flex items-center gap-4">
            <ProgressRing percent={percent} size={62} />
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-gray-900">
                {percent >= 100 ? "All done" : "Keep going"}
              </p>
              <p className="text-[12.5px] text-gray-500 mt-0.5 leading-snug">
                {percent >= 100
                  ? "Nothing left to add."
                  : `${completion?.missing?.length ?? 0} thing${
                      (completion?.missing?.length ?? 0) === 1 ? "" : "s"
                    } left`}
              </p>
            </div>
          </div>

          {!!completion?.missing?.length && (
            <ul className="mt-5 space-y-2">
              {completion.missing.slice(0, 4).map((m: string) => (
                <li key={m} className="flex items-center gap-2.5 text-[12.5px] text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          )}

          <Button href={`/trainer/${trainerSlug}/profile`} variant="secondary" block className="mt-5">
            {percent >= 100 ? "Update profile" : "Complete profile"}
          </Button>

          <div className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-500 leading-relaxed">
              FitWorks is completely free for trainers. We never ask you to pay to be introduced to a gym.
            </p>
          </div>
        </Panel>
      </div>

      {/* ── The promise, stated plainly ── */}
      <section className="mt-4 sm:mt-5 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7">
        <h2 className="text-[17px] font-extrabold text-gray-900 tracking-[-0.01em]">
          Looking for opportunities?
        </h2>
        <p className="text-[13.5px] text-gray-600 mt-2 leading-relaxed max-w-2xl">
          Keep your profile complete and verified. The FitWorks team will contact you when a suitable gym
          opportunity is available — you don't need to apply anywhere.
        </p>
        <ProgressBar percent={percent} className="mt-5 max-w-sm" />
        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          <Button href={`/trainer/${trainerSlug}/profile`}>
            {percent >= 100 ? "Update profile" : "Complete profile"}
          </Button>
          <Button href={`/trainer/${trainerSlug}/opportunities`} variant="secondary">
            View opportunities <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
