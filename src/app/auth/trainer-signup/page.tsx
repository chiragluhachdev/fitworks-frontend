import type { Metadata } from "next";
import AuthView from "@/components/auth/AuthView";

/**
 * Dedicated landing route for trainer acquisition campaigns
 * (Meta / Google Ads, WhatsApp, QR codes). Links straight into
 * step 1 of the trainer registration flow — no extra clicks.
 */
export const metadata: Metadata = {
  title: "Join as a Verified Trainer",
  description:
    "Create your FitWorks trainer profile free. Activate for a one-time 99 rupees and apply to gym vacancies across India.",
  alternates: { canonical: "/auth/trainer-signup" },
  openGraph: {
    title: "Join FitWorks as a Verified Trainer",
    description:
      "Build your trainer profile free, then apply to gym vacancies across India for a one-time 99 rupees.",
    url: "https://fitworks.in/auth/trainer-signup",
    images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "Join FitWorks as a verified trainer" }],
  },
};

export default function TrainerSignupPage() {
  return <AuthView mode="register_trainer" />;
}
