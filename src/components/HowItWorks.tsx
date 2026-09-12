"use client";

import { useState } from "react";
import {
  Search,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Dumbbell,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const gymSteps = [
  {
    number: "01",
    title: "Post & Search",
    subtitle: "Find Top Talent",
    description:
      "Post a vacancy or browse verified personal trainers, strength coaches and group instructors, filtered by location and experience.",
    icon: Search,
    highlights: ["Verified certifications", "Location-based search", "Experience matching"],
  },
  {
    number: "02",
    title: "Connect & Interview",
    subtitle: "Direct Communication",
    description:
      "Review complete trainer profiles, work history and credentials. Send a connection request and take the conversation from there.",
    icon: MessageSquare,
    highlights: ["Direct connection requests", "Full profile access", "Document verification"],
  },
  {
    number: "03",
    title: "Hire & Scale",
    subtitle: "Seamless Onboarding",
    description:
      "Shortlist, finalise terms with confidence and onboard fitness talent that lifts your gym's retention and client results.",
    icon: ShieldCheck,
    highlights: ["Shortlist tracking", "Fast onboarding", "No agent commissions"],
  },
];

const trainerSteps = [
  {
    number: "01",
    title: "Create Profile",
    subtitle: "Showcase Skills",
    description:
      "Build a professional profile with your certifications, specialisations, work history and availability — free to set up.",
    icon: UserCheck,
    highlights: ["Free to sign up", "Certificate uploads", "Set your expectations"],
  },
  {
    number: "02",
    title: "Get Verified",
    subtitle: "Stand Out",
    description:
      "Submit your ID and certificates. Once our team approves them, your profile carries the FitWorks verified badge.",
    icon: Dumbbell,
    highlights: ["ID & certificate check", "Verified badge", "Priority visibility"],
  },
  {
    number: "03",
    title: "Grow Career",
    subtitle: "Build Income",
    description:
      "Browse vacancies from gyms actively hiring, apply to the ones that fit, and grow your career with real opportunities.",
    icon: Zap,
    highlights: ["Direct gym invites", "Apply to vacancies", "Track every application"],
  },
];

export default function HowItWorks() {
  const [tab, setTab] = useState<"gyms" | "trainers">("gyms");
  const steps = tab === "gyms" ? gymSteps : trainerSteps;

  return (
    <section
      className="w-full py-14 sm:py-16 md:py-24 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa] relative overflow-hidden"
      id="how-it-works"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-[#d91a24]/[0.03] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-[1380px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-9 sm:mb-12 px-5 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#d91a24] uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-4">
              <Zap className="w-3.5 h-3.5 fill-[#d91a24]" /> How FitWorks Operates
            </span>
            <h2 className="text-[27px] leading-[1.15] sm:text-3xl md:text-5xl font-extrabold text-gray-900 tracking-[-0.02em] mb-3.5">
              Simple steps, <span className="text-[#d91a24]">extraordinary</span> results
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px] sm:text-base md:text-lg leading-relaxed">
              Whether you&apos;re hiring for a gym or advancing your training
              career, FitWorks streamlines every step.
            </p>
          </motion.div>

          {/* Perspective toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            role="tablist"
            aria-label="Choose your perspective"
            className="grid grid-cols-2 sm:inline-flex items-center p-1.5 bg-gray-100/90 rounded-2xl border border-gray-200/60 mt-7 shadow-inner w-full max-w-[340px] sm:w-auto sm:max-w-none"
          >
            {(
              [
                ["gyms", "For Gym Owners"],
                ["trainers", "For Trainers"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all duration-300 ${
                  tab === value
                    ? "bg-white text-[#d91a24] shadow-md shadow-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Steps — swipeable rail on mobile, grid from md up */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-5 sm:px-6 md:px-8 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative bg-white rounded-3xl p-6 sm:p-7 md:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-red-100 md:hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between snap-center shrink-0 w-[85vw] max-w-[340px] md:w-auto md:max-w-none"
                >
                  {/* Number watermark */}
                  <span className="absolute top-4 right-5 text-5xl md:text-6xl font-extrabold text-gray-100 group-hover:text-red-50 transition-colors pointer-events-none select-none">
                    {step.number}
                  </span>

                  <div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-[#d91a24] group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    <div className="mb-3.5">
                      <span className="text-[11px] font-bold text-[#d91a24] tracking-wider uppercase">
                        Step {step.number}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#d91a24] transition-colors leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-400 mt-1">
                        {step.subtitle}
                      </p>
                    </div>

                    <p className="text-[13px] sm:text-sm text-gray-600 leading-relaxed mb-5 sm:mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    {step.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-2 text-[12px] sm:text-xs font-medium text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d91a24] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Swipe hint — mobile only */}
        <p className="md:hidden text-center text-[11px] font-medium text-gray-400 mt-4">
          Swipe to see all steps
        </p>

        {/* CTA */}
        <div className="mt-10 sm:mt-14 text-center px-5 sm:px-6">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-2 text-[15px] font-bold text-white bg-[#d91a24] hover:bg-[#cc1616] px-8 h-[52px] rounded-2xl shadow-[0_10px_24px_rgb(217,26,36,0.24)] active:scale-[0.98] transition-all w-full sm:w-auto"
          >
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
