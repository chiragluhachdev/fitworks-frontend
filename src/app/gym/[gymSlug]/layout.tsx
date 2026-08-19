"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  Users, 
  Building2, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MapPin
} from "lucide-react";

export default function GymDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [gymData, setGymData] = useState<{
    gymName: string;
    gymLogo: string;
    city: string;
    locations: number;
  }>({
    gymName: "PowerFit Studio",
    gymLogo: "",
    city: "Mumbai",
    locations: 1,
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
        if (u.role && u.role !== "gym" && u.role !== "admin") {
          if (u.slug) router.push(`/trainer/${u.slug}/dashboard`);
          else router.push("/auth");
          return;
        }
      } catch (e) {
        router.push("/auth");
      }
    }

    const fetchGymProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/gyms/${gymSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const g = json.data;
          setGymData({
            gymName: g.gymName || "FitWorks Gym",
            gymLogo: g.gymLogo || "",
            city: g.address?.city || "",
            locations: g.numberOfLocations || 1,
          });
        }
      } catch (err) {
        console.error("Layout gym fetch error:", err);
      }
    };

    fetchGymProfile();
  }, [router, gymSlug]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fitworks_token");
      localStorage.removeItem("fitworks_user");
    }
    router.push("/auth");
  };

  const sidebarLinks = [
    { name: "Overview", href: `/gym/${gymSlug}/dashboard`, icon: LayoutDashboard },
    { name: "Find Trainers", href: `/gym/${gymSlug}/find-trainers`, icon: Search },
    { name: "My Vacancies", href: `/gym/${gymSlug}/vacancies`, icon: Briefcase },
    { name: "Applications & Hires", href: `/gym/${gymSlug}/shortlisted`, icon: Users },
    { name: "Gym Profile", href: `/gym/${gymSlug}/profile`, icon: Building2 },
    { name: "Settings", href: `/gym/${gymSlug}/settings`, icon: Settings },
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
          {/* Logo & Dynamic Gym Profile Header */}
          <div className="p-5 border-b border-gray-100">
            <Link href="/" className="inline-block mb-3">
              <Image src="/images/logo.png" alt="FitWorks" width={115} height={32} className="object-contain" priority />
            </Link>

            {/* Dynamic Gym Profile Card */}
            <Link 
              href={`/gym/${gymSlug}/profile`}
              className="mt-2 flex items-center gap-3 p-2.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-200/60 transition-all group cursor-pointer"
            >
              {gymData.gymLogo ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-red-100 relative shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image 
                    src={gymData.gymLogo} 
                    alt={gymData.gymName} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black text-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {gymData.gymName?.charAt(0) || "G"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#d91a24] transition-colors">
                  {gymData.gymName}
                </p>
                <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                  {gymData.city || "India"} • {gymData.locations} Branch{gymData.locations > 1 ? "es" : ""}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Gym Menu</p>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href.includes("/vacancies") && pathname.includes("/vacancies"));
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
