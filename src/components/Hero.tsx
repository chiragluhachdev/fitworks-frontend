"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Building2,
  Search,
  MapPin,
  Briefcase,
  User,
  ShieldCheck,
  Users,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "100% Verified",
    detail: "Every profile manually checked",
  },
  {
    icon: Star,
    title: "Top Talent",
    detail: "Handpicked professionals",
  },
  {
    icon: Users,
    title: "Direct Hiring",
    detail: "No agents, no middlemen",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* ── Mobile: the hero photo becomes a soft full-bleed background ── */}
      <div className="md:hidden absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover object-[82%_22%]"
        />
        {/* Wash the photo back so the copy always wins */}
        <div className="absolute inset-0 bg-white/[0.84]" />
        {/* Fade to solid white at both edges so it blends into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      {/* Warm brand tint in the corner */}
      <div className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-[#d91a24]/[0.07] blur-[110px] pointer-events-none z-0" />

      {/* Decorative brand rings — desktop only */}
      <div className="hidden lg:block absolute top-[8%] right-[6%] w-[460px] h-[460px] rounded-full border border-[#c5121c]/10 pointer-events-none z-0" />
      <div className="hidden lg:block absolute top-[24%] right-[-6%] w-[620px] h-[620px] rounded-full border border-[#c5121c]/[0.06] pointer-events-none z-0" />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16 pt-9 pb-11 sm:pt-12 sm:pb-14 md:py-20 lg:py-24">

        {/* ── Desktop: seamless right-side hero image (unchanged) ── */}
        <div className="hidden md:block absolute inset-y-0 right-[-5%] lg:right-[-6.3%] w-[65%] z-0 [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_100%)] pointer-events-none">
          <Image
            src="/images/hero.png"
            alt="Verified fitness trainers on FitWorks"
            fill
            className="object-cover object-[70%_top]"
            priority
            sizes="65vw"
          />
        </div>

        <div className="relative z-10 w-full md:max-w-[600px] lg:max-w-[640px]">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#c5121c] pl-2 pr-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold mb-5 border border-red-100 shadow-[0_2px_10px_rgb(197,18,28,0.08)]"
          >
            <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </span>
            <span>India&apos;s Trusted Fitness Hiring Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[34px] leading-[1.1] sm:text-[44px] sm:leading-[1.08] lg:text-[56px] xl:text-[62px] font-extrabold tracking-[-0.02em] text-gray-900 mb-4"
          >
            Find the right{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block text-[#c5121c]">
              fitness
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-1 w-full h-[8px] text-[#d91a24]/25"
              >
                <path
                  d="M2 8C50 3 150 3 198 8"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{" "}
            professional.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[15px] sm:text-base lg:text-lg text-gray-600 mb-7 sm:mb-8 max-w-[500px] leading-relaxed"
          >
            Connecting gyms and individuals with verified trainers, coaches and
            fitness professionals across India.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-0 md:mb-10"
          >
            <Link href="/auth" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[52px] sm:h-[48px] px-7 rounded-xl text-[15px] font-semibold shadow-[0_10px_24px_rgb(197,18,28,0.24)] flex items-center justify-center">
                Get Hired <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-[52px] sm:h-[48px] px-7 rounded-xl text-[15px] font-semibold bg-white/80 backdrop-blur-sm border-gray-200 text-gray-900 hover:bg-white active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 shadow-sm flex items-center justify-center"
              >
                <Building2 className="w-4 h-4 mr-2 text-gray-700" />
                Hire for Your Gym
              </Button>
            </Link>
          </motion.div>

          {/* ── Search bar — desktop only ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="hidden md:block bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.09)] border border-gray-100 p-3.5 mb-10 w-full max-w-[700px]"
          >
            <div className="flex items-center">
              <div className="flex items-center flex-1 min-w-0 divide-x divide-gray-100">
                <SearchField
                  icon={User}
                  label="I'm looking for"
                  accent
                  options={[
                    "Select role",
                    "Personal Trainer",
                    "Yoga Instructor",
                    "Strength Coach",
                    "Group Fitness Instructor",
                  ]}
                />
                <SearchField
                  icon={MapPin}
                  label="Location"
                  accent
                  options={[
                    "Any location",
                    "Delhi NCR",
                    "Faridabad",
                    "Gurgaon",
                    "Noida",
                    "Mumbai",
                    "Bangalore",
                  ]}
                />
                <SearchField
                  icon={Briefcase}
                  label="Experience"
                  options={["Any experience", "0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"]}
                />
              </div>

              <Link href="/auth" className="pl-3 shrink-0">
                <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.98] transition-all duration-200 text-white h-[46px] px-6 rounded-xl text-[15px] font-semibold shadow-[0_6px_16px_rgb(217,26,36,0.24)] flex items-center justify-center">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden md:grid grid-cols-3 gap-4 md:gap-8"
          >
            {trustPoints.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-red-50 text-[#c5121c] flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0">
                  <span className="block text-sm font-bold text-gray-900 leading-none mb-1">
                    {title}
                  </span>
                  <span className="block text-xs text-gray-500 leading-snug">{detail}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Floating cards over the desktop image ── */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.3 },
              scale: { duration: 0.5, delay: 0.3 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            className="absolute top-[14%] right-[4%] lg:right-[6%] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] py-3 px-4 border border-white flex items-center gap-3 cursor-pointer pointer-events-auto"
          >
            <span className="w-9 h-9 rounded-xl bg-red-50 text-[#c5121c] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-[18px] h-[18px]" />
            </span>
            <div>
              <span className="text-[13px] font-extrabold text-gray-900 block leading-none mb-1">
                Verified Professionals
              </span>
              <span className="text-[10px] font-medium text-gray-500 block leading-none">
                Certificates &amp; ID checked
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: [0, 8, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.45 },
              scale: { duration: 0.5, delay: 0.45 },
              x: { duration: 0.5, delay: 0.45 },
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            className="absolute bottom-[18%] right-[22%] lg:right-[26%] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] py-3 px-4 flex items-center gap-3 border border-white cursor-pointer group pointer-events-auto"
          >
            <div className="relative w-9 h-9 shrink-0">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-[#c5121c] rounded-full"
              />
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#c5121c] relative z-10">
                <ArrowRight className="w-[18px] h-[18px] -rotate-45" />
              </div>
            </div>
            <div>
              <span className="text-[13px] font-extrabold text-gray-900 block leading-none mb-1">
                Career Growth
              </span>
              <span className="text-[10px] font-medium text-gray-500 block leading-none">
                Reach more gyms &amp; clients
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Single search field inside the desktop search bar ── */
function SearchField({
  icon: Icon,
  label,
  options,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  options: string[];
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 py-1 px-4">
      <span className={`shrink-0 ${accent ? "text-[#c5121c]" : "text-gray-400"}`}>
        <Icon className="w-5 h-5" />
      </span>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[11px] text-gray-400 font-medium leading-none mb-1">{label}</span>
        <div className="relative flex items-center">
          <select
            aria-label={label}
            className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5"
          >
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
