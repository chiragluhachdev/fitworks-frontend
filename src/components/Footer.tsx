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
            <div className="flex gap-2">
              <a href="#" className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-700 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-700 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-700 hover:text-white transition-colors">
                <Share2 className="w-3.5 h-3.5" />
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
