import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gym Dashboard",
  description: "FitWorks Partner Gym Management Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GymRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
