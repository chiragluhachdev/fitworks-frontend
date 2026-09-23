import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, Building2, User, ArrowRight, Sparkles, Handshake } from "lucide-react";
import { GYM_PLANS, PLAN_FEATURES, rupees } from "@/lib/hiring";

export const metadata: Metadata = {
  title: "Pricing Plans for Gyms & Fitness Trainers",
  description:
    "Transparent FitWorks pricing. Completely free for trainers. Gyms start at ₹199 a month for unlimited vacancies and hands-on hiring support.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing Plans for Gyms & Fitness Trainers | FitWorks",
    description:
      "Free for trainers. Gym plans from ₹199/month with unlimited vacancies and FitWorks-assisted hiring.",
    url: "https://fitworks.in/pricing",
  },
};

const TRAINER_FEATURES = [
  "Free profile creation and verification",
  "Verified credentials badge",
  "Our team matches you to gym requirements",
  "We contact you when a role fits",
  "No fees, ever",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-[#d91a24] uppercase tracking-[0.12em] bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-block">
            Transparent pricing
          </span>
          <h1 className="text-[32px] sm:text-[44px] font-extrabold text-gray-900 tracking-[-0.03em] leading-[1.1] mt-4">
            Simple plans for <span className="text-[#d91a24]">everyone</span>.
          </h1>
          <p className="text-[15px] text-gray-500 mt-4 leading-relaxed">
            Free for trainers, always. Gyms pay a small membership — and our team does the hiring
            legwork for you.
          </p>
        </div>

        {/* ── Gym plans ── */}
        <div className="mt-14">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-9 h-9 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0">
              <Building2 className="w-[18px] h-[18px]" />
            </span>
            <div>
              <h2 className="text-[19px] font-extrabold text-gray-900 tracking-[-0.01em]">For gyms</h2>
              <p className="text-[13px] text-gray-500">
                Every plan includes the same features. Longer terms simply cost less per month.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GYM_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl bg-white p-7 border ${
                  plan.best ? "border-gray-900 shadow-[0_0_0_1px_rgb(17,24,39)]" : "border-gray-200/80"
                }`}
              >
                {plan.best && (
                  <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[10.5px] font-extrabold uppercase tracking-[0.08em]">
                    <Sparkles className="w-3 h-3" /> Best value
                  </span>
                )}

                <h3 className="text-[15px] font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-2.5">
                  <span className="text-[38px] font-extrabold text-gray-900 tracking-[-0.03em] leading-none">
                    {rupees(plan.price)}
                  </span>
                  <span className="text-[13px] font-semibold text-gray-400">{plan.cadence}</span>
                </div>
                <p className="text-[12.5px] text-gray-500 mt-2">
                  {plan.months === 1 ? (
                    "Billed monthly"
                  ) : (
                    <>
                      Works out to {rupees(plan.perMonth)}/month —{" "}
                      <span className="font-bold text-emerald-600">save {plan.savingsPercent}%</span>
                    </>
                  )}
                </p>

                <ul className="space-y-2.5 mt-6 pt-6 border-t border-gray-100 flex-1">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-gray-600 leading-snug">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/gym-signup"
                  className={`mt-7 h-12 rounded-xl text-sm font-bold flex items-center justify-center transition-all active:scale-[0.98] ${
                    plan.best
                      ? "bg-[#d91a24] text-white hover:bg-[#c11620]"
                      : "bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Choose plan
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trainers ── */}
        <div className="mt-14">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
              <User className="w-[18px] h-[18px]" />
            </span>
            <div>
              <h2 className="text-[19px] font-extrabold text-gray-900 tracking-[-0.01em]">
                For trainers
              </h2>
              <p className="text-[13px] text-gray-500">No fees of any kind. Not now, not later.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 p-7 sm:p-9 flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-72 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[44px] font-extrabold text-gray-900 tracking-[-0.03em] leading-none">
                  ₹0
                </span>
                <span className="text-[13px] font-semibold text-gray-400">forever</span>
              </div>
              <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                Create a profile, get verified, and our team connects you with gyms that need what you
                do.
              </p>
              <Link
                href="/auth/trainer-signup"
                className="inline-flex items-center justify-center gap-2 mt-5 h-12 px-6 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 active:scale-[0.98] transition-all"
              >
                Join as a trainer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {TRAINER_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-600 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── What the membership actually buys ── */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Handshake,
              title: "We do the searching",
              body: "You post a requirement. Our team searches the network, speaks to trainers and puts the right ones in front of you.",
            },
            {
              icon: ShieldCheck,
              title: "Every trainer is verified",
              body: "Fitness certificates and a government ID, checked by our team before any profile reaches you.",
            },
            {
              icon: Sparkles,
              title: "No limits on any plan",
              body: "Unlimited vacancies and unlimited hiring requirements, whichever term you pick.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-4">
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <h3 className="text-[14.5px] font-bold text-gray-900">{title}</h3>
              <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
