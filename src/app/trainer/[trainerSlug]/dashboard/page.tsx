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
  CalendarClock,
  Lock,
  AlertCircle,
} from "lucide-react";
import RazorpayPaymentModal from "@/components/RazorpayPaymentModal";
import StatCard from "@/components/dashboard/StatCard";
import SubscriptionBanner, { MembershipPill, type SubscriptionState } from "@/components/dashboard/SubscriptionBanner";
import SectionCard from "@/components/dashboard/SectionCard";
import EmptyState from "@/components/dashboard/EmptyState";
import type { LockInfo } from "@/components/dashboard/AccessLocked";

const CONNECTION_TONE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-gray-100 text-gray-600 border-gray-200",
};

const VERIFICATION_PILL: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  verified: {
    label: "Verified",
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pending review",
    cls: "text-amber-700 bg-amber-50 border-amber-200/80",
    Icon: Clock,
  },
  rejected: {
    label: "Not verified",
    cls: "text-red-700 bg-red-50 border-red-200/80",
    Icon: AlertCircle,
  },
};

export default function TrainerDashboardPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = localStorage.getItem("fitworks_token");
      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/dashboard`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLoadError(null);
      } else {
        setLoadError(json.message || "We couldn't load your dashboard.");
      }
    } catch (err) {
      console.error("Fetch Trainer Dashboard Error:", err);
      setLoadError("Couldn't reach FitWorks. Check your connection and try again.");
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

  // Nothing came back — show the reason rather than an empty dashboard that
  // reads as if the account is fine.
  if (!data) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-8 text-center">
        <span className="w-14 h-14 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </span>
        <h1 className="text-lg font-extrabold text-gray-900 mb-2">Dashboard unavailable</h1>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
          {loadError || "We couldn't load your dashboard."}
        </p>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboard();
          }}
          className="h-12 px-6 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  const { trainer, stats, applications = [], connections = [], recommendedJobs = [] } = data;
  const subscription: SubscriptionState | null = data?.subscription ?? null;
  const jobAccess: (LockInfo & { allowed: boolean }) | null = data?.jobAccess ?? null;
  const status = trainer?.verificationStatus;
  const verification = status ? VERIFICATION_PILL[status] : undefined;
  // "Active" means approved AND paid. Verification alone never makes a profile
  // live, so it must never be presented as if it does.
  const accountActive = status === "verified" && Boolean(subscription?.isActive);
  const pendingInvites = connections.filter((c: any) => c.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">

      {/* ── Membership state: activate / renew / expired ── */}
      <SubscriptionBanner subscription={subscription} onActivate={() => setShowPaymentModal(true)} />

      {/* ── Greeting ── */}
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Hello, {trainer?.personal?.fullName?.split(" ")[0] || "Trainer"}
              </h1>
              {verification && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold border px-2.5 py-0.5 rounded-full ${verification.cls}`}
                >
                  <verification.Icon className="w-3.5 h-3.5" /> {verification.label}
                </span>
              )}
              <MembershipPill subscription={subscription} />
            </div>
            <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed">
              {!subscription?.isActive
                ? "Activate your membership to appear in gym search and start applying."
                : status !== "verified"
                ? "Your membership is paid. Your profile goes live to gyms as soon as our team approves your documents."
                : pendingInvites > 0
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
        trainerEmail={trainer?.personal?.email}
        trainerPhone={trainer?.personal?.phone}
        isRenewal={(subscription?.cyclesPaid ?? 0) > 0}
        expiresAt={subscription?.expiresAt ?? null}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchDashboard();
        }}
      />

      {/* ── Is this profile actually live? Approved AND paid, never one alone. ── */}
      <div
        className={`flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border ${
          accountActive ? "bg-emerald-50/70 border-emerald-200/70" : "bg-gray-50 border-gray-200"
        }`}
      >
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            accountActive ? "bg-emerald-100 text-emerald-700" : "bg-white text-gray-400 border border-gray-200"
          }`}
        >
          {accountActive ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${accountActive ? "text-emerald-900" : "text-gray-900"}`}>
            {accountActive ? "Your profile is live in gym search" : "Your profile is not visible to gyms yet"}
          </p>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
            {accountActive
              ? "Verified and on an active membership — hiring gyms can find and contact you."
              : !subscription?.isActive && status !== "verified"
              ? "Two things left: activate your ₹99/month membership, and get your documents approved."
              : !subscription?.isActive
              ? "Your ₹99/month membership isn't active. Activate it to appear in gym search."
              : status === "rejected"
              ? "Your documents were not approved. Re-upload them from the Verification page."
              : "Our team is still reviewing your documents."}
          </p>
        </div>
        {!subscription?.isActive && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="h-10 px-4 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-xs font-bold shrink-0 active:scale-[0.98] transition-all cursor-pointer"
          >
            Activate ₹99
          </button>
        )}
      </div>

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
          value={status === "verified" ? "Verified" : status === "rejected" ? "Rejected" : "Pending"}
          icon={FileCheck}
          tone={status === "verified" ? "green" : status === "rejected" ? "red" : "amber"}
          href={`/trainer/${trainerSlug}/verification`}
        />
        <StatCard
          label="Membership"
          value={
            subscription?.isActive ? `${subscription.daysRemaining}d` : subscription?.cyclesPaid ? "Expired" : "Inactive"
          }
          icon={CalendarClock}
          tone={
            subscription?.status === "active"
              ? "green"
              : subscription?.status === "expiring_soon"
              ? "amber"
              : "red"
          }
          hint={subscription?.isActive ? "until renewal" : "₹99 / month"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* ── Recommended jobs ── */}
        <SectionCard
          title="Recommended jobs"
          description="Open vacancies from partner gyms"
          action={
            recommendedJobs.length > 0 ? { label: "View all", href: `/trainer/${trainerSlug}/jobs` } : undefined
          }
        >
          {jobAccess && !jobAccess.allowed ? (
            /* The backend withholds vacancies from a locked trainer, so this panel
               explains why instead of showing an empty list. */
            <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/80 border border-gray-100 text-center">
              <span className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#d91a24] flex items-center justify-center mx-auto mb-3.5">
                {jobAccess.reason === "pending_review" ? (
                  <Clock className="w-6 h-6 text-amber-500" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </span>
              <h3 className="text-sm font-extrabold text-gray-900 mb-1.5">{jobAccess.title}</h3>
              <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-5 max-w-sm mx-auto">
                {jobAccess.message}
              </p>
              {jobAccess.reason === "subscription_inactive" ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shadow-[0_8px_20px_rgb(217,26,36,0.2)] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  Activate for ₹99/month <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={`/trainer/${trainerSlug}/verification`}
                  className="w-full sm:w-auto h-11 px-6 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
                >
                  Go to Verification <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : recommendedJobs.length === 0 ? (
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
