"use client";

import React from "react";
import AccessLocked, { type LockInfo } from "@/components/dashboard/AccessLocked";

/**
 * A gated page in one line: the page's own heading above the explanation of
 * why its content is withheld. Shared so the gated pages cannot word it
 * differently from each other.
 */
export default function LockedPage({
  lock,
  trainerSlug,
  heading,
  subheading,
}: {
  lock: LockInfo;
  trainerSlug: string;
  /** The page's own title, kept above the lock so context isn't lost. */
  heading: string;
  subheading: string;
}) {
  return (
    <div className="space-y-5 sm:space-y-7 animate-in fade-in duration-300">
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{heading}</h1>
        <p className="text-[13px] sm:text-sm text-gray-500 mt-1.5">{subheading}</p>
      </header>

      <AccessLocked lock={lock} trainerSlug={trainerSlug} />
    </div>
  );
}
