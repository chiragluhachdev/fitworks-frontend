"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { nextPageViewState } from "@/lib/pageview";

/**
 * Sends a Meta PageView on client-side navigation.
 *
 * The inline pixel snippet only runs on a full page load, and this is an App
 * Router SPA — moving from the homepage to /auth/trainer-signup never reloads,
 * so Meta saw one PageView per visit instead of one per page. That starves
 * retargeting audiences and URL-based custom conversions.
 *
 * Deliberately keyed on pathname alone. Query strings here are state, not new
 * pages (?next= on login, filters on the jobs list), and counting them would
 * inflate the numbers in the other direction.
 */
export default function MetaPixelPageView() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const { track, lastPath: next } = nextPageViewState(lastPath.current, pathname);
    lastPath.current = next;
    if (!track) return;

    // fbq is queue-backed once the snippet has run, so this is safe before the
    // remote script finishes loading.
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") fbq("track", "PageView");
  }, [pathname]);

  return null;
}
