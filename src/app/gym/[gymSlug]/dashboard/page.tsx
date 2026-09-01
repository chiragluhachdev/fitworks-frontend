"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Bookmark,
  UserPlus,
  ShieldCheck,
  Plus,
  Loader2,
  Search,
  ChevronRight,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SectionCard from "@/components/dashboard/SectionCard";
import EmptyState from "@/components/dashboard/EmptyState";

const STATUS_TONE: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-100",
  reviewing: "bg-indigo-50 text-indigo-700 border-indigo-100",
  shortlisted: "bg-amber-50 text-amber-700 border-amber-100",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function GymDashboardPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;
        const res = await fetch(`${apiUrl}/gyms/${gymSlug}/dashboard`, {
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Fetch Gym Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [gymSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading your dashboard…</p>
      </div>
    );
  }

  const gym = data?.gym;
  const stats = data?.stats || {};
  const recentApplications = data?.recentApplications || [];
  const hiring = gym?.hiringInformation;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">

      {/* ── Greeting ── */}
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#d91a24] rounded-full text-[10px] sm:text-xs font-bold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Gym Partner
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight truncate">
              {gym?.gymName || "Your Gym"}
            </h1>
            <p className="text-[13px] sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
              Manage vacancies, review applications and hire verified trainers.
            </p>
          </div>

          {/* Primary actions — full width and thumb-sized on mobile */}
          <div className="grid grid-cols-2 lg:flex items-center gap-2.5 shrink-0">
            <Link
              href={`/gym/${gymSlug}/find-trainers`}
              className="inline-flex items-center justify-center gap-2 h-12 lg:h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-[13px] sm:text-sm font-bold active:scale-[0.98] hover:bg-gray-50 transition-all"
            >
              <Search className="w-4 h-4" /> Find Trainers
            </Link>
            <Link
              href={`/gym/${gymSlug}/vacancies/new`}
              className="inline-flex items-center justify-center gap-1.5 h-12 lg:h-11 px-4 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-[13px] sm:text-sm font-bold shadow-[0_6px_16px_rgb(217,26,36,0.22)] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" /> Post Vacancy
            </Link>
          </div>
        </div>
      </header>

      {/* ── Stats: 2-up on mobile ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Active vacancies"
          value={stats.activeVacancies ?? 0}
          icon={Briefcase}
          tone="blue"
          href={`/gym/${gymSlug}/vacancies`}
        />
        <StatCard
          label="Applications received"
          value={stats.applicationsReceived ?? 0}
          icon={Users}
          tone="purple"
          href={`/gym/${gymSlug}/shortlisted`}
        />
        <StatCard
          label="Shortlisted"
          value={stats.shortlisted ?? 0}
          icon={Bookmark}
          tone="amber"
          href={`/gym/${gymSlug}/shortlisted`}
        />
        <StatCard
          label="Active hires"
          value={stats.activeHires ?? 0}
          icon={UserPlus}
          tone="green"
          href={`/gym/${gymSlug}/shortlisted`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* ── Recent applications ── */}
        <SectionCard
          className="lg:col-span-2"
          title="Recent applications"
          description="Trainers who applied to your open positions"
          action={recentApplications.length > 0 ? { label: "View all", href: `/gym/${gymSlug}/shortlisted` } : undefined}
        >
          {recentApplications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applications yet"
              description="Post a vacancy or browse verified trainers and invite them to interview."
              action={{ label: "Post a Vacancy", href: `/gym/${gymSlug}/vacancies/new` }}
            />
          ) : (
            <ul className="space-y-2.5">
              {recentApplications.map((app: any) => (
                <li key={app._id}>
                  <Link
                    href={`/gym/${gymSlug}/shortlisted`}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50/70 hover:bg-gray-50 active:scale-[0.99] rounded-2xl border border-gray-100 transition-all"
                  >
                    <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-sm shrink-0">
                      {app.trainerId?.personal?.fullName?.charAt(0)?.toUpperCase() || "T"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {app.trainerId?.personal?.fullName || "Trainer"}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                        {app.jobId?.position || "Trainer position"}
                      </p>
                      <span
                        className={`sm:hidden inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                          STATUS_TONE[app.status] || STATUS_TONE.applied
                        }`}
                      >
                        {app.status || "applied"}
                      </span>
                    </div>

                    <span
                      className={`hidden sm:inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize shrink-0 ${
                        STATUS_TONE[app.status] || STATUS_TONE.applied
                      }`}
                    >
                      {app.status || "applied"}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* ── Hiring preferences ── */}
        <SectionCard
          title="Hiring preferences"
          description="Criteria used to match trainers to you"
          action={{ label: "Edit", href: `/gym/${gymSlug}/profile` }}
        >
          <dl className="space-y-2.5">
            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
              <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trainers needed</dt>
              <dd className="text-sm font-bold text-gray-900 mt-1">
                {hiring?.trainersRequired ?? 0} position{hiring?.trainersRequired === 1 ? "" : "s"}
              </dd>
            </div>

            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
              <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specializations</dt>
              <dd className="flex flex-wrap gap-1.5 mt-2">
                {(hiring?.trainerTypes?.length ? hiring.trainerTypes : ["Not set"]).map((type: string) => (
                  <span
                    key={type}
                    className="text-[11px] font-semibold px-2 py-0.5 bg-white text-gray-700 border border-gray-200 rounded-md"
                  >
                    {type}
                  </span>
                ))}
              </dd>
            </div>

            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
              <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Salary budget</dt>
              <dd className="text-sm font-bold text-gray-900 mt-1">
                {hiring?.salaryBudget ? `₹${hiring.salaryBudget}` : "Not set"}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </div>
    </div>
  );
}
