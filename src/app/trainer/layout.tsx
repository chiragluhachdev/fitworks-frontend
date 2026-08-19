import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trainer Dashboard",
  description: "FitWorks Fitness Trainer Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrainerRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
