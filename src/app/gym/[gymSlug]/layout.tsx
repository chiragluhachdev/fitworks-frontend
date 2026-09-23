"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, Plus, CreditCard, Building2, MapPin } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { loginPathFor, readStoredUser } from "@/lib/session";
import { api } from "@/lib/api";

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
      const res = await api<{ data?: any }>(`/gyms/${gymSlug}`);
      if (res.ok && res.data?.data) {
        const g = res.data.data;
        setGym({
          gymName: g.gymName || "Your Gym",
          gymLogo: g.gymLogo || "",
          city: g.address?.city || "",
          locations: g.numberOfLocations || 1,
        });
      }
    })();
  }, [router, gymSlug]);

  const handleLogout = () => {
    localStorage.removeItem("fitworks_token");
    localStorage.removeItem("fitworks_user");
    router.push("/auth");
  };

  // Five destinations, which is exactly what fits across a phone — so every
  // one of them gets a tab and nothing hides behind a "More" sheet.
  const navLinks = [
    { name: "Overview", shortName: "Home", href: `/gym/${gymSlug}/dashboard`, icon: LayoutDashboard },
    { name: "My Vacancies", shortName: "Vacancies", href: `/gym/${gymSlug}/vacancies`, icon: Briefcase },
    { name: "Post a Vacancy", shortName: "Post", href: `/gym/${gymSlug}/vacancies/new`, icon: Plus },
    { name: "Subscription", shortName: "Plan", href: `/gym/${gymSlug}/subscription`, icon: CreditCard },
    { name: "Profile & Settings", shortName: "Profile", href: `/gym/${gymSlug}/profile`, icon: Building2 },
  ];

  return (
    <DashboardShell
      menuLabel="Gym Menu"
      onLogout={handleLogout}
      navLinks={navLinks}
      roleLabel="Gym Owner"
      // Searching runs on the vacancies screen, which already filters on
      // exactly these fields — so the bar hands the query over rather than
      // re-implementing it.
      search={{
        placeholder: "Search your vacancies by role, city or specialization…",
        onSubmit: (query) => {
          const q = query.trim();
          router.push(`/gym/${gymSlug}/vacancies${q ? `?q=${encodeURIComponent(q)}` : ""}`);
        },
      }}
      promo={{
        title: "Build a stronger team",
        body: "Find verified fitness professionals with FitWorks.",
        href: `/gym/${gymSlug}/vacancies/new`,
        image: "/images/gym_team.jpg",
      }}
      profile={{
        name: gym.gymName || "Your Gym",
        initial: gym.gymName?.charAt(0)?.toUpperCase() || "G",
        image: gym.gymLogo || undefined,
        href: `/gym/${gymSlug}/profile`,
        subtitle: (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
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
