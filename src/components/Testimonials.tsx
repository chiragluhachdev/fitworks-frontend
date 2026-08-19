"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="w-full py-20 bg-[#fafafa]" id="testimonials">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#c5121c] uppercase tracking-[0.2em] mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Trusted by gyms. Loved by trainers.
          </h2>
        </div>

        {/* Single Large Testimonial Card */}
        <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-14 overflow-hidden">
          
          {/* Decorative Quote Icon Background */}
          <div className="absolute top-6 right-8 text-gray-50 opacity-50 pointer-events-none">
            <Quote size={120} className="rotate-180" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="flex flex-col items-center text-center">
                
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-10 max-w-3xl">
                  &ldquo;{testimonials[activeIndex].quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shadow-inner">
                    <Image
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{testimonials[activeIndex].name}</p>
                    <p className="text-sm font-medium text-[#c5121c]">
                      {testimonials[activeIndex].role} <span className="text-gray-400 font-normal">at</span> {testimonials[activeIndex].organization}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls inside Card */}
          <div className="absolute bottom-6 md:top-1/2 md:-translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-6 pointer-events-none">
            <button
              onClick={prevTestimonial}
              className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#c5121c] hover:border-red-100 hover:shadow-md transition-all z-20"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#c5121c] hover:border-red-100 hover:shadow-md transition-all z-20"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          
        </div>

      </div>
    </section>
  );
}
