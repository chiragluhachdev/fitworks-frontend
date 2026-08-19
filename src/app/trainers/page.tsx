import type { Metadata } from "next";
import TrainersDirectoryView from "@/components/TrainersDirectoryView";

export const metadata: Metadata = {
  title: "Verified Fitness Trainers Directory",
  description:
    "Explore our directory of verified fitness coaches, personal trainers, and instructors in India. View credentials and connect on FitWorks.",
  alternates: {
    canonical: "/trainers",
  },
  openGraph: {
    title: "Verified Fitness Trainers Directory | FitWorks",
    description:
      "Explore certified and background-verified fitness coaches and trainers across India.",
    url: "https://fitworks.in/trainers",
  },
};

export default function TrainersPage() {
  return <TrainersDirectoryView />;
}
