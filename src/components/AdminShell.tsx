"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Briefcase, 
  FileText, 
  Link2, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Building2, 
  ExternalLink 
} from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Role guard check for dashboard routes
    if (pathname !== "/admin") {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const userStr = localStorage.getItem("fitworks_user") || localStorage.getItem("user");
      
      if (!token || !userStr) {
        router.push("/admin");
      } else {
        try {
          const user = JSON.parse(userStr);
          if (user.role !== "admin") {
            router.push("/");
          }
        } catch {
          router.push("/admin");
        }
      }
    }
  }, [pathname, router]);

  if (!mounted) return null;

  // Standalone Login Page without Sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("fitworks_token");
    localStorage.removeItem("fitworks_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  const navLinks = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Trainers", href: "/admin/trainers", icon: Dumbbell },
    { name: "Gyms", href: "/admin/gyms", icon: Building2 },
    { name: "Vacancies", href: "/admin/vacancies", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Connections", href: "/admin/connections", icon: Link2 },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col md:flex-row text-gray-900 font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="FitWorks" width={100} height={28} className="object-contain" />
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#d91a24] border border-red-200/60 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200/80 transition-transform duration-300 flex flex-col justify-between shrink-0 shadow-sm
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          {/* Logo & Admin Status */}
          <div className="p-6 hidden md:block border-b border-gray-100">
            <Link href="/" className="inline-block">
              <Image src="/images/logo.png" alt="FitWorks" width={115} height={32} className="object-contain" />
            </Link>
            
            <div className="mt-4 flex items-center gap-2.5 px-3 py-2 bg-red-50/70 rounded-xl border border-red-100">
              <div className="w-7 h-7 rounded-lg bg-[#d91a24] text-white flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">FitWorks Admin</p>
                <p className="text-[10px] text-gray-500 font-medium">Super Administrator</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="px-3 py-4">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Management
            </p>
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin/dashboard");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? "bg-[#d91a24] text-white shadow-sm shadow-red-500/20" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Public Website
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Live</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f9fafb]">
        {/* Top Header Bar on Desktop */}
        <header className="hidden md:flex bg-white border-b border-gray-200/80 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold capitalize">
              {pathname.split("/")[2] || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Production
            </span>
            <div className="text-xs text-gray-400 font-medium border-l border-gray-200 pl-3">
              FitWorks v1.0
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
