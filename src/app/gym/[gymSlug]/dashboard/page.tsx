"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Plus, 
  Briefcase, 
  CreditCard, 
  ArrowRight,
  PlayCircle,
  User,
  Settings,
  Crown
} from "lucide-react";
import Button from "@/components/workspace/Button";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { VacancyRowItem } from "@/components/gym/VacancyCard";
import HowItWorksPlayer from "@/components/workspace/HowItWorksPlayer";
import { api } from "@/lib/api";
import { findPlan, shortDate } from "@/lib/hiring";

export default function GymOverviewPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [explainerOpen, setExplainerOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>(`/gyms/${gymSlug}/dashboard`);
    if (res.ok && res.data?.data) {
      setData(res.data.data);
      setError("");
    } else {
      setError(res.error || "We couldn't load your dashboard.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton />;
  if (!data) return <ErrorState message={error} onRetry={load} />;

  const { gym, stats, subscription, activeVacancies = [] } = data;
  const firstName = (gym?.contactPerson?.name || "").split(" ")[0];
  const hasVacancies = (stats?.totalVacancies ?? 0) > 0;
  const plan = findPlan(subscription?.plan);

  return (
    <div className="max-w-[1200px] w-full mx-auto animate-in fade-in duration-300 pb-10">
      
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0a0a0a] rounded-[24px] px-6 py-10 sm:px-12 sm:py-14 mb-6 shadow-sm flex flex-col justify-center min-h-[340px]">
        {/* Background Image Masked to the right */}
        <div 
          className="absolute inset-y-0 right-0 w-[80%] sm:w-[60%] bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-[center_top_-4rem] opacity-60 mix-blend-lighten pointer-events-none"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 60%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 60%)' }}
        />
        
        <div className="relative z-10 max-w-xl">
          {firstName && (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
              Welcome back, {firstName}
            </p>
          )}
          
          <h1 className="text-[32px] sm:text-[42px] font-bold text-white leading-[1.15] mb-4">
            Find the right fitness <br className="hidden sm:block" />
            professionals <span className="text-[#E92E3D]">for your gym.</span>
          </h1>
          
          <p className="text-[14px] sm:text-[15px] text-gray-300 mb-8 max-w-[400px] leading-relaxed">
            Post your hiring requirements and let the FitWorks team help you find suitable trainers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href={`/gym/${gymSlug}/vacancies/new`} 
              className="inline-flex items-center justify-center bg-[#E92E3D] hover:bg-red-600 text-white font-medium rounded-xl px-6 h-12 transition-colors shadow-md shadow-red-900/20"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Post a Vacancy
            </Link>
            
            {/* Opens the twenty-second explainer. It is the only place that
                does — a gym owner who understands the process doesn't need it
                taking up room on the page. */}
            <button
              onClick={() => setExplainerOpen(true)}
              className="inline-flex items-center justify-center bg-transparent border border-gray-400 hover:border-white hover:bg-white/10 text-white font-medium rounded-xl px-6 h-12 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 mr-1.5" /> How it works
            </button>
          </div>
        </div>
      </section>

      {/* ── 4-Column Action/Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Stat: Active Vacancies */}
        <Link href={`/gym/${gymSlug}/vacancies`} className="group bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-[#E92E3D]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-[22px] font-bold text-gray-900">{stats?.activeVacancies ?? 0}</div>
          </div>
          <div>
            <div className="font-semibold text-[13px] text-gray-900">Active Vacancies</div>
            <div className="text-[11px] text-gray-500 mt-1">{stats?.totalVacancies ?? 0} posted in total</div>
          </div>
          <ArrowRight className="absolute top-6 right-5 w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </Link>

        {/* Action: Edit Profile */}
        <Link href={`/gym/${gymSlug}/profile?tab=profile`} className="group bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-semibold text-[13px] text-gray-900">Edit Profile</div>
            <div className="text-[11px] text-gray-500 mt-1">Update gym details & photos</div>
          </div>
          <ArrowRight className="absolute top-6 right-5 w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </Link>

        {/* Stat: Subscription */}
        <Link href={`/gym/${gymSlug}/subscription`} className="group bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Crown className="w-5 h-5" />
            </div>
            <div className="text-[16px] font-bold text-gray-900 text-right">
              {subscription?.isActive ? plan?.name || "Active" : "Inactive"}
            </div>
          </div>
          <div>
            <div className="font-semibold text-[13px] text-gray-900">Subscription</div>
            <div className="text-[11px] text-gray-500 mt-1">
              {subscription?.isActive ? `Renews ${shortDate(subscription.expiresAt)}` : "Choose a plan to keep hiring"}
            </div>
          </div>
          <ArrowRight className="absolute top-6 right-5 w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </Link>

        {/* Action: Settings */}
        <Link href={`/gym/${gymSlug}/profile?tab=account`} className="group bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
              <Settings className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-semibold text-[13px] text-gray-900">Settings</div>
            <div className="text-[11px] text-gray-500 mt-1">Manage your preferences</div>
          </div>
          <ArrowRight className="absolute top-6 right-5 w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </Link>
      </div>

      {/* ── Subscription Banner ── */}
      {!subscription?.isActive && (
        <div className="bg-[#FFF5F6] border border-[#FFE2E5] rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <CreditCard className="text-[#E92E3D] w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Activate your FitWorks plan</h3>
              <p className="text-[13px] text-gray-600 mt-0.5">
                Get unlimited vacancies and full hiring support from our team. Plans start at just ₹199/month.
              </p>
            </div>
          </div>
          <Link 
            href={`/gym/${gymSlug}/subscription`} 
            className="inline-flex items-center justify-center bg-[#E92E3D] hover:bg-red-600 text-white font-medium rounded-xl mt-4 sm:mt-0 px-6 whitespace-nowrap h-11 transition-colors"
          >
            View Plans <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      )}

      {/* ── Lower Split Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Vacancies */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col min-h-[400px]">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-gray-900">Your Active Vacancies</h2>
              {hasVacancies && (
                <Link href={`/gym/${gymSlug}/vacancies`} className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            
            <div className="flex-1 p-2 sm:p-4 flex flex-col">
              {activeVacancies.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                    <Briefcase className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">
                    You haven't posted a vacancy yet
                  </h3>
                  <p className="text-[13px] text-gray-500 mb-6 max-w-sm">
                    Tell us what you're hiring for and our team will start finding suitable trainers for you.
                  </p>
                  <Link 
                    href={`/gym/${gymSlug}/vacancies/new`} 
                    className="inline-flex items-center justify-center bg-[#E92E3D] hover:bg-red-600 text-white font-medium rounded-xl h-11 px-6 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Post a Vacancy
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {activeVacancies.map((v: any) => (
                    <li key={v._id}>
                      <VacancyRowItem vacancy={v} href={`/gym/${gymSlug}/vacancies/${v._id}`} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right: How FitWorks Works */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 h-full flex flex-col min-h-[400px]">
            <h2 className="text-[16px] font-bold text-gray-900 mb-6">How FitWorks Works</h2>
            
            {/* Manually structured vertical 1-2-3 list for clean sidebar formatting */}
            <div className="flex-1 flex flex-col gap-7">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FFF5F6] text-[#E92E3D] flex items-center justify-center font-bold text-[14px] shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Post your vacancy</h4>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                    Share your hiring requirements in a few minutes.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FFF5F6] text-[#E92E3D] flex items-center justify-center font-bold text-[14px] shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Our team finds suitable trainers</h4>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                    We review your requirement and shortlist verified trainers.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FFF5F6] text-[#E92E3D] flex items-center justify-center font-bold text-[14px] shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Connect & hire</h4>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                    We connect you with the right trainers and support you throughout the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support Footer */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF5F6] flex items-center justify-center text-[#E92E3D]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Need help?</h4>
                  <p className="text-[11px] text-gray-500">Our team is here to support you.</p>
                </div>
              </div>
              <Link href="/support" className="text-[12px] font-bold text-[#E92E3D] bg-[#FFF5F6] px-3 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

      </div>

      <HowItWorksPlayer open={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </div>
  );
}