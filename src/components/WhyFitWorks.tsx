"use client";

import { ShieldCheck, Globe, Zap, TrendingUp, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    description:
      "Every profile goes through a manual review, so you only connect with qualified, genuine professionals.",
  },
  {
    icon: Globe,
    title: "Growing Network",
    description:
      "Trainers, coaches and fitness specialists across Delhi NCR and expanding to gyms nationwide.",
  },
  {
    icon: Zap,
    title: "Direct Connections",
    description:
      "Shortlist, connect and hire straight from your dashboard. No agents, no commissions on your salary.",
  },
  {
    icon: TrendingUp,
    title: "Better Outcomes",
    description:
      "Whether you're staffing a gym floor or building a career, you start from verified information.",
  },
];

export default function WhyFitWorks() {
  return (
    <section className="w-full py-14 sm:py-16 md:py-20 bg-white relative overflow-hidden" id="why-fitworks">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-red-50/60 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3 z-0" />

      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Visual ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[520px] shadow-[0_20px_60px_rgb(0,0,0,0.10)] border-4 border-white">
              <Image
                src="/images/hero.png"
                alt="Verified fitness trainers working with a gym team"
                fill
                className="object-cover object-[center_30%] hover:scale-[1.04] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/10 to-transparent" />

              {/* Overlaid proof strip — inside the frame, so nothing overflows on mobile */}
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-md px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg">
                  <span className="w-9 h-9 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-[18px] h-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-extrabold text-gray-900 leading-none mb-1">
                      100% Verified
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 leading-none truncate">
                      Manually reviewed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 backdrop-blur-md px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg">
                  <span className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <Lock className="w-[18px] h-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-extrabold text-gray-900 leading-none mb-1">
                      Private Profiles
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 leading-none truncate">
                      Gyms only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Content ── */}
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-5">
                <Zap className="w-3.5 h-3.5 text-[#d91a24]" />
                <span className="text-[11px] sm:text-xs font-bold text-[#d91a24] uppercase tracking-widest">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-[27px] leading-[1.15] sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-[-0.02em] mb-4">
                Built for <span className="text-[#d91a24]">trust.</span>{" "}
                <br className="hidden sm:block" />
                Designed for <span className="text-[#d91a24]">results.</span>
              </h2>
              <p className="text-[15px] sm:text-base text-gray-500 mb-8 sm:mb-10 max-w-lg leading-relaxed">
                FitWorks is more than a listing platform. It&apos;s a vetted
                hiring channel where trainers are verified before they&apos;re
                visible, and gyms hire on evidence instead of word of mouth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7 sm:gap-y-9">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group flex sm:block items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0 sm:mb-4 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-red-100 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-[#d91a24]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] sm:text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#d91a24] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed sm:pr-4">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
