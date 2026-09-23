"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * What to show when there's nothing yet.
 *
 * Says what will fill the space and how to make that happen, rather than
 * apologising for the emptiness.
 */
export default function Empty({
  icon: Icon,
  title,
  description,
  action,
  secondary,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  secondary?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-10 sm:py-14 text-center">
      <span className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-5 h-5 text-gray-400" />
      </span>
      <p className="text-[15px] font-bold text-gray-900">{title}</p>
      <p className="text-[13px] text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center mt-5 h-11 px-5 rounded-xl bg-[#d91a24] hover:bg-[#c11620] text-white text-sm font-bold active:scale-[0.98] transition-all"
        >
          {action.label}
        </Link>
      )}
      {secondary && <div className="mt-4">{secondary}</div>}
    </div>
  );
}
