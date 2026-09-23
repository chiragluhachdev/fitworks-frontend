"use client";

import React from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

/** Grey blocks in the shape of the content that's coming. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

/** The loading shape of a stat row plus a list — used by most screens. */
export function PageSkeleton({ stats = 4, rows = 3 }: { stats?: number; rows?: number }) {
  return (
    <div className="space-y-5 sm:space-y-6" aria-busy="true" aria-label="Loading">
      <div className="space-y-2.5">
        <Skeleton className="h-7 sm:h-8 w-48 sm:w-56" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
      {stats > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: stats }).map((_, i) => (
            <Skeleton key={i} className="h-[132px] sm:h-[148px] rounded-[20px]" />
          ))}
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-[20px]" />
        ))}
      </div>
    </div>
  );
}

/** A spinner with a line of text, for in-place waits. */
export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="w-6 h-6 text-brand animate-spin" />
      {label && <p className="text-[12.5px] sm:text-[13px] font-semibold text-gray-500">{label}</p>}
    </div>
  );
}

/** Something failed. Says what, and offers the one useful action. */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-white rounded-[20px] ring-1 ring-gray-200/70 px-5 py-11 sm:py-12 text-center">
      <span className="w-12 h-12 rounded-2xl bg-brand-tint text-brand flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-5 h-5" />
      </span>
      <p className="text-[14.5px] sm:text-[15px] font-bold text-gray-900">{title}</p>
      <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 mt-5 h-11 px-5 rounded-xl bg-brand hover:bg-brand-dark text-white text-[13.5px] sm:text-sm font-bold active:scale-[0.98] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      )}
    </div>
  );
}
