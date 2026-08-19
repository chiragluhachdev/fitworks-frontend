import Hero from "@/components/Hero";
import TrustedBy from "@/components/BottomSection";
import HowItWorks from "@/components/HowItWorks";
import TrainerShowcase from "@/components/TrainerShowcase";
import WhyFitWorks from "@/components/WhyFitWorks";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

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
