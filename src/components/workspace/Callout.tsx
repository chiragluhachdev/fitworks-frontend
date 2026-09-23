"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

type Tone = "info" | "success" | "warning" | "neutral";

const TONES: Record<Tone, { wrap: string; icon: string }> = {
  info: { wrap: "bg-sky-50/70 border-sky-200/70", icon: "bg-white text-sky-600 border-sky-200" },
  success: { wrap: "bg-emerald-50/70 border-emerald-200/70", icon: "bg-white text-emerald-600 border-emerald-200" },
  warning: { wrap: "bg-amber-50/70 border-amber-200/70", icon: "bg-white text-amber-600 border-amber-200" },
  neutral: { wrap: "bg-gray-50 border-gray-200", icon: "bg-white text-gray-500 border-gray-200" },
};

/** A single line of context with an icon — never more than two sentences. */
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
    <div className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border ${t.wrap}`}>
      <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${t.icon}`}>
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-gray-900 leading-snug">{title}</p>
        {children && <div className="text-[12.5px] text-gray-600 mt-1 leading-relaxed">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
