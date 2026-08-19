"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  UserPlus, 
  User, 
  ShieldCheck,
  Settings, 
  LogOut,
  Menu,
  X,
  Clock
} from "lucide-react";

export default function TrainerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trainerName, setTrainerName] = useState("Rahul Sharma");
  const [verificationStatus, setVerificationStatus] = useState<string>("verified");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("fitworks_token");
      const stored = localStorage.getItem("fitworks_user");
      if (!token || !stored) {
        router.push("/auth");
        return;
      }
      try {
        const u = JSON.parse(stored);
        if (u.role && u.role !== "trainer" && u.role !== "admin") {
          if (u.slug) router.push(`/gym/${u.slug}/dashboard`);
          else router.push("/auth");
          return;
        }
        if (u.fullName) setTrainerName(u.fullName);
      } catch (e) {
        router.push("/auth");
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fitworks_token");
      localStorage.removeItem("fitworks_user");
    }
    router.push("/auth");
  };

  const sidebarLinks = [
    { name: "Overview", href: `/trainer/${trainerSlug}/dashboard`, icon: LayoutDashboard },
    { name: "Find Jobs", href: `/trainer/${trainerSlug}/jobs`, icon: Search },
    { name: "My Applications", href: `/trainer/${trainerSlug}/applications`, icon: Briefcase },
    { name: "Connections", href: `/trainer/${trainerSlug}/connections`, icon: UserPlus },
    { name: "My Profile", href: `/trainer/${trainerSlug}/profile`, icon: User },
    { name: "Verification", href: `/trainer/${trainerSlug}/verification`, icon: ShieldCheck },
    { name: "Settings", href: `/trainer/${trainerSlug}/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/">
          <Image src="/images/logo.png" alt="FitWorks" width={100} height={30} className="object-contain" />
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-1">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200/80 transition-transform duration-300 flex flex-col justify-between shrink-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          <div className="p-6 hidden md:block border-b border-gray-100">
            <Link href="/" className="inline-block">
              <Image src="/images/logo.png" alt="FitWorks" width={115} height={32} className="object-contain" />
            </Link>
            <div className="mt-4 flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-xs shrink-0">
                {trainerName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{trainerName}</p>
                <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Trainer
                </p>
              </div>
            </div>
          </div>

          <div className="px-3 py-4">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Trainer Menu</p>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
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

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-[#d91a24] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-[#d91a24]" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          {children}
        </div>
      </main>

    </div>
  );
}
