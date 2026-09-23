"use client";

import React from "react";

const partnerGyms = [
  { name: "HOPE GYM & SPA", tag: "Fitness & Wellness" },
  { name: "ANYDAY FITNESS", tag: "24/7 Strength Club" },
];

/** Repeated so the marquee track can loop seamlessly at -50%. */
const track = [...partnerGyms, ...partnerGyms, ...partnerGyms, ...partnerGyms];

export default function TrustedBy() {
  return (
    <section className="w-full bg-[#f8f9fa] py-7 sm:py-9 overflow-hidden border-y border-gray-100">
      <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] text-center mb-5 px-5">
        Trusted by premier gyms &amp; fitness clubs
      </p>

      <div className="relative w-full flex items-center">
        {/* Fade edges */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
          {track.concat(track).map((gym, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 sm:gap-3.5 mx-6 sm:mx-10 md:mx-12 shrink-0 opacity-75 hover:opacity-100 transition-opacity"
            >
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E92E3D] shrink-0" />
              <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-gray-900 uppercase whitespace-nowrap">
                {gym.name}
              </span>
              <span className="hidden sm:inline text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-0.5 bg-gray-200/70 rounded-md whitespace-nowrap">
                {gym.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
