import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, Building2, User, ArrowRight, Sparkles, Handshake } from "lucide-react";
import { PLAN_FEATURES, rupees, type GymAccessPlan } from "@/lib/hiring";
import { fetchGymPlan } from "@/lib/serverApi";

/**
 * Prices are set by an admin, so the copy quotes the live cheapest plan rather
 * than a number baked into the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const plan = await fetchGymPlan();
  const from = `${rupees(plan.price)} once`;

  return {
    title: "Pricing for Gyms & Fitness Trainers",
    description: `Transparent FitWorks pricing. Completely free for trainers. Gyms pay ${from} — no subscription, no renewal.`,
    alternates: { canonical: "/pricing" },
    openGraph: {
      title: "Pricing for Gyms & Fitness Trainers | FitWorks",
      description: `Free for trainers. Gyms pay ${from} for unlimited vacancies and hands-on hiring support.`,
      url: "https://fitworks.in/pricing",
    },
  };
}

const TRAINER_FEATURES = [
  "Free profile creation and verification",
  "Verified credentials badge",
  "Our team matches you to gym requirements",
  "We contact you when a role fits",
  "No fees, ever",
];

export default async function PricingPage() {
  const plan: GymAccessPlan = await fetchGymPlan();

  return (
    <div className="min-h-screen bg-[#fafafa] pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-[#E92E3D] uppercase tracking-[0.12em] bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-block">
            Transparent pricing
          </span>
          <h1 className="text-[28px] sm:text-[44px] font-extrabold text-gray-900 tracking-[-0.03em] leading-[1.1] mt-4">
            Simple plans for <span className="text-[#E92E3D]">everyone</span>.
          </h1>
          <p className="text-[15px] text-gray-500 mt-4 leading-relaxed">
            Free for trainers, always. Gyms pay a small membership — and our team does the hiring
            legwork for you.
          </p>
        </div>

        {/* ── Gym plans ── */}
        <div className="mt-14">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-9 h-9 rounded-xl bg-red-50 text-[#E92E3D] flex items-center justify-center shrink-0">
              <Building2 className="w-[18px] h-[18px]" />
            </span>
            <div>
              <h2 className="text-[19px] font-extrabold text-gray-900 tracking-[-0.01em]">For gyms</h2>
              <p className="text-[13px] text-gray-500">
                One payment. No subscription, no renewal, no expiry.
              </p>
            </div>
          </div>

          <div className="rounded-[20px] sm:rounded-3xl bg-white ring-2 ring-gray-900 shadow-[0_18px_44px_-20px_rgba(16,24,40,0.35)] overflow-hidden">
            <div className="p-5 sm:p-9 flex flex-col md:flex-row md:items-center gap-7 sm:gap-10">
              <div className="md:w-80 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-[0.1em]">
                  <Sparkles className="w-3 h-3" /> One-time payment
                </span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-[42px] sm:text-[52px] font-extrabold text-gray-900 tracking-[-0.04em] leading-none">
                    {rupees(plan.price)}
                  </span>
                  <span className="text-[13px] font-semibold text-gray-400">once</span>
                </div>
                <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
                  Pay once and your gym keeps full access to FitWorks. Nothing renews and nothing
                  runs out.
                </p>
                <Link
                  href="/auth/gym-signup"
                  className="inline-flex items-center justify-center gap-2 mt-5 h-12 px-6 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark active:scale-[0.98] transition-all"
                >
                  Register your gym <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 flex-1">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-600 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
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

          <div className="bg-white rounded-[20px] sm:rounded-3xl ring-1 ring-gray-200/70 p-5 sm:p-9 flex flex-col md:flex-row md:items-center gap-7 sm:gap-8">
            <div className="md:w-72 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] sm:text-[44px] font-extrabold text-gray-900 tracking-[-0.03em] leading-none">
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
              title: "No limits, ever",
              body: "Unlimited vacancies and unlimited hiring requirements, forever, on the one payment.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-[20px] ring-1 ring-gray-200/70 p-5 sm:p-6">
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
