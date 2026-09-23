"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

type Tone = "info" | "success" | "warning" | "neutral" | "brand";

const TONES: Record<Tone, { wrap: string; icon: string }> = {
  info: { wrap: "bg-sky-50/70 ring-sky-200/70", icon: "bg-white text-sky-600 ring-sky-200" },
  success: { wrap: "bg-emerald-50/70 ring-emerald-200/70", icon: "bg-white text-emerald-600 ring-emerald-200" },
  warning: { wrap: "bg-amber-50/70 ring-amber-200/70", icon: "bg-white text-amber-600 ring-amber-200" },
  neutral: { wrap: "bg-gray-50 ring-gray-200", icon: "bg-white text-gray-500 ring-gray-200" },
  brand: { wrap: "bg-brand-tint ring-red-100", icon: "bg-white text-brand ring-red-100" },
};

/**
 * A single line of context with an icon — never more than two sentences.
 *
 * On a phone the action drops below the text rather than squeezing beside it;
 * a button and two lines of copy do not both fit across 343px.
 */
export default function Callout({
  icon: Icon,
  title,
  children,
  tone = "neutral",
  action,
}: {
  icon: LucideIcon;
  title: string;
  children?: React.ReactNode;
  tone?: Tone;
  action?: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div className={`rounded-[20px] ring-1 p-4 sm:p-5 ${t.wrap}`}>
      <div className="flex items-start gap-3 sm:gap-3.5">
        <span
          className={`w-9 h-9 rounded-xl ring-1 flex items-center justify-center shrink-0 ${t.icon}`}
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] sm:text-[14px] font-bold text-gray-900 leading-snug">{title}</p>
          {children && (
            <div className="text-[12px] sm:text-[12.5px] text-gray-600 mt-1 leading-relaxed">
              {children}
            </div>
          )}
        </div>
        {action && <div className="hidden sm:block shrink-0 self-center">{action}</div>}
      </div>
      {action && <div className="sm:hidden mt-3.5 pl-12">{action}</div>}
    </div>
  );
}
