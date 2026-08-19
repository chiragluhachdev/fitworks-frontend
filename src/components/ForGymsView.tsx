"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  ClipboardEdit,
  MessageSquare,
  Building2,
  Clock,
  Wallet,
  PlayCircle,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Trophy,
  ChevronRight,
  Dumbbell,
  Target,
} from "lucide-react";

export default function ForGymsView() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative w-full pt-4 md:pt-6">
        <div className="relative max-w-[1440px] mx-auto min-h-[540px] flex items-center">
          
          {/* Right Side: Dark Gym Interior Image with Angled Cutout & Red Accent Stripe */}
          <div className="absolute inset-y-0 right-0 w-full md:w-[56%] lg:w-[52%] z-0 hidden md:block overflow-hidden">
            {/* Red Diagonal Accent Ribbon */}
            <div 
              className="absolute inset-y-0 left-0 w-6 lg:w-7 bg-[#d91a24] z-10 hidden md:block"
              style={{
                clipPath: "polygon(100% 0, 0 100%, 0 0)",
              }}
            />
            
            {/* Dark Gym Image Container */}
            <div 
              className="relative w-full h-full"
              style={{
                clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <Image
                src="/images/gym_hero_bg.jpg"
                alt="Modern Gym Interior"
                fill
                className="object-cover object-center brightness-[1.08] contrast-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-black/20" />

              {/* Top Right Floating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 },
                  scale: { duration: 0.5, delay: 0.2 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                }}
                className="absolute top-[14%] right-[5%] lg:right-[7%] bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] py-2 px-3.5 z-20 min-w-[205px] border border-white"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0 border border-red-100/60">
                      <Building2 className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-none">850+</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-none">Gyms Across India</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 pt-1 border-t border-gray-100/80">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0 border border-red-100/60">
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-none">3,200+</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-none">Trainers Verified</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Left Floating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: [0, 4, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.4 },
                  scale: { duration: 0.5, delay: 0.4 },
                  x: { duration: 0.5, delay: 0.4 },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                }}
                className="absolute bottom-[14%] left-[10%] lg:left-[12%] bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] py-2 px-3.5 z-20 min-w-[205px] border border-white"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0 border border-red-100/60">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-none">12K+</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-none">Successful Hires</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 pt-1 border-t border-gray-100/80">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-[#d91a24] flex items-center justify-center shrink-0 border border-red-100/60">
                      <Star className="w-3 h-3 fill-[#d91a24]" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[12px] font-extrabold text-gray-900 leading-none">4.8/5</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-none">Gym Satisfaction</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full md:w-[54%] lg:w-[50%] flex flex-col justify-center px-6 md:pl-12 lg:pl-16 py-8 md:py-12">
            
            {/* Decorative Dot Matrix in top right of content */}
            <div className="hidden lg:grid grid-cols-4 gap-1.5 absolute top-6 right-8 opacity-25 select-none pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
              ))}
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="w-4 h-4 text-[#d91a24] -rotate-45" />
              <p className="text-[12px] font-bold text-[#d91a24] uppercase tracking-[0.16em]">
                For Gym Owners & Managers
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-[40px] md:text-[50px] lg:text-[56px] xl:text-[62px] font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-4 max-w-[580px]">
              Find the right people. <br />
              Build a <span className="text-[#d91a24]">stronger gym.</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-base lg:text-[17px] text-gray-500 mb-7 max-w-[480px] leading-relaxed">
              We help gyms hire verified fitness professionals who bring results, motivation and growth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-9">
              <Link href="/auth">
                <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[46px] px-[26px] rounded-xl text-[15px] font-semibold shadow-[0_8px_20px_rgb(217,26,36,0.25)] w-full sm:w-auto">
                  <Users className="w-4 h-4 mr-2" />
                  Find a Trainer for Your Gym <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="h-[46px] px-[24px] rounded-xl text-[15px] font-semibold border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 shadow-xs w-full sm:w-auto"
                >
                  <PlayCircle className="w-4 h-4 mr-1.5 text-gray-700" />
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Feature 4-Item Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-5 max-w-[680px]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d91a24]" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Trusted Professionals</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">100% verified profiles you can rely on.</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <Target className="w-3.5 h-3.5 text-[#d91a24]" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Better Matches</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">We match trainers who fit your gym&apos;s needs.</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <Clock className="w-3.5 h-3.5 text-[#d91a24]" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Save Time</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">No endless search. We do the heavy lifting.</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <Wallet className="w-3.5 h-3.5 text-[#d91a24]" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 leading-none">Hassle Free Hiring</span>
                </div>
                <span className="text-[11px] text-gray-500 leading-tight">Transparent process. No upfront payments.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Gym Image */}
      <div className="block md:hidden relative w-full h-[320px] mt-4">
        <Image
          src="/images/gym_hero_bg.jpg"
          alt="Gym Interior"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* ── DARK TRUST / QUALITY BANNER (UNIQUE TO FOR GYMS) ── */}
      <section className="max-w-[1360px] mx-auto px-6 mt-6 md:mt-10 mb-8 md:mb-12">
        <div className="bg-[#0b1320] text-white rounded-2xl py-6 px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 border border-gray-800 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-white mb-0.5">Quality You Can Trust</h4>
              <p className="text-[12px] text-gray-400 leading-relaxed">
                Every trainer goes through a strict verification and screening process.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-l md:border-white/10 md:pl-8">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-white mb-0.5">Results That Matter</h4>
              <p className="text-[12px] text-gray-400 leading-relaxed">
                Hire professionals who help your members achieve more and stay longer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-l md:border-white/10 md:pl-8">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-white mb-0.5">Your Growth Partner</h4>
              <p className="text-[12px] text-gray-400 leading-relaxed">
                We&apos;re here to help you build a team that grows your gym.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEPS SECTION ── */}
      <section className="max-w-[1360px] mx-auto px-6 pt-2 pb-8 md:pb-12">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-xs font-bold text-[#d91a24] uppercase tracking-[0.16em] mb-2">
            How It Works
          </p>
          <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight">
            Hire in <span className="text-[#d91a24]">4</span> simple steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-start">
          {/* Steps with connected dashed arrow line */}
          {[
            {
              step: "1",
              title: "Tell Us What You Need",
              desc: "Share your gym details and the type of trainer you're looking for.",
              icon: ClipboardEdit,
            },
            {
              step: "2",
              title: "We Find the Right Matches",
              desc: "Our team finds and shortlists verified trainers that fit your requirements.",
              icon: Search,
            },
            {
              step: "3",
              title: "We Coordinate",
              desc: "We connect with you, share profiles and help you evaluate the best fit.",
              icon: MessageSquare,
            },
            {
              step: "4",
              title: "Hire with Confidence",
              desc: "Select the right trainer and build your winning team.",
              icon: ShieldCheck,
            },
          ].map((s, i) => (
            <div key={i} className="flex items-start">
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left group">
                <div className="relative mb-3">
                  <div className="w-[68px] h-[68px] rounded-full bg-red-50/60 border border-red-100 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                    <s.icon className="w-6 h-6 text-[#d91a24]" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#d91a24] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-1 group-hover:text-[#d91a24] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[240px]">
                  {s.desc}
                </p>
              </div>

              {/* Arrow Connector (between steps) */}
              {i < 3 && (
                <div className="hidden lg:flex items-center justify-center pt-6 px-1 text-gray-300">
                  <div className="w-12 h-[1px] border-t border-dashed border-gray-300 relative">
                    <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-300" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA SECTION (3-COLUMN DETAILED CARD) ── */}
      <section className="max-w-[1360px] mx-auto px-6 pb-10 md:pb-12">
        <div className="bg-[#faf7f7] border border-red-100/70 rounded-[2rem] p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d91a24] text-white flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl md:text-[22px] font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">
                Ready to build <br className="hidden sm:block" />
                your dream team?
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Get started now and let us find the perfect fitness professionals for your gym.
              </p>
            </div>
          </div>

          {/* Middle Column: Checklist */}
          <div className="lg:col-span-4 lg:border-l lg:border-red-100/80 lg:pl-8">
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              What you get with FitWorks
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                "Access to verified & experienced trainers",
                "Role-based matching for your gym needs",
                "End-to-end support until you hire",
                "No hidden charges",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs md:text-[13px] text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-[#d91a24] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Team Graphic & Button */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-3">
            <div className="relative w-full max-w-[240px] h-20 overflow-hidden rounded-lg">
              <Image
                src="/images/gym_team.jpg"
                alt="FitWorks Coaches Team"
                fill
                className="object-contain object-center"
              />
            </div>
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white h-[44px] px-[22px] rounded-xl text-[14px] font-semibold shadow-md w-full sm:w-auto">
              Find a Trainer for Your Gym <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Link
              href="#how-it-works"
              className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center transition-colors"
            >
              Learn more about our process <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
