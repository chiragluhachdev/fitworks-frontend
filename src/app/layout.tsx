import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fitworks.in"),
  title: "FitWorks — Find & Hire Verified Fitness Professionals",
  description:
    "FitWorks connects gyms and individuals with verified trainers and fitness professionals across India. Search, connect and hire with confidence.",
  openGraph: {
    title: "FitWorks — Find & Hire Verified Fitness Professionals",
    description:
      "India's trusted fitness hiring marketplace. Connect with verified trainers, coaches and fitness professionals.",
    type: "website",
    url: "https://www.fitworks.in",
    siteName: "FitWorks",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased font-sans`}
      >
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
