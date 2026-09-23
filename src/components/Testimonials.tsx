"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];
  const hasMultiple = testimonials.length > 1;

  const go = (delta: number) =>
    setActiveIndex((prev) => (prev + delta + testimonials.length) % testimonials.length);

  return (
    <section className="w-full py-14 sm:py-16 md:py-20 bg-[#fafafa]" id="testimonials">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[11px] sm:text-xs font-bold text-[#c5121c] uppercase tracking-[0.2em] mb-2.5">
            Testimonials
          </p>
          <h2 className="text-[27px] leading-[1.15] sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-[-0.02em]">
            Trusted by gyms. Loved by trainers.
          </h2>
        </div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.05)] border border-gray-100 p-6 sm:p-10 md:p-14 overflow-hidden">
          <Quote
            size={110}
            aria-hidden="true"
            className="absolute -top-2 right-4 sm:top-6 sm:right-8 text-gray-50 rotate-180 pointer-events-none"
          />

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5 sm:mb-6">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[17px] leading-[1.6] sm:text-xl md:text-2xl sm:leading-relaxed font-medium text-gray-800 mb-8 sm:mb-10 max-w-3xl text-balance">
                &ldquo;{active.quote}&rdquo;
              </p>

              {/* Author */}
              <footer className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <span className="text-lg sm:text-xl font-extrabold text-[#c5121c] tracking-tight">
                    {active.initials}
                  </span>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{active.name}</p>
                  <p className="text-[13px] sm:text-sm font-medium text-[#c5121c]">
                    {active.role}{" "}
                    <span className="text-gray-400 font-normal">at</span>{" "}
                    {active.organization}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* Desktop arrows — vertically centred, out of the text's way */}
          {hasMultiple && (
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between px-5 pointer-events-none">
              <NavButton direction="prev" onClick={() => go(-1)} />
              <NavButton direction="next" onClick={() => go(1)} />
            </div>
          )}
        </div>

        {/* Mobile controls — below the card, never overlapping copy */}
        {hasMultiple && (
          <div className="flex md:hidden items-center justify-center gap-4 mt-6">
            <NavButton direction="prev" onClick={() => go(-1)} />
            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-6 bg-[#E92E3D]" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <NavButton direction="next" onClick={() => go(1)} />
          </div>
        )}
      </div>
    </section>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
      className="pointer-events-auto w-11 h-11 md:w-12 md:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#c5121c] hover:border-red-100 hover:shadow-md active:scale-95 transition-all shrink-0"
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}
