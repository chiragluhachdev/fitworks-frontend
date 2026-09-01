"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="px-5 py-8 sm:py-10 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
      <span className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-3.5">
        <Icon className="w-6 h-6 text-gray-300" />
      </span>
      <p className="text-sm font-bold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center mt-4 h-10 px-5 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-xs font-bold active:scale-[0.98] transition-all"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
