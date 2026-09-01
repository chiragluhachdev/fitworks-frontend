"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="w-full py-14 sm:py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="relative rounded-3xl md:rounded-[2rem] overflow-hidden bg-gray-900 shadow-[0_24px_70px_rgb(0,0,0,0.18)]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[url('/images/auth_hero.jpg')] bg-cover bg-center opacity-25 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-gray-900 via-gray-900/95 to-[#c5121c]/40" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#d91a24] rounded-full mix-blend-screen blur-[110px] opacity-30 pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#c5121c] rounded-full mix-blend-screen blur-[110px] opacity-30 pointer-events-none" />

          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-14 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left w-full">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-5">
                <Zap className="w-3.5 h-3.5 text-[#ff5a63]" />
                <span className="text-[11px] font-bold text-white tracking-widest uppercase">
                  Start Growing Today
                </span>
              </div>

              <h2 className="text-[27px] leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.02em] mb-4 sm:mb-5">
                Ready to elevate your{" "}
                <br className="hidden lg:block" />
                <span className="text-[#ff5a63]">fitness journey?</span>
              </h2>

              <p className="text-gray-300 text-[15px] sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join India&apos;s growing network of verified fitness
                professionals. Whether you run a gym looking for reliable talent
                or you&apos;re a trainer after your next opportunity, FitWorks is
                built for you.
              </p>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-5 sm:gap-8">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </span>
                  <div className="text-left">
                    <div className="text-white font-bold text-base sm:text-lg leading-none">100%</div>
                    <div className="text-gray-400 text-[11px] sm:text-xs mt-1">Verified profiles</div>
                  </div>
                </div>
                <span className="w-px h-10 bg-white/10 shrink-0" />
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </span>
                  <div className="text-left">
                    <div className="text-white font-bold text-base sm:text-lg leading-none">Zero</div>
                    <div className="text-gray-400 text-[11px] sm:text-xs mt-1">Agent commissions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — choice card */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 relative z-10">
                  Choose your path
                </h3>
                <p className="text-[13px] sm:text-sm text-gray-400 mb-6 sm:mb-8 relative z-10">
                  Create an account in less than 2 minutes.
                </p>

                <div className="flex flex-col gap-3 relative z-10">
                  <Link href="/auth" className="w-full">
                    <Button className="w-full bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.98] transition-all duration-200 text-white h-[54px] rounded-xl text-[15px] font-bold shadow-[0_8px_20px_rgb(217,26,36,0.3)] flex justify-between items-center px-5 group border-0">
                      I&apos;m a Gym Owner
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link href="/auth" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white hover:text-white h-[54px] rounded-xl text-[15px] font-bold transition-all duration-200 flex justify-between items-center px-5 group backdrop-blur-sm"
                    >
                      I&apos;m a Trainer
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <p className="mt-5 text-center text-[11px] text-gray-400 relative z-10 leading-relaxed">
                  By joining, you agree to our{" "}
                  <Link
                    href="/about#terms"
                    className="text-gray-300 hover:text-white underline decoration-gray-500 underline-offset-2"
                  >
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link
                    href="/about#privacy"
                    className="text-gray-300 hover:text-white underline decoration-gray-500 underline-offset-2"
                  >
                    Privacy
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
