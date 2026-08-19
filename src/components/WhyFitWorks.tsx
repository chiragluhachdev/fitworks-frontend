"use client";

import { ShieldCheck, Globe, Zap, TrendingUp, CheckCircle2, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    description: "Every profile undergoes a rigorous review process, ensuring you only connect with qualified, professional talent.",
  },
  {
    icon: Globe,
    title: "Nationwide Network",
    description: "Gain instant access to top-tier trainers, elite gyms, and specialized fitness professionals across India.",
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description: "Our optimized algorithms help you find the perfect match in minutes, eliminating endless scrolling and wasted time.",
  },
  {
    icon: TrendingUp,
    title: "Better Outcomes",
    description: "Whether hiring for your business or advancing your career, we provide the tools needed to build stronger fitness journeys.",
  },
];

export default function WhyFitWorks() {
  return (
    <section className="w-full py-16 bg-[#fafafa] relative overflow-hidden" id="why-fitworks">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50/50 rounded-full blur-[120px] -z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-[1380px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-stretch">

          {/* Left — Engaging Visuals */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-full flex flex-col"
          >
            {/* Main Image Container */}
            <div className="relative rounded-[2rem] overflow-hidden h-[450px] lg:h-full lg:min-h-full shadow-2xl shadow-gray-200 border-4 border-white">
              <Image
                src="/images/hero.png"
                alt="Why Choose FitWorks"
                fill
                className="object-cover object-[center_30%] hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
              
              {/* Bottom Text in Image */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-lg font-bold leading-snug">
                  "FitWorks completely transformed how we build our coaching team."
                </p>
                <div className="flex items-center gap-2 mt-3 text-red-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>

            {/* Floating Stat Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -right-6 lg:-right-8 top-12 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-100 hidden sm:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900 leading-none mb-0.5">100%</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Quality Guaranteed</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Stat Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -left-6 lg:-left-8 bottom-24 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-100 hidden sm:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#d91a24]" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900 leading-none mb-0.5">10K+</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Successful Matches</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Content */}
          <div className="flex flex-col justify-center py-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6">
                <Zap className="w-4 h-4 text-[#d91a24]" />
                <span className="text-xs font-bold text-[#d91a24] uppercase tracking-widest">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-[1.15] mb-6">
                Built for <span className="text-[#d91a24]">trust.</span>{" "}
                <br className="hidden sm:block" />
                Designed for <span className="text-[#d91a24]">results.</span>
              </h2>
              <p className="text-base text-gray-500 mb-10 max-w-lg leading-relaxed">
                FitWorks is more than just a listing platform. We are India's most secure and optimized ecosystem where trainers are rigorously verified, and connections are built around genuine, long-term fitness opportunities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-red-100 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-[#d91a24]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#d91a24] transition-colors">{feature.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed pr-4">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
