"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  MoreHorizontal,
  X,
  Search,
  ChevronDown,
  ArrowRight,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

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

/** A card pinned to the foot of the desktop sidebar. */
export interface SidebarPromo {
  title: string;
  body: string;
  href: string;
  image: string;
}

/**
 * Shared shell for the trainer and gym dashboards.
 *
 * Desktop and mobile are deliberately different products. Desktop gets a
 * sidebar plus a top bar carrying identity, search and the account menu.
 * Mobile gets a compact header and a fixed bottom tab bar — thumb-reachable,
 * no hamburger — and none of the desktop chrome, which would eat a third of a
 * phone screen to say things the phone already shows.
 *
 * Scrolling is left to the document rather than a nested overflow container,
 * so mobile browser chrome collapses the way users expect.
 */
export default function DashboardShell({
  navLinks,
  profile,
  menuLabel,
  onLogout,
  roleLabel,
  search,
  promo,
  children,
}: {
  navLinks: DashboardNavLink[];
  profile: DashboardProfile;
  menuLabel: string;
  onLogout: () => void;
  /** "Gym Owner", "Trainer" — shown under the name in the account menu. */
  roleLabel?: string;
  /** Omitted when the dashboard has nothing worth searching. */
  search?: { placeholder: string; onSubmit: (query: string) => void };
  promo?: SidebarPromo;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

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

  // Lock background scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = moreOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  /** Close the account menu on an outside click or Escape. */
  useEffect(() => {
    if (!accountOpen) return;

    const onDown = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  /** ⌘K / Ctrl+K focuses the search, as the hint in it promises. */
  useEffect(() => {
    if (!search) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [search]);

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
          <Link
            href={profile.href}
            className="flex items-center gap-2.5 min-w-0 max-w-[55%] active:opacity-70 transition-opacity"
          >
            <div className="min-w-0 text-right">
              <p className="text-[13px] font-bold text-gray-900 truncate leading-tight">{profile.name}</p>
              {profile.subtitle && <div className="flex justify-end mt-0.5">{profile.subtitle}</div>}
            </div>
            {avatar("w-9 h-9", "rounded-xl")}
          </Link>
        </div>
      </header>

      {/* ───────── Desktop sidebar ───────── */}
      <aside className="hidden md:flex sticky top-0 h-screen w-[268px] shrink-0 bg-white border-r border-gray-200/70 flex-col">
        <div className="px-6 pt-6 pb-5">
          <span className="relative block w-[132px] h-[38px]">
            <Image src="/images/logo.png" alt="FitWorks" fill className="object-contain object-left" priority />
          </span>
        </div>

        <nav aria-label={menuLabel} className="px-3 flex-1 overflow-y-auto">
          <div className="space-y-0.5">
            {navLinks.map(({ name, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={name}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3.5 pl-4 pr-3 py-3 rounded-full text-[14px] font-semibold transition-colors ${
                    active
                      ? "bg-[#FFF1F2] text-[#E92E3D]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-[19px] h-[19px] shrink-0 ${active ? "text-[#E92E3D]" : "text-gray-400"}`}
                  />
                  <span className="leading-tight">{name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {promo && (
          <div className="p-4">
            <Link
              href={promo.href}
              className="group relative block overflow-hidden rounded-2xl bg-gray-900 p-5 pb-16 min-h-[232px]"
            >
              <Image
                src={promo.image}
                alt=""
                fill
                sizes="240px"
                className="object-cover opacity-45 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/10"
              />
              <span className="relative block">
                <span className="block text-[17px] font-extrabold text-white leading-tight tracking-[-0.01em]">
                  {promo.title}
                </span>
                <span className="block text-[12.5px] text-white/65 mt-2 leading-relaxed">{promo.body}</span>
              </span>
              <span className="absolute bottom-5 left-5 w-9 h-9 rounded-full bg-[#E92E3D] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        )}
      </aside>

      {/* ───────── Content ───────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* ── Desktop top bar ── */}
        <header className="hidden md:flex sticky top-0 z-30 h-[74px] items-center gap-5 px-8 bg-[#f7f8fa]/85 backdrop-blur-md">
          <Link href={profile.href} className="flex items-center gap-3 min-w-0 shrink-0 group">
            {avatar("w-11 h-11 text-[15px]", "rounded-full")}
            <span className="min-w-0">
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-gray-900 truncate group-hover:text-[#E92E3D] transition-colors">
                  {profile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </span>
              {profile.subtitle && <span className="block mt-0.5">{profile.subtitle}</span>}
            </span>
          </Link>

          {search ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search.onSubmit(searchRef.current?.value ?? "");
              }}
              className="flex-1 max-w-[520px] mx-auto relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                placeholder={search.placeholder}
                aria-label={search.placeholder}
                className="w-full h-11 pl-11 pr-16 rounded-full bg-white ring-1 ring-gray-200/80 text-[13.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#E92E3D]/30 transition-shadow"
              />
              <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10.5px] font-semibold text-gray-400 bg-gray-100 rounded-md px-1.5 py-0.5 pointer-events-none">
                ⌘K
              </kbd>
            </form>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Account menu — the only way out on desktop now the sidebar
                foot belongs to the promo card. */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                aria-expanded={accountOpen}
                className="flex items-center gap-2.5 h-11 pl-1 pr-3 rounded-full bg-white ring-1 ring-gray-200/80 hover:ring-gray-300 transition-colors cursor-pointer"
              >
                <span className="w-9 h-9 rounded-full bg-[#FFF1F2] text-[#E92E3D] flex items-center justify-center text-[13px] font-extrabold shrink-0">
                  {profile.initial}
                </span>
                <span className="hidden lg:block text-left leading-tight">
                  <span className="block text-[13px] font-bold text-gray-900 max-w-[128px] truncate">
                    {profile.name}
                  </span>
                  {roleLabel && <span className="block text-[11px] text-gray-500">{roleLabel}</span>}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[52px] w-[216px] bg-white rounded-2xl ring-1 ring-gray-200/80 shadow-[0_20px_50px_-16px_rgba(16,24,40,0.28)] overflow-hidden p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href={profile.href}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-gray-400 shrink-0" />
                    Profile &amp; settings
                  </Link>
                  <div className="h-px bg-gray-100 my-1.5 mx-2" />
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-[13.5px] font-semibold text-[#E92E3D] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0">
          <div className="px-4 py-5 pb-28 sm:px-6 md:px-8 md:pt-2 md:pb-10">{children}</div>
        </main>
      </div>

      {/* ───────── Mobile bottom tab bar ───────── */}
      <nav
        aria-label="Dashboard"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 pb-[env(safe-area-inset-bottom)]"
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${primary.length + (needsMore ? 1 : 0)}, minmax(0, 1fr))` }}
        >
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
                <span className="text-[10px] font-bold leading-none tracking-tight">
                  {shortName || name}
                </span>
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
