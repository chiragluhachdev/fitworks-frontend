import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login / Sign Up",
  description: "Sign in to your FitWorks account or register as a gym or verified trainer.",
  robots: {
    index: false,
    follow: false,
  },
};

/** Matches the session check inside AuthView, so the swap isn't a visible jump. */
function AuthFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
      <span className="w-7 h-7 rounded-full border-[3px] border-[#E92E3D] border-t-transparent animate-spin" />
      <p className="text-xs font-semibold text-gray-500">Loading…</p>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Every auth route reads ?next= to resume an interrupted destination, which
  // opts them out of static prerendering unless the read sits behind Suspense.
  return <Suspense fallback={<AuthFallback />}>{children}</Suspense>;
}
