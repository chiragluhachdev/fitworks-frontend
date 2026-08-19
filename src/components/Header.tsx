"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
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

  if (pathname === "/about" || pathname === "/auth") return null;

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
        <Link href="/" className="inline-block relative w-[150px] h-[47px] shrink-0">
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
                    ? "text-[#d91a24] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#d91a24] after:rounded-full"
                    : "text-gray-900 hover:text-[#d91a24]"
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
              <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white rounded-lg px-[20px] h-[38px] text-sm font-semibold hidden md:inline-flex shadow-sm cursor-pointer">
                Login / Sign Up <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 text-sm font-semibold text-gray-900">
          <Link href="/" className="block py-1.5 hover:text-[#d91a24]" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/for-gyms" className="block py-1.5 hover:text-[#d91a24]" onClick={() => setMobileOpen(false)}>For Gyms</Link>
          <Link href="/for-trainers" className="block py-1.5 hover:text-[#d91a24]" onClick={() => setMobileOpen(false)}>For Trainers</Link>
          <Link href="/#testimonials" className="block py-1.5 hover:text-[#d91a24]" onClick={() => setMobileOpen(false)}>Testimonials</Link>
          {pathname !== "/auth" && (
            <Link href="/auth" onClick={() => setMobileOpen(false)}>
              <Button className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-[0.97] transition-all duration-200 ease-out active:duration-0 text-white rounded-lg w-full h-[38px] text-sm font-semibold mt-2 flex items-center justify-center cursor-pointer">
                Login / Sign Up <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
