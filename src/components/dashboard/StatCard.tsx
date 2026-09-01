"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Tailwind text + bg pair for the icon chip. */
  tone?: "red" | "blue" | "purple" | "amber" | "green" | "slate";
  href?: string;
  hint?: string;
}

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  red: "bg-red-50 text-[#d91a24]",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  slate: "bg-gray-100 text-gray-600",
};

export default function StatCard({ label, value, icon: Icon, tone = "red", href, hint }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${TONES[tone]}`}>
          <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
        </span>
      </div>
      <p className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 leading-none tracking-tight mb-1.5 truncate">
        {value}
      </p>
      <p className="text-[11px] sm:text-xs font-semibold text-gray-500 leading-tight">{label}</p>
      {hint && <p className="text-[10px] text-gray-400 mt-1 leading-tight">{hint}</p>}
    </>
  );

  const className =
    "bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-all duration-200";

  if (href) {
    return (
      <Link href={href} className={`${className} block hover:shadow-md hover:border-red-100 active:scale-[0.98]`}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
