"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/about" || pathname.startsWith("/auth")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "For Gyms", href: "/for-gyms" },
    { name: "For Trainers", href: "/for-trainers" },
    { name: "Testimonials", href: "/#testimonials" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="FitWorks home" className="inline-block relative w-[132px] h-[41px] sm:w-[150px] sm:h-[47px] shrink-0">
          <Image
            src="/images/logo.png"
            alt="FitWorks Logo"
            fill
            style={{ objectFit: "contain", objectPosition: "left" }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-gray-900">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? "text-[#E92E3D] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#E92E3D] after:rounded-full"
                    : "text-gray-900 hover:text-[#E92E3D]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {pathname !== "/auth" && (
            <Link href="/auth">
              <Button className="bg-[#E92E3D] hover:bg-[#d42936] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white rounded-lg px-[20px] h-[38px] text-sm font-semibold hidden md:inline-flex shadow-sm cursor-pointer">
                Login / Sign Up <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center text-gray-700 rounded-xl active:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? "max-h-[340px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white border-t border-gray-100 px-5 pt-3 pb-5 shadow-[0_12px_24px_rgb(0,0,0,0.06)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3 border-b border-gray-50 text-[15px] font-semibold transition-colors ${
                  isActive ? "text-[#E92E3D]" : "text-gray-900 hover:text-[#E92E3D]"
                }`}
              >
                {link.name}
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </Link>
            );
          })}

          {pathname !== "/auth" && (
            <Link href="/auth" onClick={() => setMobileOpen(false)} className="block mt-4">
              <Button className="bg-[#E92E3D] hover:bg-[#d42936] active:scale-[0.98] transition-all duration-200 ease-out active:duration-0 text-white rounded-xl w-full h-[48px] text-[15px] font-semibold flex items-center justify-center cursor-pointer shadow-[0_6px_16px_rgb(217,26,36,0.22)]">
                Login / Sign Up <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
