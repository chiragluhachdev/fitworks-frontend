"use client";

import { useState } from "react";
import { Search, MessageSquare, ShieldCheck, ArrowRight, UserCheck, Dumbbell, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const gymSteps = [
  {
    number: "01",
    title: "Post & Search",
    subtitle: "Find Top Talent",
    description: "Browse thousands of pre-verified personal trainers, strength coaches, and group instructors filtered by location and experience.",
    icon: Search,
    highlights: ["Verified Certifications", "Location-based Search", "Experience Matching"]
  },
  {
    number: "02",
    title: "Connect & Interview",
    subtitle: "Direct Communication",
    description: "Review complete trainer portfolios, work history, and client reviews. Connect directly to schedule interviews.",
    icon: MessageSquare,
    badge: "Direct Contact",
    highlights: ["Instant Messaging", "Portfolio Reviews", "Skill Verification"]
  },
  {
    number: "03",
    title: "Hire & Scale",
    subtitle: "Seamless Onboarding",
    description: "Finalize terms with confidence and onboard top-tier fitness talent to elevate your gym's client satisfaction.",
    icon: ShieldCheck,
    badge: "Guaranteed Match",
    highlights: ["Standardized Agreements", "Fast Onboarding", "Performance Growth"]
  },
];

const trainerSteps = [
  {
    number: "01",
    title: "Create Profile",
    subtitle: "Showcase Skills",
    description: "Build a professional profile highlighting your certifications, specializations, transformed clients, and career availability.",
    icon: UserCheck,
    badge: "100% Free Profile",
    highlights: ["Badge Verification", "Portfolio Uploads", "Custom Rates"]
  },
  {
    number: "02",
    title: "Get Discovered",
    subtitle: "Receive Job Offers",
    description: "Get noticed by top gyms, fitness centers, and private clients actively searching for verified fitness coaches.",
    icon: Dumbbell,
    badge: "Direct Inquiries",
    highlights: ["Verified Gym Invites", "Transparent Roles", "Flexible Schedules"]
  },
  {
    number: "03",
    title: "Grow Career",
    subtitle: "Build Income",
    description: "Secure rewarding training contracts, expand your client base, and accelerate your fitness career with total confidence.",
    icon: Zap,
    badge: "Career Growth",
    highlights: ["Higher Pay Rates", "Long-term Clients", "Industry Recognition"]
  },
];

export default function HowItWorks() {
  const [tab, setTab] = useState<"gyms" | "trainers">("gyms");
  const steps = tab === "gyms" ? gymSteps : trainerSteps;

  return (
    <section className="w-full py-24 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa] relative overflow-hidden" id="how-it-works">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#d91a24]/[0.03] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-[1380px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#d91a24] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-4">
              <Zap className="w-3.5 h-3.5 fill-[#d91a24]" /> How FitWorks Operates
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Simple steps, <span className="text-[#d91a24]">extraordinary</span> results
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Whether you are hiring for a gym or advancing your personal training career, FitWorks streamlines every step.
            </p>
          </motion.div>

          {/* Perspective Toggle Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60 mt-8 shadow-inner"
          >
            <button
              onClick={() => setTab("gyms")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "gyms"
                  ? "bg-white text-[#d91a24] shadow-md shadow-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Gym Owners
            </button>
            <button
              onClick={() => setTab("trainers")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                tab === "trainers"
                  ? "bg-white text-[#d91a24] shadow-md shadow-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Trainers
            </button>
          </motion.div>
        </div>

        {/* Steps Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative"
          >
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-red-100 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Decorative Subtle Number Watermark */}
                  <span className="absolute top-4 right-6 text-6xl font-extrabold text-gray-100 group-hover:text-red-50 transition-colors pointer-events-none select-none">
                    {step.number}
                  </span>

                  <div>
                    {/* Top Icon Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center group-hover:bg-[#d91a24] group-hover:text-white transition-all duration-300 shadow-sm">
                        <IconComponent className="w-7 h-7" />
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="mb-4">
                      <span className="text-xs font-bold text-[#d91a24] tracking-wider uppercase">Step {step.number}</span>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#d91a24] transition-colors">{step.title}</h3>
                      <p className="text-xs font-semibold text-gray-400 mt-0.5">{step.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="pt-4 border-t border-gray-50 space-y-2">
                    {step.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d91a24]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA Footer inside How It Works */}
        <div className="mt-14 text-center">
          <Link href="/auth" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#d91a24] hover:bg-[#cc1616] px-8 py-3.5 rounded-2xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
