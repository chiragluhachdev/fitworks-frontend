import type { Metadata } from "next";
import ForTrainersView from "@/components/ForTrainersView";

export const metadata: Metadata = {
  title: "Fitness Trainer Jobs & Career Growth for Coaches",
  description:
    "Get discovered by premier gyms and fitness studios across India. Showcase your certifications, apply to verified gym vacancies, and grow your coaching career.",
  alternates: {
    canonical: "/for-trainers",
  },
  openGraph: {
    title: "Fitness Trainer Jobs & Career Growth for Coaches | FitWorks",
    description:
      "Join India's trusted platform for certified fitness trainers and yoga coaches. Connect with top gyms hiring now.",
    url: "https://fitworks.in/for-trainers",
  },
};

export default function ForTrainersPage() {
  return <ForTrainersView />;
}
