"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Settings,
  MapPin,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { loginPathFor, readStoredUser } from "@/lib/session";

export default function GymDashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const gymSlug = (params?.gymSlug as string) || "";

  const [gym, setGym] = useState({ gymName: "", gymLogo: "", city: "", locations: 1 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("fitworks_token");
    const me = readStoredUser();
    if (!token || !me) {
      router.replace(loginPathFor(window.location.pathname));
      return;
    }

    // Same rule as the trainer side: this is one gym's own workspace. Admins
    // review gyms from the admin panel.
    if (me.role === "admin") {
      router.replace("/admin/gyms");
      return;
    }
    if (me.role === "trainer") {
      router.replace(me.slug ? `/trainer/${me.slug}/dashboard` : "/auth");
      return;
    }
    if (me.role !== "gym") {
      router.replace("/auth");
      return;
    }
    // A gym could previously open any other gym's dashboard by slug.
    if (me.slug && me.slug !== gymSlug) {
      router.replace(`/gym/${me.slug}/dashboard`);
      return;
    }

    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/gyms/${gymSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setGym({
            gymName: json.data.gymName || "FitWorks Gym",
            gymLogo: json.data.gymLogo || "",
            city: json.data.address?.city || "",
            locations: json.data.numberOfLocations || 1,
          });
        }
      } catch (err) {
        console.error("Layout gym fetch error:", err);
      }
    })();
  }, [router, gymSlug]);

  const handleLogout = () => {
    localStorage.removeItem("fitworks_token");
    localStorage.removeItem("fitworks_user");
    router.push("/auth");
  };

  const navLinks = [
    { name: "Overview", shortName: "Home", href: `/gym/${gymSlug}/dashboard`, icon: LayoutDashboard },
    { name: "My Vacancies", shortName: "Jobs", href: `/gym/${gymSlug}/vacancies`, icon: Briefcase },
    { name: "Applications & Hires", shortName: "Applied", href: `/gym/${gymSlug}/shortlisted`, icon: Users },
    { name: "Gym Profile", href: `/gym/${gymSlug}/profile`, icon: Building2 },
    { name: "Settings", href: `/gym/${gymSlug}/settings`, icon: Settings },
  ];

  return (
    <DashboardShell
      menuLabel="Gym Menu"
      onLogout={handleLogout}
      navLinks={navLinks}
      profile={{
        name: gym.gymName || "Your Gym",
        initial: gym.gymName?.charAt(0)?.toUpperCase() || "G",
        image: gym.gymLogo || undefined,
        href: `/gym/${gymSlug}/profile`,
        subtitle: (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            {gym.city || "India"} • {gym.locations} Branch{gym.locations > 1 ? "es" : ""}
          </span>
        ),
      }}
    >
      {children}
    </DashboardShell>
  );
}
