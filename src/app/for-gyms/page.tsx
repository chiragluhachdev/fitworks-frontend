import type { Metadata } from "next";
import ForGymsView from "@/components/ForGymsView";

export const metadata: Metadata = {
  title: "Hire Verified Fitness Trainers & Coaches for Your Gym",
  description:
    "Source certified, background-verified personal trainers and fitness coaches for your gym or fitness studio. Fast-track your hiring on FitWorks.",
  alternates: {
    canonical: "/for-gyms",
  },
  openGraph: {
    title: "Hire Verified Fitness Trainers & Coaches for Your Gym | FitWorks",
    description:
      "Find top certified personal trainers, group instructors, and fitness managers for your gym. Zero hiring hassle with background-verified talent.",
    url: "https://fitworks.in/for-gyms",
  },
};

export default function ForGymsPage() {
  return <ForGymsView />;
}
