import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import StructuredData from "@/components/StructuredData";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#d91a24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fitworks.in"),
  title: {
    default: "FitWorks — Find & Hire Verified Fitness Professionals",
    template: "%s | FitWorks",
  },
  description:
    "FitWorks connects gyms and fitness clubs with verified personal trainers, coaches and fitness specialists across India. Hire verified fitness talent or discover premium gym vacancies.",
  keywords: [
    "fitness trainers India",
    "hire gym trainers",
    "verified personal trainers",
    "fitness trainer jobs",
    "gym hiring marketplace",
    "certified fitness coaches",
    "yoga instructors hiring",
    "strength coach jobs",
    "FitWorks",
  ],
  authors: [{ name: "FitWorks" }],
  creator: "FitWorks",
  publisher: "FitWorks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://fitworks.in",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "FitWorks — Find & Hire Verified Fitness Professionals",
    description:
      "India's trusted marketplace for gyms and fitness professionals. Find and hire certified, background-verified trainers with verified credentials.",
    url: "https://fitworks.in",
    siteName: "FitWorks",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "FitWorks — Find & Hire Verified Fitness Professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitWorks — Find & Hire Verified Fitness Professionals",
    description:
      "India's trusted marketplace connecting gyms with verified fitness coaches and personal trainers.",
    images: ["/images/hero.png"],
    creator: "@fitworks_india",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased font-sans`}
      >
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-right" />
        <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
