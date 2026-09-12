"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  Lock,
  X,
  Loader2,
  Zap,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerSlug: string;
  trainerName?: string;
  trainerEmail?: string;
  trainerPhone?: string;
  onSuccess?: () => void;
  skipHref?: string;
}

const BENEFITS = [
  {
    icon: ShieldCheck,
    tone: "bg-emerald-100 text-emerald-600",
    title: "Apply to any vacancy",
    body: "Hiring gyms can find, shortlist and contact you directly.",
  },
  {
    icon: Zap,
    tone: "bg-red-100 text-[#d91a24]",
    title: "Apply to every open vacancy",
    body: "Unlimited applications to roles from partner gyms across India.",
  },
  {
    icon: Award,
    tone: "bg-blue-100 text-blue-600",
    title: "Verified badge on your profile",
    body: "Your reviewed certificates and ID displayed as a trust signal.",
  },
];

export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  trainerSlug,
  trainerName,
  trainerEmail,
  trainerPhone,
  onSuccess,
  skipHref,
}: RazorpayPaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  const authHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;
    return { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` };
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      // 1. Create the order server-side (amount is fixed there, never sent by the client).
      const res = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ trainerSlug }),
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.orderId) {
        toast.error(data.message || "Could not start the payment. Please try again.");
        setLoading(false);
        return;
      }

      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) {
        toast.error("Payment library still loading — please try again in a moment.");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout.
      const checkout = new Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "FitWorks",
        description: "FitWorks trainer profile activation (one-time)",
        image: "/icon.png",
        // The create-order response carries the trainer's own details, so
        // checkout prefills correctly whether or not the calling page happened
        // to have the profile loaded. An empty contact field is real friction —
        // UPI needs the number.
        prefill: {
          name: trainerName || data.trainerName || "",
          email: trainerEmail || data.trainerEmail || "",
          contact: trainerPhone || data.trainerPhone || "",
        },
        notes: { trainerSlug },
        theme: { color: "#d91a24" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast("Payment cancelled.");
          },
        },
        // 3. Verify the signature server-side before trusting anything.
        handler: async (response: any) => {
          try {
            const vRes = await fetch(`${apiUrl}/payments/verify-order`, {
              method: "POST",
              headers: authHeaders(),
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                trainerSlug,
              }),
            });
            const vData = await vRes.json();

            if (vData.success && vData.isPaid) {
              toast.success("Activated — your profile is live for gyms, with nothing more to pay.");
              if (onSuccess) onSuccess();
              else if (skipHref) router.push(skipHref);
              else onClose();
            } else {
              // Money may still have been captured; the webhook is the backstop.
              toast.error(
                vData.message || "We could not confirm the payment yet. It will update shortly."
              );
              onClose();
            }
          } catch (err) {
            console.error("Verify error:", err);
            toast.error("Payment taken, but confirmation failed. Refresh in a minute.");
          } finally {
            setLoading(false);
          }
        },
      });

      checkout.on("payment.failed", (resp: any) => {
        console.error("Razorpay payment failed:", resp?.error);
        toast.error(resp?.error?.description || "Payment failed. Please try another method.");
        setLoading(false);
      });

      checkout.open();
    } catch (err) {
      console.error("Payment trigger error:", err);
      toast.error("Network error connecting to the payment gateway.");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
    if (skipHref) router.push(skipHref);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-250">

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-2 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#d91a24] to-[#b8141d] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            One-time activation
          </span>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Activate your FitWorks profile
          </h2>
          <p className="text-white/80 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
You can&apos;t apply to vacancies until your profile is activated. Pay once — that&apos;s it.
          </p>

          <div className="mt-4 inline-flex items-baseline gap-1.5 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-sm">
            <span className="text-3xl font-black">₹99</span>
            <span className="text-sm text-white/80 font-semibold">once</span>
          </div>
          <p className="text-[11px] text-white/70 mt-2">
            No monthly fee · no renewal · charged once
          </p>
        </div>

        {/* Benefits */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            What activation includes
          </p>

          <div className="space-y-2.5">
            {BENEFITS.map(({ icon: Icon, tone, title, body }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900">{title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full h-14 bg-[#d91a24] hover:bg-[#c2141d] active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgb(217,26,36,0.28)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Opening secure checkout…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Activate for ₹99
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Not now →
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% secure
              </span>
              <span>•</span>
              <span>UPI, cards &amp; netbanking</span>
              <span>•</span>
              <span className="font-semibold text-gray-600">Powered by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
