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
  // Meta Business Suite domain verification for fitworks.in.
  // Must be server-rendered inside <head> — Meta's crawler ignores tags
  // injected by client-side JavaScript. Do not remove.
  other: {
    "facebook-domain-verification": "96nkg6hwwj5mc8gmuibdodtem9dg0u",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "1604943784468462";

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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        {pixelId && (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
