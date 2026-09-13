"use client";

import React from "react";
import { buildWhatsAppUrl, type WhatsAppTrainer } from "@/lib/whatsapp";

/** WhatsApp's glyph — lucide has no brand icons. */
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23z" />
    </svg>
  );
}

/**
 * Opens WhatsApp (app on a phone, WhatsApp Web on a computer) on a chat with the
 * trainer, message already written. The admin reads it and presses send — this
 * never sends anything on its own.
 *
 * Renders disabled when the stored number isn't a dialable Indian mobile, rather
 * than opening an empty chat.
 */
export default function WhatsAppButton({
  trainer,
  variant = "icon",
}: {
  trainer: WhatsAppTrainer;
  variant?: "icon" | "full";
}) {
  const href = buildWhatsAppUrl(trainer);
  const label = trainer.activation?.isActive
    ? "Message on WhatsApp"
    : "Send activation message";

  if (!href) {
    return (
      <button
        disabled
        title="No valid mobile number on this profile"
        className={
          variant === "full"
            ? "h-11 px-4 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-not-allowed"
            : "bg-gray-100 text-gray-300 text-xs font-bold px-2.5 py-1.5 rounded-xl inline-flex items-center gap-1 cursor-not-allowed"
        }
      >
        <WhatsAppIcon className={variant === "full" ? "w-4 h-4" : "w-3.5 h-3.5"} />
        {variant === "full" && "No mobile number"}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={
        variant === "full"
          ? "h-11 px-4 rounded-xl bg-[#25D366] hover:bg-[#1fbb57] text-white text-xs font-bold inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          : "bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C3E] border border-[#25D366]/30 text-xs font-bold px-2.5 py-1.5 rounded-xl inline-flex items-center gap-1 transition-colors"
      }
    >
      <WhatsAppIcon className={variant === "full" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      {variant === "full" && label}
    </a>
  );
}
