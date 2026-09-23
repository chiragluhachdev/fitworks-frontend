"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark shadow-[0_1px_2px_rgba(233,46,61,0.3),0_8px_22px_-10px_rgba(233,46,61,0.75)]",
  secondary: "bg-white text-gray-800 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50",
  ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  danger: "bg-white text-brand ring-1 ring-red-200 hover:bg-brand-tint",
};

/**
 * Every size clears 44px, the smallest comfortable tap target, and the phone
 * sizes sit a touch taller than the desktop ones because a thumb is blunter
 * than a cursor.
 */
const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[12.5px] sm:text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-4 sm:px-4.5 text-[13.5px] sm:text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 sm:px-6 text-[14.5px] sm:text-[15px] gap-2 rounded-xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
  block?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  href,
  block = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center font-bold whitespace-nowrap transition-all duration-150",
    "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    VARIANTS[variant],
    SIZES[size],
    block ? "w-full" : "",
    className,
  ].join(" ");

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
