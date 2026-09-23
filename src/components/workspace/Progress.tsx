"use client";

import React from "react";

/** A thin completion bar. Turns green only once the profile is genuinely done. */
export function ProgressBar({ percent, className = "" }: { percent: number; className?: string }) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full rounded-full bg-gray-100 overflow-hidden ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          value >= 100 ? "bg-emerald-500" : "bg-[#d91a24]"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/** The same figure as a ring, for when it needs to hold its own next to a title. */
export function ProgressRing({ percent, size = 56 }: { percent: number; size?: number }) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const done = value >= 100;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f2f4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? "#10b981" : "#d91a24"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[12.5px] font-extrabold text-gray-900 tabular-nums">
        {value}%
      </span>
    </div>
  );
}
