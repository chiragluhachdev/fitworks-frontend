"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Dumbbell, 
  Briefcase, 
  FileText, 
  Link2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Clock
} from "lucide-react";

interface DashboardStats {
  totalGyms: number;
  totalTrainers: number;
  verifiedTrainers: number;
  pendingTrainers: number;
  totalVacancies: number;
  activeVacancies: number;
  totalApplications: number;
  hiredTrainers: number;
  pendingConnections: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to load stats");
        }
      } catch (err) {
        setError("Network error loading stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-gray-500">Aggregating live marketplace data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm">Failed to retrieve admin statistics</h3>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Registered Gyms", 
      value: stats?.totalGyms || 0, 
      sub: "Active partner centers",
      icon: Building2, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/admin/gyms"
    },
    { 
      label: "Total Trainers", 
      value: stats?.totalTrainers || 0, 
      sub: `${stats?.verifiedTrainers || 0} verified on platform`,
      icon: Dumbbell, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/admin/trainers"
    },
    { 
      label: "Pending Verification", 
      value: stats?.pendingTrainers || 0, 
      sub: "Requires admin review",
      icon: Clock, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      alert: (stats?.pendingTrainers || 0) > 0,
      href: "/admin/trainers"
    },
    { 
      label: "Active Vacancies", 
      value: stats?.activeVacancies || 0, 
      sub: `Out of ${stats?.totalVacancies || 0} total postings`,
      icon: Briefcase, 
      color: "text-[#d91a24]", 
      bg: "bg-red-50",
      href: "/admin/vacancies"
    },
    { 
      label: "Applications Received", 
      value: stats?.totalApplications || 0, 
      sub: `${stats?.hiredTrainers || 0} candidates hired`,
      icon: FileText, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      href: "/admin/applications"
    },
    { 
      label: "Pending Invitations", 
      value: stats?.pendingConnections || 0, 
      sub: "Gym-to-trainer connections",
      icon: Link2, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50",
      href: "/admin/connections"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#d91a24] border border-red-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            FitWorks Operations Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            System Overview & Metrics
          </h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Live telemetry and moderation controls for verified trainers, gym partners, job postings, and hiring applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/trainers"
            className="flex items-center gap-2 bg-[#d91a24] hover:bg-[#b8151e] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-sm shadow-red-500/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Review Trainers ({stats?.pendingTrainers || 0})
          </Link>
          <Link
            href="/admin/vacancies"
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-4 py-3 rounded-xl transition-colors"
          >
            All Vacancies
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Platform KPIs</h2>
          <span className="text-xs text-gray-400 font-medium">Real-time MongoDB aggregates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link
                key={i}
                href={stat.href}
                className="bg-white border border-gray-200/80 hover:border-gray-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border border-black/5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.alert && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full animate-pulse">
                      Action Needed
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 mt-1 group-hover:text-[#d91a24] transition-colors">
                    {stat.value.toLocaleString()}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 font-medium">
                    <span>{stat.sub}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#d91a24] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Verified Professionals</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            {stats?.verifiedTrainers || 0} coaches currently meet all verification benchmarks and appear in the public hiring marketplace.
          </p>
          <Link href="/admin/trainers" className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
            Browse Verified Directory <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Gym Partner Network</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            {stats?.totalGyms || 0} registered fitness studios actively posting vacancies and reviewing candidate applications.
          </p>
          <Link href="/admin/gyms" className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
            View Gym Profiles <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Account Management</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Audit underlying authentication records, credentials, and role privileges across all platform users.
          </p>
          <Link href="/admin/users" className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
            Inspect All Users <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
}
