"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  Fingerprint,
  Lock,
  ScrollText,
  UserRoundCheck,
} from "lucide-react";

const checks = [
  {
    icon: Fingerprint,
    title: "Identity verified",
    description:
      "Government-issued ID is collected and matched against the profile before approval.",
  },
  {
    icon: ScrollText,
    title: "Certifications checked",
    description:
      "Training certificates are uploaded, reviewed and recorded against each trainer.",
  },
  {
    icon: FileCheck2,
    title: "Experience reviewed",
    description:
      "Work history, previous gyms and specialisations are reviewed by our team.",
  },
  {
    icon: UserRoundCheck,
    title: "Manually approved",
    description:
      "Nothing goes live automatically. Every profile is approved by a human before publishing.",
  },
];

export default function VerifiedTrainers() {
  return (
    <section className="w-full py-14 sm:py-16 md:py-20 bg-[#fafafa]" id="verified-trainers">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-9 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-bold text-[#c5121c] uppercase tracking-[0.2em] mb-2.5">
            Verified Talent
          </p>
          <h2 className="text-[27px] leading-[1.15] sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-[-0.02em] mb-3.5">
            Get verified trainers,{" "}
            <span className="text-[#d91a24]">not guesswork.</span>
          </h2>
          <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed">
            Hiring a trainer off a WhatsApp group means trusting a claim. On
            FitWorks, every professional is checked before they can be hired —
            so you start from proof, not promises.
          </p>
        </div>

        {/* Verification checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-6 md:mb-7">
          {checks.map(({ icon: Icon, title, description }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="group relative bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.07)] hover:border-red-100 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-xl bg-red-50 text-[#c5121c] flex items-center justify-center shrink-0 group-hover:bg-[#d91a24] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-base font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                    {title}
                    <BadgeCheck className="w-4 h-4 text-[#d91a24] shrink-0" />
                  </h3>
                  <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gated-access banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl overflow-hidden bg-gray-900 p-6 sm:p-9 md:p-11"
        >
          <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#d91a24] blur-[110px] opacity-35 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7 lg:gap-10">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-widest text-white mb-4">
                <Lock className="w-3.5 h-3.5 text-[#ff5a63]" />
                Private by default
              </span>
              <h3 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-white leading-[1.2] tracking-[-0.01em] mb-3">
                Trainer profiles aren&apos;t public.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-gray-300 leading-relaxed">
                We don&apos;t list our trainers&apos; photos, documents or contact
                details on the open web. Credentials and availability are shared
                only with registered gyms and hiring partners — so our
                professionals stay protected, and your shortlist stays yours.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-[280px] shrink-0">
              <Link href="/auth" className="w-full">
                <span className="flex items-center justify-between gap-2 w-full h-[52px] px-5 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-[15px] font-bold shadow-[0_8px_20px_rgb(217,26,36,0.3)] active:scale-[0.98] transition-all duration-200 group">
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="w-[18px] h-[18px]" />
                    Hire as a Gym
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/auth" className="w-full">
                <span className="flex items-center justify-between gap-2 w-full h-[52px] px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white text-[15px] font-bold backdrop-blur-sm active:scale-[0.98] transition-all duration-200 group">
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="w-[18px] h-[18px]" />
                    Get Verified
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <p className="text-[11px] text-gray-400 text-center leading-snug">
                Free to create an account. Takes under 2 minutes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
