"use client";

import { ArrowRight } from "lucide-react";
import TrainerCard from "@/components/TrainerCard";
import { trainers } from "@/data/trainers";
import Link from "next/link";

export default function TrainerShowcase() {
  // Duplicate trainers for infinite scroll effect
  const marqueeTrainers = [...trainers, ...trainers];

  return (
    <section className="w-full py-16 bg-[#fafafa] overflow-hidden" id="trainers-preview">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8 mb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#c5121c] uppercase tracking-[0.2em] mb-2">
              Featured Trainers
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Top verified trainers ready to hire
            </h2>
            <p className="text-gray-500 text-base max-w-lg">
              Discover qualified and experienced fitness professionals across India.
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-sm font-bold bg-[#d91a24] text-white hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 px-[22px] py-[9px] rounded-full shadow-md shadow-red-500/20 shrink-0 group"
          >
            Explore all trainers
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Infinite scrolling trainer cards */}
      <div className="relative w-full">
        {/* Left/Right fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />

        {/* Marquee container 1 */}
        <div className="flex w-max animate-[marquee_40s_linear_infinite] py-4">
          {marqueeTrainers.map((trainer, idx) => (
            <div key={`${trainer.id}-row1-${idx}`} className="w-[280px] md:w-[320px] shrink-0 mx-3">
              <TrainerCard trainer={trainer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
