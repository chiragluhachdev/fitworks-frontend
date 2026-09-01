import type { Metadata } from "next";
import AuthView from "@/components/auth/AuthView";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Join FitWorks as a gym owner hiring verified trainers, or as a fitness professional looking for your next opportunity.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthView mode="register_select" />;
}
