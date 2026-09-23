"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * One number and what it means.
 *
 * The label reads first and the figure sits below it at display size — the
 * opposite of the usual icon-led tile, and far quicker to scan down a row.
 */
export default function Stat({
  label,
  value,
  hint,
  icon: Icon,
  href,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  /** Marks the one figure on the screen that matters most. */
  accent?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <p className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-gray-400 truncate">{label}</p>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${accent ? "text-[#d91a24]" : "text-gray-300"}`} />}
      </div>
      <p
        className={`text-[28px] sm:text-[32px] font-extrabold leading-none tracking-[-0.03em] tabular-nums ${
          accent ? "text-[#d91a24]" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="text-[11.5px] text-gray-400 mt-2 leading-snug line-clamp-2">{hint}</p>}
    </>
  );

  const base = "bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 transition-all duration-150";

  if (href) {
    return (
      <Link href={href} className={`${base} block hover:border-gray-300 active:scale-[0.99]`}>
        {body}
      </Link>
    );
  }
  return <div className={base}>{body}</div>;
}
