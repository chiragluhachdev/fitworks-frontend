"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  UserPlus, 
  Eye,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Search,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerDashboardPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/dashboard`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Fetch Trainer Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [trainerSlug]);

  const trainer = data?.trainer;
  const stats = data?.stats || {
    profileViews: 48,
    activeApplications: 0,
    newConnections: 0,
    verificationStatus: "verified",
  };
  const applications = data?.applications || [];
  const connections = data?.connections || [];
  const recommendedJobs = data?.recommendedJobs || [];

  const statCards = [
    { title: "Profile Views", value: stats.profileViews, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Applications", value: stats.activeApplications, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Connection Requests", value: stats.newConnections, icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
    { title: "Verification Status", value: stats.verificationStatus === "verified" ? "Verified ✓" : "Pending", icon: ShieldCheck, color: "text-[#d91a24]", bg: "bg-red-50" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Verification Alert Banner */}
      {trainer?.verificationStatus !== "verified" ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Your profile is currently under review</h3>
              <p className="text-xs text-amber-700 mt-0.5">Our verification team will review your credentials within 24 hours.</p>
            </div>
          </div>
          <Link href={`/trainer/${trainerSlug}/verification`}>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold">
              Check Documents
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-green-50/80 border border-green-200/80 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-900">Verified Fitness Professional</p>
              <p className="text-[11px] text-green-700">Your profile is active and fully discoverable by partner gyms across India.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Hello, {trainer?.personal?.fullName || "Rahul"}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here is a live summary of your applications and incoming connection requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/trainer/${trainerSlug}/jobs`}>
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white h-11 px-5 text-sm font-semibold rounded-xl shadow-sm flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 capitalize">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Jobs & Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Open Vacancies */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recommended Jobs</h2>
                <p className="text-xs text-gray-500">Vacancies matching your skills</p>
              </div>
              <Link href={`/trainer/${trainerSlug}/jobs`} className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No open vacancies at the moment.</p>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job: any) => (
                  <div key={job._id} className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{job.position}</h4>
                      <p className="text-xs text-gray-500">{job.gymId?.gymName || "Partner Gym"} • {job.location}</p>
                      <p className="text-xs font-bold text-gray-800 mt-1">{job.salaryRange}</p>
                    </div>
                    <Link href={`/trainer/${trainerSlug}/jobs`}>
                      <Button size="sm" className="bg-[#d91a24] hover:bg-[#cc1616] text-white text-xs font-bold rounded-xl h-8 px-3">
                        Apply
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Incoming Connection Requests */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Gym Invitations</h2>
                <p className="text-xs text-gray-500">Direct connection requests from gyms</p>
              </div>
              <Link href={`/trainer/${trainerSlug}/connections`} className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {connections.length === 0 ? (
              <div className="p-8 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                <UserPlus className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">No connection requests yet</p>
                <p className="text-xs text-gray-500 mt-1">When partner gyms discover your profile, their interview invitations will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.slice(0, 3).map((conn: any) => (
                  <div key={conn._id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{conn.gymId?.gymName || "Gym Partner"}</h4>
                      <p className="text-xs text-gray-500">{conn.gymId?.address?.city || "India"}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize bg-blue-50 text-blue-700 border border-blue-100">
                      {conn.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
