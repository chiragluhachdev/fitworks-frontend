"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * A titled block of content.
 *
 * Matches the dashboard's cards: a 20px radius, a hairline ring rather than a
 * border, and the barest shadow. Depth comes from the page background, so two
 * panels next to each other stay quiet.
 *
 * Padding and type both step down on a phone — a 24px gutter inside a 16px
 * gutter leaves very little room for the content itself.
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
    <section
      className={`bg-white rounded-[20px] ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden ${className}`}
    >
      {(title || action || aside) && (
        <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3.5 sm:pb-4 border-b border-gray-100">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[14.5px] sm:text-[16px] font-bold text-gray-900 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[12px] sm:text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {aside}
          {action && (
            <Link
              href={action.href}
              className="text-[12px] sm:text-[12.5px] font-bold text-brand hover:underline inline-flex items-center gap-1 shrink-0 whitespace-nowrap pt-0.5"
            >
              {action.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
      <div className={`p-4 sm:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
