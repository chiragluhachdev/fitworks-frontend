"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal, X, type LucideIcon } from "lucide-react";

export interface DashboardNavLink {
  name: string;
  /** Shorter label used in the mobile tab bar. Falls back to `name`. */
  shortName?: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardProfile {
  name: string;
  subtitle?: React.ReactNode;
  image?: string;
  initial: string;
  href: string;
}

/**
 * Shared shell for the trainer and gym dashboards.
 *
 * Mobile gets a fixed bottom tab bar (thumb-reachable, no hamburger needed for
 * the primary destinations) plus a "More" sheet for the rest. Desktop keeps a
 * conventional sidebar. Scrolling is left to the document rather than a nested
 * overflow container, so mobile browser chrome collapses the way users expect.
 */
export default function DashboardShell({
  navLinks,
  profile,
  menuLabel,
  onLogout,
  children,
}: {
  navLinks: DashboardNavLink[];
  profile: DashboardProfile;
  menuLabel: string;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // The longest nav href the current path sits under wins. Without this,
  // "/vacancies" would light up alongside "/vacancies/new" and both links
  // would look selected at once.
  const bestMatch = navLinks
    .map((l) => l.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  const isActive = (href: string) => href === bestMatch;

  // Five tabs fit across a phone. Up to five destinations therefore all get
  // one, and "More" only appears when there is genuinely something it has to
  // hold — a sheet in front of a single link is a tap for nothing.
  const FITS = 5;
  const needsMore = navLinks.length > FITS;
  const primary = needsMore ? navLinks.slice(0, FITS - 1) : navLinks;
  const secondary = needsMore ? navLinks.slice(FITS - 1) : [];
  const secondaryActive = secondary.some((l) => isActive(l.href));

  // Lock background scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = moreOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  const avatar = (size: string, rounded: string) =>
    profile.image ? (
      <div className={`${size} ${rounded} overflow-hidden border-2 border-red-100 relative shrink-0`}>
        <Image src={profile.image} alt={profile.name} fill className="object-cover" />
      </div>
    ) : (
      <div
        className={`${size} ${rounded} bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black shrink-0`}
      >
        {profile.initial}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f7f8fa] md:flex">
      {/* ───────── Mobile top bar ───────── */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" aria-label="FitWorks home" className="relative w-[104px] h-[30px] shrink-0">
            <Image src="/images/logo.png" alt="FitWorks" fill className="object-contain object-left" priority />
          </Link>
          <Link href={profile.href} className="flex items-center gap-2.5 min-w-0 max-w-[55%] active:opacity-70 transition-opacity">
            <div className="min-w-0 text-right">
              <p className="text-[13px] font-bold text-gray-900 truncate leading-tight">{profile.name}</p>
              {profile.subtitle && <div className="flex justify-end mt-0.5">{profile.subtitle}</div>}
            </div>
            {avatar("w-9 h-9", "rounded-xl")}
          </Link>
        </div>
      </header>

      {/* ───────── Desktop sidebar ───────── */}
      <aside className="hidden md:flex sticky top-0 h-screen w-[264px] shrink-0 bg-white border-r border-gray-200/80 flex-col justify-between">
        <div className="min-h-0 flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <Link href="/" aria-label="FitWorks home" className="relative block w-[115px] h-[32px] mb-4">
              <Image src="/images/logo.png" alt="FitWorks" fill className="object-contain object-left" priority />
            </Link>

            <Link
              href={profile.href}
              className="flex items-center gap-3 p-2.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-200/60 transition-all group"
            >
              {avatar("w-12 h-12 text-lg group-hover:scale-105 transition-transform", "rounded-2xl")}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-gray-900 truncate group-hover:text-[#d91a24] transition-colors">
                  {profile.name}
                </p>
                {profile.subtitle && <div className="mt-1">{profile.subtitle}</div>}
              </div>
            </Link>
          </div>

          <nav className="px-3 py-4 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{menuLabel}</p>
            <div className="space-y-1">
              {navLinks.map(({ name, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-[#d91a24] text-white shadow-sm shadow-red-500/20"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-gray-400"}`} />
                    {name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-[#d91a24] transition-all cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-[#d91a24]" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ───────── Content ───────── */}
      <main className="flex-1 min-w-0">
        <div className="px-4 py-5 pb-28 sm:px-6 md:px-8 md:py-8 md:pb-8">{children}</div>
      </main>

      {/* ───────── Mobile bottom tab bar ───────── */}
      <nav
        aria-label="Dashboard"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid" style={{ gridTemplateColumns: `repeat(${primary.length + (needsMore ? 1 : 0)}, minmax(0, 1fr))` }}>
          {primary.map(({ name, shortName, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={name}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[58px] transition-colors ${
                  active ? "text-[#d91a24]" : "text-gray-400 active:text-gray-600"
                }`}
              >
                <Icon className={`w-[22px] h-[22px] ${active ? "stroke-[2.4]" : ""}`} />
                <span className="text-[10px] font-bold leading-none tracking-tight">{shortName || name}</span>
              </Link>
            );
          })}

          {needsMore && (
            <button
              onClick={() => setMoreOpen(true)}
              aria-label="More menu"
              className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[58px] transition-colors ${
                secondaryActive ? "text-[#d91a24]" : "text-gray-400 active:text-gray-600"
              }`}
            >
              <MoreHorizontal className="w-[22px] h-[22px]" />
              <span className="text-[10px] font-bold leading-none tracking-tight">More</span>
            </button>
          )}
        </div>
      </nav>

      {/* ───────── Mobile "More" sheet ───────── */}
      {moreOpen && needsMore && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-250">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-900">{menuLabel}</h2>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 active:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {secondary.map(({ name, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={name}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-colors ${
                      active ? "bg-[#d91a24] text-white" : "text-gray-700 active:bg-gray-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-gray-400"}`} />
                    {name}
                  </Link>
                );
              })}

              <button
                onClick={onLogout}
                className="flex items-center gap-3.5 px-4 py-3.5 w-full rounded-2xl text-[15px] font-semibold text-[#d91a24] active:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
