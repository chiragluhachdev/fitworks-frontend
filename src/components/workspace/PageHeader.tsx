"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * The top of every workspace screen.
 *
 * Sits directly on the page background rather than inside a card — the title is
 * the anchor, and boxing it repeats a frame the eye has already drawn.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  back,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1 -ml-1 mb-3 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {back.label}
        </Link>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#d91a24] mb-1.5">{eyebrow}</p>
          )}
          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-gray-900 tracking-[-0.02em] leading-[1.1]">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] sm:text-[15px] text-gray-500 mt-2 leading-relaxed max-w-2xl">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
