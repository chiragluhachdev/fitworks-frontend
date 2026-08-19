"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, Dumbbell, Briefcase, FileText, Link as LinkIcon, AlertCircle 
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
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
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
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Gyms", value: stats?.totalGyms, icon: Dumbbell, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Trainers", value: stats?.totalTrainers, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Verified Trainers", value: stats?.verifiedTrainers, icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Pending Verification", value: stats?.pendingTrainers, icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Total Vacancies", value: stats?.totalVacancies, icon: Briefcase, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Active Vacancies", value: stats?.activeVacancies, icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Applications", value: stats?.totalApplications, icon: FileText, color: "text-pink-400", bg: "bg-pink-400/10" },
    { label: "Hired Trainers", value: stats?.hiredTrainers, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending Connections", value: stats?.pendingConnections, icon: LinkIcon, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-neutral-400">Live statistics from the FitWorks database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
