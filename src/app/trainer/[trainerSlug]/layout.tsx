"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  UserPlus,
  User,
  ShieldCheck,
  CreditCard,
  Settings,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

const VERIFICATION_BADGE: Record<string, { label: string; className: string; Icon: typeof Clock }> = {
  verified: {
    label: "Verified",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
    Icon: ShieldCheck,
  },
  pending: {
    label: "Pending review",
    className: "text-amber-700 bg-amber-50 border-amber-200/60",
    Icon: Clock,
  },
  rejected: {
    label: "Unverified",
    className: "text-red-700 bg-red-50 border-red-200/60",
    Icon: AlertCircle,
  },
};

export default function TrainerDashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const trainerSlug = (params?.trainerSlug as string) || "";

  const [trainer, setTrainer] = useState({
    fullName: "",
    profilePhoto: "",
    verificationStatus: "pending",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("fitworks_token");
    const stored = localStorage.getItem("fitworks_user");
    if (!token || !stored) {
      router.push("/auth");
      return;
    }
    try {
      const u = JSON.parse(stored);
      if (u.role && u.role !== "trainer" && u.role !== "admin") {
        router.push(u.slug ? `/gym/${u.slug}/dashboard` : "/auth");
        return;
      }
    } catch {
      router.push("/auth");
      return;
    }

    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/trainers/${trainerSlug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setTrainer({
            fullName: json.data.personal?.fullName || "Trainer",
            profilePhoto: json.data.personal?.profilePhoto || "",
            verificationStatus: json.data.verificationStatus || "pending",
          });
        }
      } catch (err) {
        console.error("Layout trainer fetch error:", err);
      }
    })();
  }, [router, trainerSlug]);

  const handleLogout = () => {
    localStorage.removeItem("fitworks_token");
    localStorage.removeItem("fitworks_user");
    router.push("/auth");
  };

  const navLinks = [
    { name: "Overview", shortName: "Home", href: `/trainer/${trainerSlug}/dashboard`, icon: LayoutDashboard },
    { name: "Find Jobs", shortName: "Jobs", href: `/trainer/${trainerSlug}/jobs`, icon: Search },
    { name: "My Applications", shortName: "Applied", href: `/trainer/${trainerSlug}/applications`, icon: Briefcase },
    { name: "Connections", shortName: "Invites", href: `/trainer/${trainerSlug}/connections`, icon: UserPlus },
    { name: "My Profile", href: `/trainer/${trainerSlug}/profile`, icon: User },
    { name: "Verification", href: `/trainer/${trainerSlug}/verification`, icon: ShieldCheck },
    { name: "Membership", href: `/trainer/${trainerSlug}/subscription`, icon: CreditCard },
    { name: "Settings", href: `/trainer/${trainerSlug}/settings`, icon: Settings },
  ];

  const badge = VERIFICATION_BADGE[trainer.verificationStatus];

  return (
    <DashboardShell
      menuLabel="Trainer Menu"
      onLogout={handleLogout}
      navLinks={navLinks}
      profile={{
        name: trainer.fullName || "Your Profile",
        initial: trainer.fullName?.charAt(0)?.toUpperCase() || "T",
        image: trainer.profilePhoto || undefined,
        href: `/trainer/${trainerSlug}/profile`,
        subtitle: badge ? (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}
          >
            <badge.Icon className="w-3 h-3 shrink-0" />
            {badge.label}
          </span>
        ) : undefined,
      }}
    >
      {children}
    </DashboardShell>
  );
}
