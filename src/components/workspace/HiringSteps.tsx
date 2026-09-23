"use client";

import React from "react";
import { FileText, Search, Handshake } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "Post your vacancy",
    body: "Tell us the role, the experience you want and what you're paying. It takes about a minute.",
  },
  {
    icon: Search,
    title: "We find suitable trainers",
    body: "Our team searches the FitWorks network, checks documents and speaks to each trainer.",
  },
  {
    icon: Handshake,
    title: "Connect & hire",
    body: "We introduce you to the trainers worth meeting and stay with you until the role is filled.",
  },
];

/**
 * The three steps of the FitWorks process.
 *
 * Its real job is to set expectations: a gym owner who posts a vacancy and then
 * sees no applications needs to understand that this is how it is meant to
 * work, and that we are doing the searching.
 */
export default function HiringSteps({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 ${className}`}>
      <div className="mb-6">
        <h2 className="text-[17px] sm:text-[19px] font-extrabold text-gray-900 tracking-[-0.01em]">
          How FitWorks works
        </h2>
        <p className="text-[13px] text-gray-500 mt-1">
          You post the requirement — our team does the hiring legwork.
        </p>
      </div>

      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
        {/* The rule that joins the three steps, desktop only. */}
        <span
          aria-hidden
          className="hidden md:block absolute left-[12%] right-[12%] top-5 h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent"
        />
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="relative flex md:flex-col gap-4 md:gap-0">
            <div className="shrink-0 md:mb-4">
              <span className="relative z-10 w-10 h-10 rounded-xl bg-[#d91a24] text-white flex items-center justify-center ring-4 ring-white">
                <Icon className="w-[18px] h-[18px]" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-1">
                Step {i + 1}
              </p>
              <h3 className="text-[14.5px] font-bold text-gray-900">{title}</h3>
              <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
