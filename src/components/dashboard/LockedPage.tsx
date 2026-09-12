"use client";

import React, { useState } from "react";
import AccessLocked, { type LockInfo } from "@/components/dashboard/AccessLocked";
import RazorpayPaymentModal from "@/components/RazorpayPaymentModal";

/**
 * A gated page in one line: the lock screen plus the checkout it opens.
 *
 * Every locked surface pairs the same explanation with the same checkout, and
 * each one has to re-fetch when the payment lands. Keeping that together here
 * is what stops the three pages drifting apart.
 */
export default function LockedPage({
  lock,
  trainerSlug,
  trainerName,
  trainerEmail,
  trainerPhone,
  onUnlocked,
  heading,
  subheading,
}: {
  lock: LockInfo;
  trainerSlug: string;
  trainerName?: string;
  trainerEmail?: string;
  trainerPhone?: string;
  /** Re-run the page's fetch once the profile is activated. */
  onUnlocked: () => void;
  /** The page's own title, kept above the lock so context isn't lost. */
  heading: string;
  subheading: string;
}) {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="space-y-5 sm:space-y-7 animate-in fade-in duration-300">
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{heading}</h1>
        <p className="text-[13px] sm:text-sm text-gray-500 mt-1.5">{subheading}</p>
      </header>

      <AccessLocked lock={lock} trainerSlug={trainerSlug} onActivate={() => setShowPayment(true)} />

      <RazorpayPaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        trainerSlug={trainerSlug}
        trainerName={trainerName}
        trainerEmail={trainerEmail}
        trainerPhone={trainerPhone}
        onSuccess={() => {
          setShowPayment(false);
          onUnlocked();
        }}
      />
    </div>
  );
}
