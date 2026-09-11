"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Loader2,
  UserX,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { loginPathFor, readStoredUser } from "@/lib/session";

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

  // "loading" until the profile is confirmed to exist. Never assume a status —
  // a deleted trainer's URL used to render a full dashboard shell, and every
  // page briefly claimed "Pending review" before the fetch came back.
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [trainer, setTrainer] = useState<{
    fullName: string;
    profilePhoto: string;
    verificationStatus: string | null;
  }>({ fullName: "", profilePhoto: "", verificationStatus: null });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("fitworks_token");
    const me = readStoredUser();
    if (!token || !me) {
      // Keep the destination so a link shared over WhatsApp still lands there
      // after signing in, instead of dumping them on a dashboard.
      router.replace(loginPathFor(window.location.pathname));
      return;
    }

    // These pages are the trainer's own workspace, nobody else's. Admins review
    // trainers through the admin panel, which has the full record; letting them
    // walk in here shows them a dashboard wired to someone else's session.
    if (me.role === "admin") {
      router.replace("/admin/trainers");
      return;
    }
    if (me.role === "gym") {
      router.replace(me.slug ? `/gym/${me.slug}/dashboard` : "/auth");
      return;
    }
    if (me.role !== "trainer") {
      router.replace("/auth");
      return;
    }
    if (me.slug && me.slug !== trainerSlug) {
      router.replace(`/trainer/${me.slug}/dashboard`);
      return;
    }

    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/trainers/${trainerSlug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setState("missing");
          return;
        }

        const json = await res.json();
        if (json.success && json.data) {
          setTrainer({
            fullName: json.data.personal?.fullName || "Trainer",
            profilePhoto: json.data.personal?.profilePhoto || "",
            verificationStatus: json.data.verificationStatus || null,
          });
          setState("ready");
        } else {
          setState("missing");
        }
      } catch (err) {
        console.error("Layout trainer fetch error:", err);
        // A network blip is not a deleted account — keep the shell, leave the
        // badge blank rather than inventing a status.
        setState("ready");
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

  if (state === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
        <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading your workspace…</p>
      </div>
    );
  }

  // The profile behind this URL is gone. Say so plainly instead of rendering an
  // empty dashboard that looks like the account still exists.
  if (state === "missing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-8 text-center">
          <span className="w-14 h-14 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center mx-auto mb-4">
            <UserX className="w-7 h-7" />
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 mb-2">This trainer profile no longer exists</h1>
          <p className="text-[13px] text-gray-500 leading-relaxed mb-7">
            The profile at <span className="font-semibold text-gray-700">/{trainerSlug}</span> has been
            removed from FitWorks. If this is your account, please sign in again.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleLogout}
              className="flex-1 h-12 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Sign in again
            </button>
            <Link
              href="/"
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-800 text-sm font-bold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Back to FitWorks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const badge = trainer.verificationStatus ? VERIFICATION_BADGE[trainer.verificationStatus] : undefined;

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
