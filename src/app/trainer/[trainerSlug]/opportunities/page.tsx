"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  MapPin,
  Banknote,
  Clock,
  Building2,
  Handshake,
  ShieldCheck,
  Search,
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Panel from "@/components/workspace/Panel";
import Button from "@/components/workspace/Button";
import Empty from "@/components/workspace/Empty";
import Callout from "@/components/workspace/Callout";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import LockedPage from "@/components/dashboard/LockedPage";
import { getTrainerLock } from "@/lib/trainerAccess";
import { api } from "@/lib/api";
import { relativeDate } from "@/lib/hiring";

/** A gym's logo, or its initial when there isn't one. */
function GymMark({ logo, name, size = "w-12 h-12" }: { logo?: string; name?: string; size?: string }) {
  if (logo) {
    return (
      <span className={`${size} rounded-xl overflow-hidden relative shrink-0 border border-gray-200`}>
        <Image src={logo} alt="" fill className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className={`${size} rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-extrabold shrink-0`}
    >
      {name?.charAt(0)?.toUpperCase() || "G"}
    </span>
  );
}

export default function TrainerOpportunitiesPage() {
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
      setError(res.error || "We couldn't load your opportunities.");
    }
    setLoading(false);
  }, [trainerSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton stats={0} rows={3} />;
  if (!data) return <ErrorState message={error} onRetry={load} />;

  const status = data.trainer?.verificationStatus;
  const lock = getTrainerLock(status);

  // Not approved yet — the roles stay behind the same gate as everywhere else.
  if (lock) {
    return (
      <LockedPage
        lock={lock}
        trainerSlug={trainerSlug}
        heading="Opportunities"
        subheading="Gym roles our team is hiring for right now."
      />
    );
  }

  const introductions = data.connections || [];
  const roles = data.recommendedJobs || [];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Opportunities"
        description="Roles our team is hiring for right now, and any gym we've introduced you to."
      />

      <Callout icon={Handshake} tone="info" title="FitWorks contacts you — you don't apply">
        There's nothing to send from here. Our team matches trainers to each gym's requirement by hand
        and reaches out the moment something fits your profile and location.
      </Callout>

      {/* ── Introductions our team has already made ── */}
      {introductions.length > 0 && (
        <Panel
          className="mt-5"
          title="Gyms we've introduced you to"
          description="Our team put your profile forward to these gyms."
          bodyClassName="p-2 sm:p-2.5"
        >
          <ul className="divide-y divide-gray-100">
            {introductions.map((c: any) => (
              <li key={c._id} className="flex items-center gap-3.5 px-3 py-3.5">
                <GymMark logo={c.gymId?.gymLogo} name={c.gymId?.gymName} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-gray-900 truncate">
                    {c.gymId?.gymName || "Partner gym"}
                  </p>
                  <p className="text-[12px] text-gray-500 truncate mt-0.5">
                    {c.gymId?.address?.city || "India"}
                    {c.createdAt ? ` · ${relativeDate(c.createdAt)}` : ""}
                  </p>
                </div>
                <span className="text-[11.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full shrink-0">
                  Introduced
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* ── Roles currently open ── */}
      <Panel
        className="mt-5"
        title="Open gym roles"
        description="What our partner gyms are hiring for at the moment."
        bodyClassName={roles.length ? "p-2 sm:p-2.5" : ""}
      >
        {roles.length === 0 ? (
          <Empty
            icon={Search}
            title="No open roles right now"
            description="New gym requirements land here as they come in. Keep your profile complete so you're first in line when one matches."
            action={{ label: "Update my profile", href: `/trainer/${trainerSlug}/profile` }}
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {roles.map((job: any) => (
              <li key={job._id} className="flex items-start gap-3.5 px-3 py-4">
                <GymMark logo={job.gymId?.gymLogo} name={job.gymId?.gymName} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-bold text-gray-900 leading-snug">{job.position}</p>
                  <p className="text-[12.5px] text-gray-500 mt-0.5">
                    {job.gymId?.gymName || "Partner gym"}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-2 text-[12px] text-gray-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-gray-400" />
                      {job.salaryRange}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {job.requirements?.experience || "Any experience"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* ── What actually gets you picked ── */}
      <Panel className="mt-5" title="Looking for opportunities?">
        <p className="text-[13.5px] text-gray-600 leading-relaxed">
          Keep your profile complete and verified. The FitWorks team will contact you when a suitable gym
          opportunity is available.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          <Button href={`/trainer/${trainerSlug}/profile`} className="flex-1">
            <Building2 className="w-4 h-4" /> Update profile
          </Button>
          <Button href={`/trainer/${trainerSlug}/verification`} variant="secondary" className="flex-1">
            <ShieldCheck className="w-4 h-4" /> Verification
          </Button>
        </div>
      </Panel>

      <p className="text-[12px] text-gray-400 text-center mt-6 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" /> FitWorks is free for trainers.
      </p>
    </div>
  );
}
