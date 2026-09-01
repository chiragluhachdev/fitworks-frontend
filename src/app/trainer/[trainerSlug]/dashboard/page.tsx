"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  Search,
  ShieldCheck,
  Loader2,
  MapPin,
  Clock,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import RazorpayPaymentModal from "@/components/RazorpayPaymentModal";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import EmptyState from "@/components/dashboard/EmptyState";

const CONNECTION_TONE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function TrainerDashboardPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = localStorage.getItem("fitworks_token");
      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/dashboard`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Fetch Trainer Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Razorpay Checkout verifies inline via the modal's handler, so there is no
  // redirect to reconcile here. The webhook is the backstop if that never runs.
  useEffect(() => {
    fetchDashboard();
  }, [trainerSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading your dashboard…</p>
      </div>
    );
  }

  const { trainer, stats, applications = [], connections = [], recommendedJobs = [] } = data || {};
  const isPaid = trainer?.payment?.isPaid;
  const status = trainer?.verificationStatus;
  const pendingInvites = connections.filter((c: any) => c.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">

      {/* ── ₹99 badge activation ── */}
      {!isPaid && (
        <div className="bg-gradient-to-br from-[#d91a24] to-[#a8111a] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-[0_10px_30px_rgb(217,26,36,0.25)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <span className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-extrabold text-[15px] sm:text-base leading-tight">
                  Activate your Verified Badge
                </h2>
                <span className="text-[10px] font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  ₹99 one-time
                </span>
              </div>
              <p className="text-[13px] text-white/85 leading-relaxed">
                Stand out to partner gyms and unlock priority on your applications.
              </p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white hover:bg-gray-100 text-[#d91a24] text-sm font-extrabold shrink-0 active:scale-[0.98] transition-all cursor-pointer"
            >
              Activate now
            </button>
          </div>
        </div>
      )}

      {/* ── Greeting ── */}
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Hello, {trainer?.personal?.fullName?.split(" ")[0] || "Trainer"}
              </h1>
              {status === "verified" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> Pending review
                </span>
              )}
            </div>
            <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed">
              {pendingInvites > 0
                ? `You have ${pendingInvites} gym invitation${pendingInvites > 1 ? "s" : ""} waiting for a reply.`
                : "Track your applications and incoming gym invitations here."}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:flex items-center gap-2.5 shrink-0">
            <Link
              href={`/trainer/${trainerSlug}/profile`}
              className="inline-flex items-center justify-center gap-2 h-12 lg:h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-[13px] sm:text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              My Profile
            </Link>
            <Link
              href={`/trainer/${trainerSlug}/jobs`}
              className="inline-flex items-center justify-center gap-2 h-12 lg:h-11 px-4 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-[13px] sm:text-sm font-bold shadow-[0_6px_16px_rgb(217,26,36,0.22)] active:scale-[0.98] transition-all"
            >
              <Search className="w-4 h-4" /> Browse Jobs
            </Link>
          </div>
        </div>
      </header>

      <RazorpayPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        trainerSlug={trainerSlug}
        trainerName={trainer?.personal?.fullName}
        trainerEmail={trainer?.userId?.email}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchDashboard();
        }}
      />

      {/* ── Stats: 2-up on mobile ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Active applications"
          value={stats?.activeApplications ?? applications.length}
          icon={Briefcase}
          tone="purple"
          href={`/trainer/${trainerSlug}/applications`}
        />
        <StatCard
          label="Gym invitations"
          value={pendingInvites}
          icon={UserPlus}
          tone="green"
          href={`/trainer/${trainerSlug}/connections`}
          hint={pendingInvites > 0 ? "Awaiting your reply" : undefined}
        />
        <StatCard
          label="Verification"
          value={status === "verified" ? "Verified" : "Pending"}
          icon={FileCheck}
          tone={status === "verified" ? "green" : "amber"}
          href={`/trainer/${trainerSlug}/verification`}
        />
        <StatCard
          label="Verified badge"
          value={isPaid ? "Active" : "₹99"}
          icon={ShieldCheck}
          tone={isPaid ? "green" : "red"}
          hint={isPaid ? undefined : "Not activated"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* ── Recommended jobs ── */}
        <SectionCard
          title="Recommended jobs"
          description="Open vacancies from partner gyms"
          action={recommendedJobs.length > 0 ? { label: "View all", href: `/trainer/${trainerSlug}/jobs` } : undefined}
        >
          {recommendedJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No open vacancies right now"
              description="New roles from partner gyms will appear here as soon as they're posted."
            />
          ) : (
            <ul className="space-y-2.5">
              {recommendedJobs.map((job: any) => (
                <li key={job._id}>
                  <Link
                    href={`/trainer/${trainerSlug}/jobs`}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50/70 hover:bg-gray-50 active:scale-[0.99] rounded-2xl border border-gray-100 transition-all"
                  >
                    {job.gymId?.gymLogo ? (
                      <span className="w-11 h-11 rounded-xl overflow-hidden border border-gray-200 relative shrink-0">
                        <Image src={job.gymId.gymLogo} alt="" fill className="object-cover" />
                      </span>
                    ) : (
                      <span className="w-11 h-11 rounded-xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-bold text-sm shrink-0">
                        {job.gymId?.gymName?.charAt(0)?.toUpperCase() || "G"}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{job.position}</h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                        {job.gymId?.gymName || "Partner gym"}
                        {job.location ? ` • ${job.location}` : ""}
                      </p>
                      <p className="text-xs font-bold text-gray-800 mt-1">{job.salaryRange}</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* ── Gym invitations ── */}
        <SectionCard
          title="Gym invitations"
          description="Direct connection requests from gyms"
          action={connections.length > 0 ? { label: "View all", href: `/trainer/${trainerSlug}/connections` } : undefined}
        >
          {connections.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No invitations yet"
              description="When gyms discover your profile, their interview invitations land here."
              action={{ label: "Complete your profile", href: `/trainer/${trainerSlug}/profile` }}
            />
          ) : (
            <ul className="space-y-2.5">
              {connections.slice(0, 4).map((conn: any) => (
                <li key={conn._id}>
                  <Link
                    href={`/trainer/${trainerSlug}/connections`}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50/70 hover:bg-gray-50 active:scale-[0.99] rounded-2xl border border-gray-100 transition-all"
                  >
                    {conn.gymId?.gymLogo ? (
                      <span className="w-11 h-11 rounded-xl overflow-hidden border border-gray-200 relative shrink-0">
                        <Image src={conn.gymId.gymLogo} alt="" fill className="object-cover" />
                      </span>
                    ) : (
                      <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0">
                        {conn.gymId?.gymName?.charAt(0)?.toUpperCase() || "G"}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {conn.gymId?.gymName || "Gym partner"}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        {conn.gymId?.address?.city || "India"}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded-full border capitalize shrink-0 ${
                        CONNECTION_TONE[conn.status] || CONNECTION_TONE.pending
                      }`}
                    >
                      {conn.status === "pending" ? "Reply" : conn.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* ── Verification nudge ── */}
      {status !== "verified" && (
        <Link
          href={`/trainer/${trainerSlug}/verification`}
          className="flex items-center gap-3.5 p-4 sm:p-5 bg-white rounded-2xl border border-amber-200/70 shadow-[0_1px_3px_rgb(0,0,0,0.04)] hover:border-amber-300 active:scale-[0.99] transition-all"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900">Finish your verification</p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
              Upload your ID and certificates — gyms only see verified trainers.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
        </Link>
      )}
    </div>
  );
}
