"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isStandaloneOrDashboard =
    pathname.startsWith("/gym") ||
    pathname.startsWith("/trainer") ||
    pathname.startsWith("/admin") ||
    pathname === "/auth" ||
    pathname === "/about";

  if (isStandaloneOrDashboard) {
    return (
      <main className="min-h-screen w-full flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full pt-[60px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
