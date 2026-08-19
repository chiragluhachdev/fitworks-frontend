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
  Clock, 
  AlertCircle 
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
  const [trainerData, setTrainerData] = useState<{
    fullName: string;
    profilePhoto: string;
    verificationStatus: string;
    city: string;
    title: string;
  }>({
    fullName: "Rahul Sharma",
    profilePhoto: "",
    verificationStatus: "verified",
    city: "Mumbai",
    title: "Fitness Coach",
  });

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
      } catch (e) {
        router.push("/auth");
      }
    }

    // Fetch live trainer profile details
    const fetchTrainerProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/trainers/${trainerSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const t = json.data;
          setTrainerData({
            fullName: t.personal?.fullName || "Trainer",
            profilePhoto: t.personal?.profilePhoto || "",
            verificationStatus: t.verificationStatus || "pending",
            city: t.personal?.city || "",
            title: t.professional?.professionalTitle || "Fitness Professional",
          });
        }
      } catch (err) {
        console.error("Layout trainer fetch error:", err);
      }
    };

    fetchTrainerProfile();
  }, [router, trainerSlug]);

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
          <Image src="/images/logo.png" alt="FitWorks" width={100} height={30} className="object-contain" priority />
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-1 cursor-pointer">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200/80 transition-transform duration-300 flex flex-col justify-between shrink-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          {/* Logo & Dynamic Trainer Profile Header */}
          <div className="p-5 border-b border-gray-100">
            <Link href="/" className="inline-block mb-3">
              <Image src="/images/logo.png" alt="FitWorks" width={115} height={32} className="object-contain" priority />
            </Link>

            {/* Dynamic Trainer Profile Block */}
            <Link 
              href={`/trainer/${trainerSlug}/profile`}
              className="mt-2 flex items-center gap-3 p-2.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-200/60 transition-all group cursor-pointer"
            >
              {/* Profile Photo / Avatar */}
              {trainerData.profilePhoto ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-red-100 relative shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image 
                    src={trainerData.profilePhoto} 
                    alt={trainerData.fullName} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black text-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {trainerData.fullName?.charAt(0) || "T"}
                </div>
              )}

              {/* Info & Dynamic Verification Badge */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#d91a24] transition-colors">
                  {trainerData.fullName}
                </p>
                
                {trainerData.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5 border border-emerald-200/60">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    Verified
                  </span>
                )}

                {trainerData.verificationStatus === "pending" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-0.5 border border-amber-200/60">
                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                    Pending
                  </span>
                )}

                {trainerData.verificationStatus === "rejected" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full mt-0.5 border border-red-200/60">
                    <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
                    Unverified
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
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

        {/* Bottom Log out */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-[#d91a24] transition-all cursor-pointer group"
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
            onClick={() => setIsMobileMenuOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
          />
        )}
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
