"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[#d91a24] text-white hover:bg-[#c11620] shadow-[0_1px_2px_rgba(217,26,36,0.35),0_8px_20px_-8px_rgba(217,26,36,0.6)]",
  secondary: "bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
  ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  danger: "bg-white text-[#d91a24] border border-red-200 hover:bg-red-50",
};

// 44px is the smallest comfortable tap target; the phone sizes never go under it.
const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-4.5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
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
    "inline-flex items-center justify-center font-bold transition-all duration-150",
    "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d91a24]",
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
