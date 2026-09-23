"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * A titled block of content.
 *
 * One hairline border and a flat white fill — no shadow stack. Depth is carried
 * by the page background, so panels stay quiet next to each other.
 */
export default function Panel({
  title,
  description,
  action,
  aside,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-200/80 overflow-hidden ${className}`}>
      {(title || action || aside) && (
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-bold text-gray-900 leading-tight">{title}</h2>}
            {description && <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">{description}</p>}
          </div>
          {aside}
          {action && (
            <Link
              href={action.href}
              className="text-[12.5px] font-bold text-[#d91a24] hover:underline inline-flex items-center gap-1 shrink-0 whitespace-nowrap pt-0.5"
            >
              {action.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
      <div className={`p-5 sm:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
