"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  Bookmark, 
  UserPlus, 
  ArrowRight,
  ShieldCheck,
  Plus,
  Loader2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GymDashboardPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/gyms/${gymSlug}/dashboard`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Fetch Gym Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [gymSlug]);

  const gym = data?.gym;
  const stats = data?.stats || {
    activeVacancies: 0,
    applicationsReceived: 0,
    shortlisted: 0,
    activeHires: 0,
  };
  const recentApplications = data?.recentApplications || [];

  const statCards = [
    { title: "Active Vacancies", value: stats.activeVacancies, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Applications Received", value: stats.applicationsReceived, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Shortlisted", value: stats.shortlisted, icon: Bookmark, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Active Hires", value: stats.activeHires, icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#d91a24] rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Gym Partner
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Welcome back, {gym?.gymName || "PowerFit Studio"}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active vacancies, incoming applications, and hires.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/gym/${gymSlug}/find-trainers`}>
            <Button variant="outline" className="border-gray-200 text-gray-700 bg-white hover:bg-gray-50 h-11 px-4 text-sm font-semibold rounded-xl">
              <Users className="w-4 h-4 mr-2" /> Find Trainers
            </Button>
          </Link>
          <Link href={`/gym/${gymSlug}/vacancies/new`}>
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white h-11 px-5 text-sm font-semibold rounded-xl shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Post Vacancy
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
                <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <p className="text-xs text-gray-500">Trainers who applied to your open positions</p>
            </div>
            <Link href={`/gym/${gymSlug}/shortlisted`} className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="p-8 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-700">No applications yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Post open vacancies or browse verified trainers to invite them for an interview.</p>
              <Link href={`/gym/${gymSlug}/vacancies/new`} className="inline-block mt-4">
                <Button size="sm" className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl">
                  Post a Vacancy
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app: any) => (
                <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-sm">
                      {app.trainerId?.personal?.fullName?.charAt(0) || "T"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{app.trainerId?.personal?.fullName || "Trainer"}</h4>
                      <p className="text-xs text-gray-500">Applied for <span className="font-semibold text-gray-700">{app.jobId?.position || "Trainer Position"}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full capitalize bg-blue-50 text-blue-700 border border-blue-100">
                      {app.status || "Applied"}
                    </span>
                    <Link href={`/gym/${gymSlug}/shortlisted`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs font-semibold text-gray-700">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gym Hiring Snapshot (1 col) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Hiring Preferences</h2>
            <p className="text-xs text-gray-500 mb-6">Target criteria set for your gym locations</p>

            <div className="space-y-4">
              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Trainers Needed</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{gym?.hiringInformation?.trainersRequired || 2} Positions</p>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Specializations</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(gym?.hiringInformation?.trainerTypes || ["General Fitness", "Yoga"]).map((type: string) => (
                    <span key={type} className="text-xs font-semibold px-2 py-0.5 bg-white text-gray-700 border border-gray-200 rounded-md">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Salary Budget</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">₹{gym?.hiringInformation?.salaryBudget || "25,000 - 35,000"}</p>
              </div>
            </div>
          </div>

          <Link href={`/gym/${gymSlug}/profile`} className="w-full mt-6">
            <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold h-10">
              Edit Hiring Criteria
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}
