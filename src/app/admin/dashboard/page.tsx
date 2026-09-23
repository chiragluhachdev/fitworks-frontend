"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Dumbbell,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Search,
  Handshake,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Stat from "@/components/workspace/Stat";
import Panel from "@/components/workspace/Panel";
import Button from "@/components/workspace/Button";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";

interface Stats {
  totalGyms: number;
  totalTrainers: number;
  verifiedTrainers: number;
  pendingTrainers: number;
  totalVacancies: number;
  activeVacancies: number;
  newRequirements: number;
  inProgress: number;
  filledVacancies: number;
  trainersInReview: number;
  payingGyms: number;
  lapsedGyms: number;
  pendingConnections: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ stats?: Stats }>("/admin/stats");
    if (res.ok && res.data?.stats) {
      setStats(res.data.stats);
      setError("");
    } else {
      setError(res.error || "We couldn't load the admin statistics.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton />;
  if (!stats) return <ErrorState message={error} onRetry={load} />;

  // The two queues the team works from. Everything else is background.
  const toReview = stats.newRequirements || 0;
  const toVerify = stats.pendingTrainers || 0;

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-6">
        <h1 className="text-[26px] sm:text-[30px] font-extrabold text-gray-900 tracking-[-0.02em]">
          Operations
        </h1>
        <p className="text-[14px] text-gray-500 mt-1.5">
          FitWorks runs the hiring process by hand. This is what's waiting on the team.
        </p>
      </header>

      {/* ── Today's queue ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <Link
          href="/admin/vacancies"
          className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 p-5 transition-all"
        >
          <span
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              toReview ? "bg-red-50 text-[#E92E3D]" : "bg-gray-100 text-gray-400"
            }`}
          >
            <Briefcase className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[24px] font-extrabold text-gray-900 leading-none tabular-nums">
              {toReview}
            </p>
            <p className="text-[13px] font-semibold text-gray-600 mt-1.5">
              new requirement{toReview === 1 ? "" : "s"} to review
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E92E3D] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        <Link
          href="/admin/trainers"
          className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 p-5 transition-all"
        >
          <span
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              toVerify ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-400"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[24px] font-extrabold text-gray-900 leading-none tabular-nums">
              {toVerify}
            </p>
            <p className="text-[13px] font-semibold text-gray-600 mt-1.5">
              trainer{toVerify === 1 ? "" : "s"} awaiting verification
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E92E3D] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>

      {/* ── The hiring pipeline ── */}
      <h2 className="text-[15px] font-bold text-gray-900 mb-3">Hiring pipeline</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Stat
          label="In progress"
          accent="blue"
          value={stats.inProgress || 0}
          icon={Search}
          href="/admin/vacancies"
          hint="Vacancies the team is actively working"
        />
        <Stat
          label="Trainers in review"
          accent="brand"
          value={stats.trainersInReview || 0}
          icon={Users}
          href="/admin/vacancies"
          hint="Shortlisted across all roles"
        />
        <Stat
          label="Roles filled"
          accent="emerald"
          value={stats.filledVacancies || 0}
          icon={Handshake}
          href="/admin/vacancies"
          hint={`of ${stats.totalVacancies || 0} posted`}
        />
        <Stat
          label="Active vacancies"
          accent="slate"
          value={stats.activeVacancies || 0}
          icon={Briefcase}
          href="/admin/vacancies"
          hint="Currently open"
        />
      </div>

      {/* ── The network ── */}
      <h2 className="text-[15px] font-bold text-gray-900 mb-3">Network</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Stat
          label="Gyms"
          accent="blue"
          value={stats.totalGyms || 0}
          icon={Building2}
          href="/admin/gyms"
          hint={`${stats.payingGyms || 0} on a paid plan`}
        />
        <Stat
          label="Trainers"
          accent="brand"
          value={stats.totalTrainers || 0}
          icon={Dumbbell}
          href="/admin/trainers"
          hint={`${stats.verifiedTrainers || 0} verified`}
        />
        <Stat
          label="Lapsed memberships"
          value={stats.lapsedGyms || 0}
          icon={CreditCard}
          accent="amber"
          href="/admin/gyms"
          hint="Gyms whose plan has run out"
        />
        <Stat
          label="Pending invitations"
          accent="slate"
          value={stats.pendingConnections || 0}
          icon={Clock}
          href="/admin/connections"
          hint="Gym-to-trainer connections"
        />
      </div>

      {/* ── How the workflow runs, for whoever is on shift ── */}
      <Panel
        title="The workflow"
        description="Every hire on FitWorks goes through the team. Nothing is automated yet."
      >
        <ol className="space-y-3">
          {[
            { label: "Gym posts a vacancy", detail: "It lands on the board as New." },
            { label: "Review the requirement", detail: "Move it to Under review, then Finding trainers." },
            { label: "Shortlist trainers", detail: "Search the network and add verified profiles." },
            { label: "Contact each trainer", detail: "WhatsApp them from the shortlist; mark Contacted, then Interested." },
            { label: "Share with the gym", detail: "Move to Shared — only then does the gym see the profile." },
            { label: "Connect and close", detail: "Mark Connected, then Hired once the role is filled." },
          ].map((step, i) => (
            <li key={step.label} className="flex gap-3.5">
              <span className="w-6 h-6 rounded-full bg-gray-100 text-[11.5px] font-extrabold text-gray-500 flex items-center justify-center shrink-0 mt-px">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-gray-900">{step.label}</p>
                <p className="text-[12.5px] text-gray-500 mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-2.5 mt-6 pt-5 border-t border-gray-100">
          <Button href="/admin/vacancies" className="flex-1">
            <Briefcase className="w-4 h-4" /> Open vacancy board
          </Button>
          <Button href="/admin/trainers" variant="secondary" className="flex-1">
            <CheckCircle2 className="w-4 h-4" /> Verify trainers
          </Button>
        </div>
      </Panel>
    </div>
  );
}
