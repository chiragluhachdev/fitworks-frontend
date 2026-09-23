"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type Accent = "brand" | "blue" | "amber" | "emerald" | "slate";

/**
 * Each tile takes one colour and spends it three ways — the icon chip, the
 * glow that warms its corner on hover, and the ring. Nothing else on the card
 * is coloured, so a row of them reads as one set.
 */
const ACCENTS: Record<Accent, { chip: string; glow: string; ring: string }> = {
  brand: { chip: "bg-brand-tint text-brand", glow: "bg-brand", ring: "group-hover:ring-red-200/80" },
  blue: { chip: "bg-blue-50 text-blue-600", glow: "bg-blue-500", ring: "group-hover:ring-blue-200/80" },
  amber: { chip: "bg-amber-50 text-amber-600", glow: "bg-amber-500", ring: "group-hover:ring-amber-200/80" },
  emerald: {
    chip: "bg-emerald-50 text-emerald-600",
    glow: "bg-emerald-500",
    ring: "group-hover:ring-emerald-200/80",
  },
  slate: { chip: "bg-gray-100 text-gray-600", glow: "bg-gray-500", ring: "group-hover:ring-gray-300" },
};

/**
 * One figure and what it means.
 *
 * The figure sits top-right and the chevron bottom-right. They shared the
 * top-right corner once, where a status like "Inactive" ran into the arrow.
 */
export default function Stat({
  label,
  value,
  hint,
  icon: Icon,
  accent = "slate",
  href,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  accent?: Accent;
  href?: string;
}) {
  const a = ACCENTS[accent];

  const body = (
    <>
      <span
        aria-hidden
        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none ${a.glow}`}
      />

      <div className="relative flex items-start justify-between gap-2.5">
        {Icon && (
          <span
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${a.chip}`}
          >
            <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
          </span>
        )}
        <span className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 leading-none tracking-[-0.02em] tabular-nums text-right shrink-0 pt-1">
          {value}
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-2.5 mt-3.5">
        <div className="min-w-0">
          <p className="text-[12.5px] sm:text-[13.5px] font-bold text-gray-900 leading-tight">{label}</p>
          {hint && (
            <p className="text-[11px] sm:text-[11.5px] text-gray-500 mt-1 leading-snug line-clamp-2">
              {hint}
            </p>
          )}
        </div>
        {href && (
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
        )}
      </div>
    </>
  );

  const base = `group relative overflow-hidden bg-white rounded-[20px] p-4 sm:p-5 ring-1 ring-gray-200/70 ${a.ring}
    min-h-[132px] sm:min-h-[148px] flex flex-col justify-between
    shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} hover:shadow-[0_16px_34px_-14px_rgba(16,24,40,0.22)] hover:-translate-y-0.5 active:translate-y-0`}
      >
        {body}
      </Link>
    );
  }
  return <div className={base}>{body}</div>;
}
