/**
 * Razorpay Checkout, loaded on demand.
 *
 * The script is ~100KB and only two screens ever need it, so it is fetched
 * when someone actually chooses a plan rather than on every page load.
 */

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void; on: (e: string, cb: (r: any) => void) => void };
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayResult) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

let loading: Promise<boolean> | null = null;

/** Resolves false if the script can't be fetched, so the caller can say so. */
export const loadRazorpay = (): Promise<boolean> => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(!!window.Razorpay));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(!!window.Razorpay);
    script.onerror = () => {
      // A failed load must not be cached — the next attempt should retry.
      loading = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loading;
};

/** Opens checkout. Rejects only when the script or the SDK is unavailable. */
export const openCheckout = async (options: RazorpayOptions): Promise<void> => {
  const ready = await loadRazorpay();
  if (!ready || !window.Razorpay) {
    throw new Error("Couldn't load the payment window. Check your connection and try again.");
  }
  const checkout = new window.Razorpay(options);
  checkout.on("payment.failed", (res: any) => {
    console.warn("Razorpay payment failed:", res?.error?.description);
  });
  checkout.open();
};
