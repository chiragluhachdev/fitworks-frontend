import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login / Sign Up",
  description: "Sign in to your FitWorks account or register as a gym or verified trainer.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
