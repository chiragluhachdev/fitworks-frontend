"use client";

import React from "react";

const partnerGymLogos = [
  { name: "HOPE GYM & SPA", tag: "FITNESS & WELLNESS" },
  { name: "ANYDAY FITNESS", tag: "24/7 STRENGTH CLUB" },
  { name: "HOPE GYM & SPA", tag: "FITNESS & WELLNESS" },
  { name: "ANYDAY FITNESS", tag: "24/7 STRENGTH CLUB" },
  { name: "HOPE GYM & SPA", tag: "FITNESS & WELLNESS" },
  { name: "ANYDAY FITNESS", tag: "24/7 STRENGTH CLUB" },
  { name: "HOPE GYM & SPA", tag: "FITNESS & WELLNESS" },
  { name: "ANYDAY FITNESS", tag: "24/7 STRENGTH CLUB" },
];

export default function TrustedBy() {
  return (
    <section className="w-full bg-[#f8f9fa] py-8 my-4 overflow-hidden border-y border-gray-100">
      <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.22em] text-center mb-5">
        Trusted by Premier Gyms &amp; Fitness Clubs
      </p>

      {/* Infinite scroll marquee */}
      <div className="relative w-full flex items-center">
        {/* Left & right fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee items-center">
          {partnerGymLogos.map((gym, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 mx-8 md:mx-12 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#d91a24] shrink-0" />
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 uppercase">
                {gym.name}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-0.5 bg-gray-200/70 rounded-md">
                {gym.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
