"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * The top of every workspace screen.
 *
 * Sits directly on the page background rather than inside a card — the title
 * is the anchor, and boxing it repeats a frame the eye has already drawn.
 *
 * The title steps down hard on a phone. At 32px a two-word heading is fine and
 * "Profile & settings" wraps to three lines.
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
    <header className="mb-5 sm:mb-7">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1 -ml-1 mb-2.5 text-[12.5px] sm:text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {back.label}
        </Link>
      )}

      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-brand mb-1.5">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[23px] sm:text-[28px] md:text-[32px] font-extrabold text-gray-900 tracking-[-0.025em] leading-[1.12]">
            {title}
          </h1>
          {description && (
            <p className="text-[13px] sm:text-[14.5px] text-gray-500 mt-1.5 sm:mt-2 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
