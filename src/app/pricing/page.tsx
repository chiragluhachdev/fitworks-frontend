import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, Building2, User, ArrowRight, Sparkles, Handshake } from "lucide-react";
import { PLAN_FEATURES } from "@/lib/hiring";

export const metadata: Metadata = {
  title: "Pricing for Gyms & Fitness Trainers",
  description:
    "FitWorks is free. Free for trainers, free for gyms — post vacancies, get verified and let our team handle the hiring. No subscription, no commission.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing for Gyms & Fitness Trainers | FitWorks",
    description:
      "Free for trainers, free for gyms. Unlimited vacancies and hands-on hiring support at no cost.",
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

/** One side of the marketplace, priced at nothing. */
function FreeCard({
  icon: Icon,
  audience,
  blurb,
  features,
  cta,
  href,
  emphasis = false,
}: {
  icon: typeof Building2;
  audience: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-[20px] sm:rounded-3xl bg-white p-5 sm:p-8 ${
        emphasis
          ? "ring-2 ring-gray-900 shadow-[0_18px_44px_-20px_rgba(16,24,40,0.35)]"
          : "ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
      }`}
    >
      <span className="w-10 h-10 rounded-xl bg-brand-tint text-brand flex items-center justify-center">
        <Icon className="w-[18px] h-[18px]" />
      </span>

      <h2 className="text-[17px] font-extrabold text-gray-900 tracking-[-0.01em] mt-4">{audience}</h2>

      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-[42px] sm:text-[52px] font-extrabold text-gray-900 tracking-[-0.04em] leading-none">
          ₹0
        </span>
        <span className="text-[13px] font-semibold text-gray-400">forever</span>
      </div>

      <p className="text-[13px] sm:text-[14px] text-gray-500 mt-3 leading-relaxed">{blurb}</p>

      <ul className="space-y-2.5 mt-6 pt-6 border-t border-gray-100 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-gray-600 leading-snug">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`mt-7 h-12 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          emphasis
            ? "bg-brand text-white hover:bg-brand-dark"
            : "bg-white text-gray-800 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50"
        }`}
      >
        {cta} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-brand uppercase tracking-[0.12em] bg-brand-tint ring-1 ring-red-100 px-3 py-1 rounded-full inline-block">
            Transparent pricing
          </span>
          <h1 className="text-[28px] sm:text-[44px] font-extrabold text-gray-900 tracking-[-0.03em] leading-[1.1] mt-4">
            FitWorks is <span className="text-brand">free</span>.
          </h1>
          <p className="text-[14px] sm:text-[15px] text-gray-500 mt-4 leading-relaxed">
            Free for trainers and free for gyms. No subscription, no commission on a hire, and
            nothing to cancel.
          </p>
        </div>

        {/* ── Both sides ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          <FreeCard
            icon={Building2}
            audience="For gyms"
            blurb="Post what you're hiring for and our team finds, checks and introduces suitable trainers."
            features={PLAN_FEATURES}
            cta="Register your gym"
            href="/auth/gym-signup"
            emphasis
          />
          <FreeCard
            icon={User}
            audience="For trainers"
            blurb="Create a profile, get verified, and we connect you with gyms that need what you do."
            features={TRAINER_FEATURES}
            cta="Join as a trainer"
            href="/auth/trainer-signup"
          />
        </div>

        {/* ── Why it's free, answered before it's asked ── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
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
              title: "No limits, no catch",
              body: "Unlimited vacancies and unlimited hiring requirements. We're building the network first.",
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
