"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Briefcase, 
  FileText, 
  Link as LinkIcon, 
  LogOut 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Role guard check for dashboard routes
    if (pathname !== "/admin") {
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/admin");
      } else {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role !== "admin") {
          router.push("/");
        }
      }
    }
  }, [pathname, router]);

  // Don't render until mounted to prevent hydration errors with localStorage
  if (!mounted) return null;

  // Standalone Login Page without Sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  const navLinks = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Trainers", href: "/admin/trainers", icon: Dumbbell },
    { name: "Gyms", href: "/admin/gyms", icon: Dumbbell },
    { name: "Vacancies", href: "/admin/vacancies", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Connections", href: "/admin/connections", icon: LinkIcon },
  ];

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-neutral-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <span className="bg-primary text-black w-8 h-8 flex items-center justify-center rounded-md text-lg font-black">F</span>
            FitWorks <span className="text-primary font-mono text-sm ml-1 px-1.5 py-0.5 rounded bg-primary/10">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-black" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-neutral-950">
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
