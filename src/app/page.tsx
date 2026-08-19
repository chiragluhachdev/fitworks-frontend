import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/BottomSection";
import HowItWorks from "@/components/HowItWorks";
import TrainerShowcase from "@/components/TrainerShowcase";
import WhyFitWorks from "@/components/WhyFitWorks";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

export const metadata: Metadata = {
  title: "FitWorks — Find & Hire Verified Fitness Professionals",
  description:
    "India's leading marketplace for verified fitness trainers, coaches, and gym hiring opportunities. Connect directly with certified professionals.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <TrainerShowcase />
      <WhyFitWorks />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
