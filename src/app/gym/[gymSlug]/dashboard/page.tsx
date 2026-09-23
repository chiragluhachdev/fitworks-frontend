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
  Crown,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/workspace/Button";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { VacancyRowItem } from "@/components/gym/VacancyCard";
import HowItWorksPlayer, { HowItWorksInline } from "@/components/workspace/HowItWorksPlayer";
import { api } from "@/lib/api";
import { findPlan, shortDate } from "@/lib/hiring";

/**
 * The accents the tiles are built from.
 *
 * Each card gets one colour and uses it three ways — the icon chip, the glow
 * that warms the corner on hover, and the ring. Nothing else on the card is
 * coloured, so four tiles side by side read as one set rather than four.
 */
const ACCENTS = {
  red: { chip: "bg-brand-tint text-brand", glow: "bg-brand", ring: "group-hover:ring-red-200/80" },
  blue: { chip: "bg-blue-50 text-blue-600", glow: "bg-blue-500", ring: "group-hover:ring-blue-200/80" },
  amber: { chip: "bg-amber-50 text-amber-600", glow: "bg-amber-500", ring: "group-hover:ring-amber-200/80" },
  slate: { chip: "bg-gray-100 text-gray-600", glow: "bg-gray-500", ring: "group-hover:ring-gray-300" },
} as const;

/**
 * One tile on the overview grid.
 *
 * The state sits top-right and the arrow bottom-right. They used to share the
 * top-right corner, where "Inactive" ran straight into the chevron.
 */
function Tile({
  href,
  icon: Icon,
  accent,
  label,
  hint,
  state,
}: {
  href: string;
  icon: LucideIcon;
  accent: keyof typeof ACCENTS;
  label: string;
  hint: React.ReactNode;
  /** The figure or status this card is reporting. Omitted when it has none. */
  state?: React.ReactNode;
}) {
  const a = ACCENTS[accent];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden bg-white rounded-[20px] p-5 ring-1 ring-gray-200/70 ${a.ring}
        min-h-[152px] flex flex-col justify-between
        shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_16px_34px_-14px_rgba(16,24,40,0.22)]
        hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
    >
      {/* Warms the corner on hover, in the card's own colour. */}
      <span
        aria-hidden
        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none ${a.glow}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${a.chip}`}
        >
          <Icon className="w-5 h-5" />
        </span>
        {state && <div className="text-right shrink-0 pt-0.5">{state}</div>}
      </div>

      <div className="relative flex items-end justify-between gap-3 mt-4">
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold text-gray-900 leading-tight">{label}</p>
          <p className="text-[11.5px] text-gray-500 mt-1 leading-snug">{hint}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </Link>
  );
}

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

  const { gym, stats, subscription, completion, activeVacancies = [] } = data;
  const firstName = (gym?.contactPerson?.name || "").split(" ")[0];
  const hasVacancies = (stats?.totalVacancies ?? 0) > 0;
  const plan = findPlan(subscription?.plan);

  return (
    <div className="max-w-[1200px] w-full mx-auto animate-in fade-in duration-300 pb-10">
      
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0a0a0a] rounded-[20px] sm:rounded-[24px] px-5 py-8 sm:px-12 sm:py-14 mb-4 sm:mb-6 shadow-sm flex flex-col justify-center min-h-[268px] sm:min-h-[340px]">
        {/* Background Image Masked to the right */}
        <div 
          className="absolute inset-y-0 right-0 w-[80%] sm:w-[60%] bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-[center_top_-4rem] opacity-60 mix-blend-lighten pointer-events-none"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 60%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 60%)' }}
        />
        
        <div className="relative z-10 max-w-xl">
          {firstName && (
            <p className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3 sm:mb-4">
              Welcome back, {firstName}
            </p>
          )}
          
          <h1 className="text-[27px] sm:text-[42px] font-bold text-white leading-[1.14] tracking-[-0.02em] mb-3 sm:mb-4">
            Find the right fitness <br className="hidden sm:block" />
            professionals <span className="text-brand">for your gym.</span>
          </h1>
          
          <p className="text-[13px] sm:text-[15px] text-gray-300 mb-6 sm:mb-8 max-w-[400px] leading-relaxed">
            Post your hiring requirements and let the FitWorks team help you find suitable trainers.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link 
              href={`/gym/${gymSlug}/vacancies/new`} 
              className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white text-[14.5px] sm:text-[15px] font-semibold rounded-xl px-5 sm:px-6 h-12 transition-colors shadow-[0_8px_24px_-10px_rgba(233,46,61,0.9)]"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Post a Vacancy
            </Link>
            
            {/* Opens the twenty-second explainer. It is the only place that
                does — a gym owner who understands the process doesn't need it
                taking up room on the page. */}
            <button
              onClick={() => setExplainerOpen(true)}
              className="inline-flex items-center justify-center bg-transparent ring-1 ring-white/35 hover:ring-white hover:bg-white/10 text-white text-[14.5px] sm:text-[15px] font-semibold rounded-xl px-5 sm:px-6 h-12 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 mr-1.5" /> How it works
            </button>
          </div>
        </div>
      </section>

      {/* ── Overview grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Tile
          href={`/gym/${gymSlug}/vacancies`}
          icon={Briefcase}
          accent="red"
          label="Active Vacancies"
          hint={`${stats?.totalVacancies ?? 0} posted in total`}
          state={
            <span className="text-[26px] font-extrabold text-gray-900 leading-none tracking-[-0.02em] tabular-nums">
              {stats?.activeVacancies ?? 0}
            </span>
          }
        />

        <Tile
          href={`/gym/${gymSlug}/profile?tab=profile`}
          icon={User}
          accent="blue"
          label="Edit Profile"
          hint="Update gym details & photos"
          state={
            typeof completion?.percent === "number" ? (
              <span
                className={`text-[26px] font-extrabold leading-none tracking-[-0.02em] tabular-nums ${
                  completion.percent >= 100 ? "text-emerald-600" : "text-gray-900"
                }`}
              >
                {completion.percent}
                <span className="text-[14px] font-bold opacity-50">%</span>
              </span>
            ) : undefined
          }
        />

        <Tile
          href={`/gym/${gymSlug}/subscription`}
          icon={Crown}
          accent="amber"
          label="Subscription"
          hint={
            subscription?.isActive
              ? `Renews ${shortDate(subscription.expiresAt)}`
              : "Choose a plan to keep hiring"
          }
          state={
            subscription?.isActive ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/70 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {plan?.name?.replace("FitWorks ", "") || "Active"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-gray-500 bg-gray-100 ring-1 ring-gray-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Inactive
              </span>
            )
          }
        />

        <Tile
          href={`/gym/${gymSlug}/profile?tab=account`}
          icon={Settings}
          accent="slate"
          label="Settings"
          hint="Password, email and sign out"
        />
      </div>

      {/* ── Subscription Banner ── */}
      {!subscription?.isActive && (
        <div className="bg-brand-tint ring-1 ring-[#FFE2E5] rounded-[20px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <CreditCard className="text-brand w-5 h-5" />
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
            className="inline-flex items-center justify-center bg-brand hover:bg-red-600 text-white font-medium rounded-xl mt-4 sm:mt-0 px-6 whitespace-nowrap h-11 transition-colors"
          >
            View Plans <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      )}

      {/* ── Lower Split Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Vacancies */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[20px] sm:rounded-[24px] ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden h-full flex flex-col min-h-[400px]">
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
                    className="inline-flex items-center justify-center bg-brand hover:bg-red-600 text-white font-medium rounded-xl h-11 px-6 shadow-sm transition-colors"
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
          <div className="bg-white rounded-[20px] sm:rounded-[24px] ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-4 sm:p-6 h-full flex flex-col">
            <h2 className="text-[16px] font-bold text-gray-900 mb-6">How FitWorks Works</h2>
            
            {/* The same three steps, playing. Nobody reads a 1-2-3 list twice;
                the loop says it once and keeps saying it. */}
            <div className="flex-1">
              <HowItWorksInline onExpand={() => setExplainerOpen(true)} />
            </div>

            {/* Contact Support Footer */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-tint flex items-center justify-center text-brand">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Need help?</h4>
                  <p className="text-[11px] text-gray-500">Our team is here to support you.</p>
                </div>
              </div>
              <Link href={`/gym/${gymSlug}/profile?tab=support`} className="text-[12px] font-bold text-brand bg-brand-tint px-3 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
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