import type { Metadata } from "next";
import AuthView from "@/components/auth/AuthView";

export const metadata: Metadata = {
  title: "Login / Sign Up",
  description: "Sign in to your FitWorks account or register as a gym or verified trainer.",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthView mode="login" />;
}
