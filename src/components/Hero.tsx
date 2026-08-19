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
  Dumbbell,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Decorative red curves — very subtle, behind everything */}
      <div className="absolute top-[5%] right-[8%] w-[500px] h-[500px] rounded-full border border-[#c5121c]/10 pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-5%] w-[650px] h-[650px] rounded-full border border-[#c5121c]/[0.06] pointer-events-none z-0" />

      <div className="relative max-w-[1440px] mx-auto min-h-[600px] flex items-center">
        
        {/* ── Seamless Right Image Background ── */}
        <div className="absolute inset-y-0 right-[-5%] lg:right-[-6.3%] w-full md:w-[65%] z-0 [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_100%)] hidden md:block">
          <Image
            src="/images/hero.png"
            alt="Fitness Trainers"
            fill
            className="object-cover object-[70%_top]"
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
          />
        </div>

        {/* ── Left Content ── */}
        <div className="relative z-10 w-full md:w-[60%] lg:w-[55%] flex flex-col justify-center px-6 md:pl-12 lg:pl-16 py-12 md:py-16">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#c5121c] px-3 py-1 rounded-full text-xs font-semibold mb-5 border border-red-100 w-fit shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>India&apos;s Trusted Fitness Hiring Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] xl:text-[60px] font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-4 max-w-[600px]">
            Find the right{" "}
            <br className="hidden sm:block" />
            <span className="text-[#c5121c]">fitness</span> professional.
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-gray-500 mb-8 max-w-[480px] leading-relaxed">
            Connecting gyms and individuals with verified trainers, coaches and fitness professionals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 sm:mb-10 w-full sm:w-auto">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[46px] px-[26px] rounded-lg text-sm font-semibold shadow-[0_8px_20px_rgb(197,18,28,0.25)] flex items-center justify-center">
                Find a Trainer <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/auth" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-[46px] px-[26px] rounded-lg text-sm font-semibold border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 shadow-sm flex items-center justify-center"
              >
                <Building2 className="w-4 h-4 mr-1.5 text-gray-700" />
                Hire for Your Gym
              </Button>
            </Link>
          </div>

          {/* ── Search Bar: Desktop Layout (Inline 3-column) ── */}
          <div className="hidden md:flex bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-3.5 items-center w-full max-w-[680px] border border-gray-100 mb-10 relative z-20">

            {/* Role */}
            <div className="flex items-center flex-1 min-w-0 px-4 border-r border-gray-100">
              <User className="w-5 h-5 text-[#c5121c] mr-3 shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-gray-400 font-medium leading-none mb-1">I&apos;m looking for</span>
                <div className="relative flex items-center">
                  <select className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5">
                    <option>Select Role</option>
                    <option>Personal Trainer</option>
                    <option>Yoga Instructor</option>
                    <option>Strength Coach</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center flex-1 min-w-0 px-4 border-r border-gray-100">
              <MapPin className="w-5 h-5 text-[#c5121c] mr-3 shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-gray-400 font-medium leading-none mb-1">Location</span>
                <div className="relative flex items-center">
                  <select className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5">
                    <option>Enter location</option>
                    <option>Delhi NCR</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center flex-1 min-w-0 px-4">
              <Briefcase className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-gray-400 font-medium leading-none mb-1">Experience</span>
                <div className="relative flex items-center">
                  <select className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5">
                    <option>Any experience</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Link href="/auth">
              <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[46px] px-[22px] rounded-xl text-base font-semibold ml-2 shrink-0 shadow-sm">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </Link>
          </div>

          {/* ── Search Bar: Mobile Layout (Stacked Card) ── */}
          <div className="flex md:hidden flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-4 border border-gray-100 mb-8 space-y-3.5 w-full relative z-20">
            {/* Role */}
            <div className="flex items-center px-1">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mr-3 shrink-0 text-[#c5121c]">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] text-gray-400 font-medium leading-none mb-1">I&apos;m looking for</span>
                <div className="relative flex items-center">
                  <select className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5">
                    <option>Select Role</option>
                    <option>Personal Trainer</option>
                    <option>Yoga Instructor</option>
                    <option>Strength Coach</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full" />

            {/* Location */}
            <div className="flex items-center px-1">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mr-3 shrink-0 text-[#c5121c]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] text-gray-400 font-medium leading-none mb-1">Location</span>
                <div className="relative flex items-center">
                  <select className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5">
                    <option>Enter location</option>
                    <option>Delhi NCR</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full" />

            {/* Experience */}
            <div className="flex items-center px-1">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mr-3 shrink-0 text-gray-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[11px] text-gray-400 font-medium leading-none mb-1">Experience</span>
                <div className="relative flex items-center">
                  <select className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none appearance-none cursor-pointer truncate pr-5">
                    <option>Any experience</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <Link href="/auth" className="w-full pt-1">
              <Button className="w-full bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.98] transition-all duration-200 text-white h-[46px] rounded-xl text-sm font-semibold shadow-[0_4px_14px_rgb(217,26,36,0.25)] flex items-center justify-center">
                <Search className="w-4 h-4 mr-2" />
                Search Professionals
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:items-center justify-start gap-4 sm:gap-6 md:gap-10 w-full pt-2">
            <div className="flex items-center gap-2.5 bg-gray-50/70 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-gray-100/80 md:border-none">
              <ShieldCheck className="w-6 h-6 text-[#c5121c] shrink-0" />
              <div>
                <span className="text-sm font-bold text-gray-900 leading-none block mb-1">100% Verified</span>
                <span className="text-xs text-gray-500">Manually checked profiles</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-gray-50/70 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-gray-100/80 md:border-none">
              <Star className="w-6 h-6 text-[#c5121c] shrink-0" />
              <div>
                <span className="text-sm font-bold text-gray-900 leading-none block mb-1">Top Talent</span>
                <span className="text-xs text-gray-500">Handpicked professionals</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-gray-50/70 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-gray-100/80 md:border-none">
              <Users className="w-6 h-6 text-[#c5121c] shrink-0" />
              <div>
                <span className="text-sm font-bold text-gray-900 leading-none block mb-1">Smart Hiring</span>
                <span className="text-xs text-gray-500">Find professionals that fit your needs</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Floating Cards ── */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-10">
          <div className="relative w-full h-full max-w-[1440px] mx-auto">
            {/* "Verified Professionals" floating card — upper right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="absolute top-[18%] right-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2.5 px-4 z-[20] min-w-[200px] border border-white cursor-pointer pointer-events-auto"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5121c] shrink-0" />
                <div>
                  <span className="text-xs font-extrabold text-gray-900 block leading-none mb-0.5">Verified Professionals</span>
                  <span className="text-[9px] font-medium text-gray-500 block">Top 5% talent</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex -space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm relative z-[5]">
                    <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="Avatar" width={28} height={28} className="object-cover h-full" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm relative z-[4]">
                    <Image src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop" alt="Avatar" width={28} height={28} className="object-cover h-full" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm relative z-[3]">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Avatar" width={28} height={28} className="object-cover h-full" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm relative z-[2]">
                    <Image src="https://images.unsplash.com/photo-1699899657680-421c2c2d5064?q=80&w=100&auto=format&fit=crop" alt="Avatar" width={28} height={28} className="object-cover h-full" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm relative z-[1]">
                    <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="Avatar" width={28} height={28} className="object-cover h-full" />
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#c5121c] border-2 border-white flex items-center justify-center text-[8px] font-bold text-white -ml-2 shadow-sm relative z-10">
                  +2K
                </div>
              </div>
            </motion.div>

            {/* "For Trainers" floating card — lower right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: [0, 8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.4 },
                scale: { duration: 0.5, delay: 0.4 },
                x: { duration: 0.5, delay: 0.4 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="absolute bottom-[22%] right-[20%] lg:right-[26%] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2.5 px-3.5 z-[20] flex items-center gap-3 min-w-[180px] border border-white cursor-pointer group pointer-events-auto"
            >
              <div className="relative w-8 h-8 shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 bg-[#c5121c] rounded-full group-hover:opacity-40"
                />
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#c5121c] relative z-10">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </div>
              </div>
              <div>
                <span className="text-xs font-extrabold text-gray-900 block leading-none mb-1">Career Growth</span>
                <span className="text-[10px] font-medium text-gray-500 block leading-tight">Reach more clients</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
