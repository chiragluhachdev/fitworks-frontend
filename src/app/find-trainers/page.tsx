import type { Metadata } from "next";
import TrainersDirectoryView from "@/components/TrainersDirectoryView";

export const metadata: Metadata = {
  title: "Find & Hire Certified Personal Trainers",
  description:
    "Browse verified personal trainers, strength coaches, and yoga instructors across India. Filter by specialization, experience, and city on FitWorks.",
  alternates: {
    canonical: "/find-trainers",
  },
  openGraph: {
    title: "Find & Hire Certified Personal Trainers | FitWorks",
    description:
      "Browse India's verified fitness professionals. Find and hire certified trainers for gyms, clubs, and personal training.",
    url: "https://fitworks.in/find-trainers",
  },
};

export default function FindTrainersPage() {
  return <TrainersDirectoryView />;
}
