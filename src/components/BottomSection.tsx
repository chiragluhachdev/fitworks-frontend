"use client";

import React from "react";
import Link from "next/link";
import { Building2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

const partnerGyms = [
  {
    name: "HOPE GYM & SPA",
    type: "Premium Fitness & Wellness Club",
    badge: "Official Partner",
  },
  {
    name: "ANYDAY FITNESS",
    type: "24/7 Strength & Conditioning Center",
    badge: "Official Partner",
  },
];

export default function TrustedBy() {
  return (
    <section className="w-full bg-[#f8f9fa] border-y border-gray-100 py-10 my-6">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#d91a24] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-red-100 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Early Partner Gyms
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
            Trusted by Forward-Thinking Fitness Clubs
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Collaborating with premier gyms to connect certified trainers with high-impact coaching roles.
          </p>
        </div>

        {/* Partner Gym Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch max-w-4xl mx-auto">
          
          {/* HOPE GYM & SPA */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center font-black text-xl text-[#d91a24] shrink-0 group-hover:scale-105 transition-transform">
                H
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-extrabold text-gray-900 tracking-tight">HOPE GYM & SPA</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Premium Fitness & Wellness</p>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 mt-1">
                  Partner Gym
                </span>
              </div>
            </div>
          </div>

          {/* ANYDAY FITNESS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-xl text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-extrabold text-gray-900 tracking-tight">ANYDAY FITNESS</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Strength & Conditioning Center</p>
                <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 mt-1">
                  Partner Gym
                </span>
              </div>
            </div>
          </div>

          {/* Become a Partner Gym CTA */}
          <div className="bg-gradient-to-br from-red-50/50 to-orange-50/30 rounded-2xl p-6 border border-dashed border-red-200 flex flex-col justify-between items-start md:col-span-2 lg:col-span-1">
            <div>
              <span className="text-[10px] font-bold text-[#d91a24] uppercase tracking-wider block mb-1">
                Are you a gym owner?
              </span>
              <h4 className="text-sm font-bold text-gray-900">Partner with FitWorks</h4>
              <p className="text-xs text-gray-500 mt-0.5">Hire verified trainers with zero upfront recruitment hassle.</p>
            </div>
            <Link href="/auth" className="mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#d91a24] hover:underline">
                Register Your Gym <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
