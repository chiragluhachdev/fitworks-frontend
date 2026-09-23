"use client";

import React from "react";

/**
 * Form primitives for the workspace.
 *
 * One label style, one control height, one focus ring — so a six-field form
 * and a twenty-field form look like the same product.
 *
 * Controls are 48px tall on phones and their text is 16px, which is the floor
 * below which iOS Safari zooms the page on focus. globals.css enforces that
 * floor for every input as a backstop; the class here says so explicitly.
 */
const CONTROL =
  "w-full h-12 sm:h-11 px-3.5 bg-white ring-1 ring-gray-200 rounded-xl text-[16px] sm:text-[14px] text-gray-900 " +
  "placeholder:text-gray-400 outline-none transition-shadow " +
  "focus:ring-2 focus:ring-brand/40 disabled:bg-gray-50 disabled:text-gray-400";

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-[12.5px] sm:text-[13px] font-bold text-gray-800">
        {label}
        {required && <span className="text-brand ml-0.5">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11.5px] sm:text-[12px] font-semibold text-brand">{error}</p>
      ) : (
        hint && <p className="text-[11.5px] sm:text-[12px] text-gray-400 leading-snug">{hint}</p>
      )}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return <input ref={ref} className={`${CONTROL} ${className}`} {...props} />;
  }
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select ref={ref} className={`${CONTROL} cursor-pointer pr-9 appearance-none ${className}`} {...props}>
        {children}
      </select>
    );
  }
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${CONTROL} h-auto py-3 leading-relaxed resize-y ${className}`}
      {...props}
    />
  );
});

/** A labelled group of fields inside a longer form. */
export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-[14.5px] sm:text-[15px] font-bold text-gray-900">{title}</h3>
        {description && <p className="text-[12px] sm:text-[12.5px] text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

/**
 * A set of choices shown as tappable chips.
 *
 * Beats a native multi-select on a phone, and shows every option at once so
 * nothing is hidden behind a dropdown.
 */
export function ChipSelect({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
}) {
  const toggle = (option: string) => {
    if (!multiple) return onChange([option]);
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const on = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            aria-pressed={on}
            className={`h-10 px-3.5 rounded-xl text-[12.5px] sm:text-[13px] font-semibold ring-1 transition-all active:scale-[0.97] ${
              on
                ? "bg-brand text-white ring-brand"
                : "bg-white text-gray-700 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
