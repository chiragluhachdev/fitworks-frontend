import type { Metadata } from "next";
import AuthView from "@/components/auth/AuthView";

/** Dedicated landing route for gym acquisition campaigns. */
export const metadata: Metadata = {
  title: "Hire Verified Trainers for Your Gym",
  description:
    "Create a free FitWorks gym account and start hiring background-verified personal trainers and coaches across India.",
  alternates: { canonical: "/auth/gym-signup" },
  openGraph: {
    title: "Hire Verified Trainers for Your Gym | FitWorks",
    description:
      "Post vacancies and connect with verified fitness professionals. Free to create a gym account.",
    url: "https://fitworks.in/auth/gym-signup",
    images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "Hire verified trainers on FitWorks" }],
  },
};

export default function GymSignupPage() {
  return <AuthView mode="register_gym" />;
}
