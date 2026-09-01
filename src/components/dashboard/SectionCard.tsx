"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** White panel with a title row and an optional "view all" link. */
export default function SectionCard({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
        <div className="min-w-0">
          <h2 className="text-[15px] sm:text-lg font-bold text-gray-900 leading-tight">{title}</h2>
          {description && <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="text-[11px] sm:text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap pt-0.5"
          >
            {action.label} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
