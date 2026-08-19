"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  X, 
  Loader2, 
  Zap, 
  Award,
  CreditCard
} from "lucide-react";
import { toast } from "react-hot-toast";

interface CashfreePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerSlug: string;
  trainerName?: string;
  trainerEmail?: string;
  trainerPhone?: string;
  onSuccess?: () => void;
  skipHref?: string;
}

export default function CashfreePaymentModal({
  isOpen,
  onClose,
  trainerSlug,
  trainerName,
  trainerEmail,
  trainerPhone,
  onSuccess,
  skipHref,
}: CashfreePaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      
      const res = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerSlug,
          name: trainerName,
          email: trainerEmail,
          phone: trainerPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.paymentSessionId) {
        toast.error(data.message || "Failed to initialize payment session. Please try again.");
        setLoading(false);
        return;
      }

      // Check if Cashfree SDK is loaded in window
      if (typeof window !== "undefined" && (window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({ mode: "production" });
        
        cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_modal",
        }).then((result: any) => {
          if (result.error) {
            toast.error(result.error.message || "Payment cancelled or failed");
            setLoading(false);
          }
          if (result.paymentDetails) {
            // Verify on backend
            fetch(`${apiUrl}/payments/verify-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                trainerSlug,
              }),
            })
              .then((r) => r.json())
              .then((vData) => {
                if (vData.isPaid) {
                  toast.success("Payment Verified! Your Verified Badge is active.");
                  if (onSuccess) onSuccess();
                  else if (skipHref) router.push(skipHref);
                  else onClose();
                } else {
                  toast("Order status: " + vData.orderStatus);
                  onClose();
                }
              })
              .finally(() => setLoading(false));
          }
        });
      } else {
        // Fallback: Redirect to Cashfree hosted checkout if modal SDK unavailable
        window.location.href = `https://api.cashfree.com/pg/orders/${data.orderId}`;
      }
    } catch (err: any) {
      console.error("Payment trigger error:", err);
      toast.error("Network error connecting to payment gateway.");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
    if (skipHref) {
      router.push(skipHref);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#d91a24] to-[#b8141d] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Lifetime Profile Activation
          </div>
          
          <h3 className="text-xl md:text-2xl font-black tracking-tight">
            Activate Your Verified Badge
          </h3>
          <p className="text-white/80 text-xs mt-1 max-w-xs mx-auto">
            Get noticed by top partner gyms &amp; unlock priority placement across FitWorks.
          </p>

          {/* Pricing Highlight */}
          <div className="mt-4 inline-flex items-baseline gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-sm">
            <span className="text-3xl font-black text-white">₹99</span>
            <span className="text-xs text-white/80 font-medium line-through">₹499</span>
            <span className="text-[10px] font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full uppercase ml-1">
              80% OFF
            </span>
          </div>
        </div>

        {/* Benefits Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Included with Verified Activation
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Verified Marketplace Badge</p>
                <p className="text-[11px] text-gray-500">Official blue checkmark shown to gyms searching for coaches.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-[#d91a24] flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-[#d91a24]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Priority Partner Gym Placement</p>
                <p className="text-[11px] text-gray-500">Recommended first to clubs like HOPE GYM &amp; ANYDAY FITNESS.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Direct Contact &amp; Fast-Track Review</p>
                <p className="text-[11px] text-gray-500">Certificates reviewed by our verification team within 24 hours.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2.5">
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full py-4 bg-[#d91a24] hover:bg-[#c2141d] active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Opening Secure Checkout...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay ₹99 &amp; Activate Verified Badge
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors text-center cursor-pointer"
            >
              Skip for now &amp; Go to Dashboard →
            </button>
          </div>

          {/* Trust Guarantee & Payment Partners */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure
              </span>
              <span>•</span>
              <span>UPI, Cards &amp; NetBanking</span>
              <span>•</span>
              <span className="font-semibold text-gray-600">Powered by Cashfree</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
