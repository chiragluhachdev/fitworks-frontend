"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('/images/auth_hero.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-[#c5121c]/40" />
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Abstract glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d91a24] rounded-full mix-blend-screen filter blur-[128px] opacity-30" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#c5121c] rounded-full mix-blend-screen filter blur-[128px] opacity-30" />

          {/* Content Container */}
          <div className="relative z-10 px-8 py-16 md:p-20 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                <Zap className="w-4 h-4 text-[#d91a24]" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">Start Growing Today</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
                Ready to elevate your <br className="hidden lg:block" />
                <span className="text-[#d91a24]">fitness journey?</span>
              </h2>
              
              <p className="text-gray-300 text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join India's fastest-growing network of verified fitness professionals. Whether you are a gym owner looking for top talent or a trainer seeking premium clients, FitWorks is your ultimate platform.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 mb-10 lg:mb-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-base sm:text-lg leading-none">100%</div>
                    <div className="text-gray-400 text-[11px] sm:text-xs mt-1">Verified Profiles</div>
                  </div>
                </div>
                <div className="w-[1px] h-8 sm:h-10 bg-white/10 shrink-0" />
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-base sm:text-lg leading-none">Zero</div>
                    <div className="text-gray-400 text-[11px] sm:text-xs mt-1">Hidden Fees</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content / Buttons Box */}
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Choose your path</h3>
                <p className="text-sm text-gray-400 mb-8 relative z-10">Create an account in less than 2 minutes.</p>
                
                <div className="flex flex-col gap-4 relative z-10">
                  <Link href="/auth" className="w-full">
                    <Button className="w-full bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.98] transition-all duration-200 text-white h-14 rounded-xl text-[15px] font-bold shadow-[0_8px_20px_rgb(217,26,36,0.3)] flex justify-between px-6 group border-0">
                      I'm a Gym Owner
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link href="/auth" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white hover:text-white h-14 rounded-xl text-[15px] font-bold transition-all duration-200 flex justify-between px-6 group backdrop-blur-sm"
                    >
                      I'm a Trainer
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 text-center relative z-10">
                  <p className="text-xs text-gray-400">
                    By joining, you agree to our <Link href="/about#terms" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white underline decoration-gray-500 underline-offset-2">Terms</Link> & <Link href="/about#privacy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white underline decoration-gray-500 underline-offset-2">Privacy</Link>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
