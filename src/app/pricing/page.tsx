import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, Zap, Building2, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing Plans for Gyms & Fitness Trainers",
  description:
    "Explore transparent pricing plans on FitWorks. Free profiles and job discovery for trainers, plus flexible verified hiring packages for gyms.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing Plans for Gyms & Fitness Trainers | FitWorks",
    description:
      "Transparent hiring plans for fitness clubs and free verification for personal trainers across India.",
    url: "https://fitworks.in/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#d91a24] uppercase tracking-widest bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-block">
            Transparent Pricing
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Simple plans for <span className="text-[#d91a24]">everyone</span>.
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Free forever for certified trainers. Flexible hiring packages for fitness studios and gym chains.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Trainer Tier */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">For Trainers</h3>
                <p className="text-xs text-gray-500 mt-1">Get verified and discovered by top gyms.</p>
              </div>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-gray-900">₹0</span>
                <span className="text-xs text-gray-400 font-semibold ml-1">/ Free Forever</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Public Trainer Showcase Profile</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Credentials & PAN Badge</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Apply to Unlimited Gym Vacancies</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Gym Interview Invitations</span>
                </li>
              </ul>
            </div>

            <Link href="/auth" className="w-full block">
              <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-bold border-gray-200 hover:bg-gray-50">
                Join as a Trainer
              </Button>
            </Link>
          </div>

          {/* Gym Starter (Highlighted) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#d91a24] shadow-xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d91a24] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Most Popular for Gyms
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Gym Starter</h3>
                <p className="text-xs text-gray-500 mt-1">Perfect for single location fitness studios.</p>
              </div>
              <div className="pt-2">
                <span className="text-4xl font-extrabold text-gray-900">₹0</span>
                <span className="text-xs text-gray-400 font-semibold ml-1">/ Free Beta</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Post Active Job Vacancies</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Trainer Profile Search</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Applicant Review & Candidate Tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Gym Brand Showcase</span>
                </li>
              </ul>
            </div>

            <Link href="/auth" className="w-full block">
              <Button className="w-full h-11 rounded-xl text-xs font-bold bg-[#d91a24] hover:bg-[#cc1616] text-white shadow-xs">
                Register Your Gym
              </Button>
            </Link>
          </div>

          {/* Gym Enterprise / Pro */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Gym Chain / Pro</h3>
                <p className="text-xs text-gray-500 mt-1">For multi-branch gym chains & premium clubs.</p>
              </div>
              <div className="pt-2">
                <span className="text-3xl font-extrabold text-gray-900">Custom</span>
                <span className="text-xs text-gray-400 font-semibold ml-1">/ Dedicated Matching</span>
              </div>
              <ul className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Job Vacancies</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Recruiter & Background Checks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-Branch Hiring Dashboard</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priority Candidate Placement</span>
                </li>
              </ul>
            </div>

            <Link href="/contact" className="w-full block">
              <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-bold border-gray-200 hover:bg-gray-50">
                Contact Enterprise Team
              </Button>
            </Link>
          </div>

        </div>

        {/* Guarantee Banner */}
        <div className="p-6 bg-red-50/60 rounded-3xl border border-red-100 flex items-center gap-4 text-xs text-gray-700">
          <ShieldCheck className="w-8 h-8 text-[#d91a24] shrink-0" />
          <p>
            <span className="font-bold text-gray-900">100% Verification Commitment:</span> All candidates undergo identity and credential validation before placement to ensure the highest standards of safety and coaching excellence.
          </p>
        </div>

      </div>
    </div>
  );
}
