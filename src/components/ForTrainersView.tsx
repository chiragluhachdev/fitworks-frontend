"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  UserCircle,
  MessageSquare,
  TrendingUp,
  Target,
  Rocket,
  Clock,
} from "lucide-react";

export default function ForTrainersView() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative w-full pt-4 md:pt-6">
        <div className="relative max-w-[1440px] mx-auto min-h-[460px] flex items-center">
          {/* Seamless Right Image Background */}
          <div className="absolute inset-y-0 right-[-5%] lg:right-[-.3%] w-full md:w-[63%] z-0 [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_100%)] hidden md:block">
            <Image
              src="/images/trainer_hero.jpg"
              alt="Fitness Trainer"
              fill
              className="object-cover object-[center_top]"
              priority
              sizes="(max-width: 768px) 100vw, 65vw"
            />
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full md:w-[60%] lg:w-[50%] flex flex-col justify-center px-6 md:pl-12 lg:pl-16 py-8 md:py-10">
            <p className="text-[12px] font-bold text-[#d91a24] uppercase tracking-[0.15em] mb-3">
              For Fitness Professionals
            </p>
            <h1 className="text-[38px] md:text-[50px] lg:text-[56px] xl:text-[60px] font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-4 max-w-[600px]">
              Find the right <br className="hidden sm:block" />
              opportunities. <br className="hidden sm:block" />
              <span className="text-[#d91a24]">Grow</span> your career.
            </h1>
            <p className="text-base lg:text-[17px] text-gray-500 mb-7 max-w-[480px] leading-relaxed">
              Join India&apos;s trusted platform for fitness professionals.
              <br className="hidden sm:block" />
              Get discovered by top gyms and studios that value your skills.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              <Link href="/auth">
                <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[46px] px-[26px] rounded-lg text-[15px] font-semibold shadow-[0_8px_20px_rgb(217,26,36,0.25)] w-full sm:w-auto">
                  Create Your Profile <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="h-[46px] px-[26px] rounded-lg text-[15px] font-semibold border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 shadow-xs w-full sm:w-auto"
                >
                  <Search className="w-4 h-4 mr-1.5 text-gray-700" />
                  Browse Vacancies
                </Button>
              </Link>
            </div>

            {/* Feature Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 max-w-[600px]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d91a24] shrink-0" />
                  <span className="text-[13px] font-bold text-gray-900 leading-none">100% Free</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">No registration fee</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#d91a24] shrink-0" />
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Verified Gyms</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">Work with trusted gyms</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d91a24] shrink-0" />
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Better Opportunities</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">Find roles that fit you</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#d91a24] shrink-0" />
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Career Growth</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">Build. Learn. Grow.</span>
              </div>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-10">
            <div className="relative w-full h-full max-w-[1440px] mx-auto">
              {/* Top Right Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 },
                  scale: { duration: 0.5, delay: 0.2 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                }}
                className="absolute top-[12%] right-[10%] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-3 px-4 z-[20] min-w-[200px] border border-white pointer-events-auto"
              >
                <span className="text-sm font-extrabold text-gray-900 block leading-none mb-1">850+ Gyms</span>
                <span className="text-[11px] font-medium text-gray-500 block mb-3">Looking for trainers like you</span>
                <div className="flex items-center">
                  <div className="flex -space-x-2.5">
                    {[
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?q=80&w=100&auto=format&fit=crop",
                    ].map((src, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm relative" style={{ zIndex: 10 - i }}>
                        <Image src={src} alt="Avatar" width={32} height={32} className="object-cover h-full" />
                      </div>
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#d91a24] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white -ml-2 shadow-sm relative z-[11]">
                    +850
                  </div>
                </div>
              </motion.div>

              {/* Bottom Left Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: [0, 6, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.4 },
                  scale: { duration: 0.5, delay: 0.4 },
                  x: { duration: 0.5, delay: 0.4 },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                }}
                className="absolute bottom-[16%] left-[55%] lg:left-[53%] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3.5 z-[20] flex items-center gap-3 min-w-[220px] border border-white pointer-events-auto"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-gray-900 block leading-none mb-1">Level Up Your Career</span>
                  <span className="text-[11px] font-medium text-gray-500 block leading-tight">New opportunities every day</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile hero image */}
      <div className="block md:hidden relative w-full h-[360px] mt-2">
        <Image
          src="/images/trainer_hero.jpg"
          alt="Fitness Trainer"
          fill
          className="object-cover object-[center_20%]"
          priority
          sizes="100vw"
        />
      </div>

      {/* ── STEPS SECTION ── */}
      <section className="max-w-[1360px] mx-auto px-6 pt-3 md:pt-5 pb-8 md:pb-10">
        <div className="text-center mb-4 md:mb-5">
          <h2 className="text-base md:text-lg font-bold uppercase tracking-[0.08em] text-gray-900">
            Get Hired in <span className="text-[#d91a24]">4</span> Simple Steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[36px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-red-100 z-0" />

          {/* Steps */}
          {[
            {
              step: "01",
              title: "Create Profile",
              desc: "Build your profile, add your skills, experience & certifications.",
              icon: UserCircle,
            },
            {
              step: "02",
              title: "Get Discovered",
              desc: "Gyms and studios find and view your profile based on their needs.",
              icon: Search,
            },
            {
              step: "03",
              title: "Connect",
              desc: "Interested gyms reach out to you for the right opportunities.",
              icon: MessageSquare,
            },
            {
              step: "04",
              title: "Grow Career",
              desc: "Get hired, grow your network and build a successful career.",
              icon: TrendingUp,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="relative z-10 bg-white hover:bg-red-50/20 rounded-2xl p-4 lg:p-5 border border-gray-100 hover:border-red-100 hover:shadow-md transition-all duration-200 flex flex-col items-center lg:items-start text-center lg:text-left group"
            >
              <div className="relative mb-3">
                <div className="w-[68px] h-[68px] rounded-full bg-white border-2 border-red-100 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-[#d91a24]/40 transition-all duration-300">
                  <div className="w-[50px] h-[50px] rounded-full bg-red-50 flex items-center justify-center">
                    <s.icon className="w-6 h-6 text-[#d91a24]" />
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 bg-[#d91a24] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                  {s.step}
                </span>
              </div>
              <h3 className="text-base md:text-[17px] font-bold text-gray-900 mb-1 group-hover:text-[#d91a24] transition-colors">
                {s.title}
              </h3>
              <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed max-w-[280px]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="max-w-[1360px] mx-auto px-6 pb-8 md:pb-10">
        <div className="bg-red-50/80 rounded-[1.75rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-red-100/50">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
              <Rocket className="w-7 h-7 md:w-8 md:h-8 text-[#d91a24] -rotate-12" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                Be visible. Get hired. Grow together.
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Thousands of trainers are already finding better opportunities with FitWorks.
              </p>
            </div>
          </div>
          <Link href="/auth">
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[44px] md:h-[46px] px-[24px] rounded-xl text-[14px] md:text-[15px] font-semibold shadow-md shrink-0">
              Create Your Profile <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
