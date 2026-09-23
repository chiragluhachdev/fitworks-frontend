"use client";

import React from "react";

/** A status in one small, quiet chip with a colour dot. */
export default function StatusPill({
  label,
  chip,
  dot,
  size = "md",
}: {
  label: string;
  /** Tailwind text/bg/border trio from the shared vocabulary. */
  chip: string;
  dot?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap ${chip} ${
        size === "sm" ? "text-[10.5px] px-2 py-0.5" : "text-[11.5px] px-2.5 py-1"
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />}
      {label}
    </span>
  );
}
