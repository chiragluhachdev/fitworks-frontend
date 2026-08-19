"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Globe, Mail, Share2 } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Platform: [
    { label: "For Gyms", href: "/for-gyms" },
    { label: "Home", href: "/" },
    { label: "For Trainers", href: "/for-trainers" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/about#privacy" },
    { label: "Terms of Service", href: "/about#terms" },
    { label: "Cookie Policy", href: "/about#privacy" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/auth" || pathname === "/about") return null;

  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6 px-4 md:px-8 w-full">
      <div className="max-w-[1380px] mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4 relative w-[130px] h-[42px] brightness-0 invert">
              <Image
                src="/images/logo.png"
                alt="FitWorks Logo"
                fill
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-xs leading-relaxed">
              Connecting gyms and individuals with verified trainers, coaches and fitness professionals across India.
            </p>
            <div className="space-y-1.5 mb-4 text-xs text-gray-400">
              <p>
                <span className="text-gray-500 font-medium">Helpline:</span>{" "}
                <a href="tel:+918130200285" className="text-white hover:text-[#d91a24] font-bold transition-colors">
                  +91 8130200285
                </a>
              </p>
              <p>
                <span className="text-gray-500 font-medium">Support:</span>{" "}
                <a href="mailto:support@fitworks.in" className="text-gray-300 hover:text-white transition-colors">
                  support@fitworks.in
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <a href="https://wa.me/918130200285" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp" className="h-7 px-2.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 text-[11px] font-bold hover:bg-emerald-900 transition-colors">
                WhatsApp Support
              </a>
              <a href="mailto:support@fitworks.in" title="Email Support" className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={heading === "Legal" || heading === "Company" ? "_blank" : undefined}
                      rel={heading === "Legal" || heading === "Company" ? "noopener noreferrer" : undefined}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} FitWorks. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Dumbbell className="w-3 h-3 text-[#c5121c]" /> in India
          </p>
        </div>

      </div>
    </footer>
  );
}
