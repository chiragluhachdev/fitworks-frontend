import { FALLBACK_PLANS, normalizeGymPlans, type GymPlan } from "./hiring";

/**
 * Server-side reads of our own API.
 *
 * The browser talks to "/api", which next.config rewrites to the backend. That
 * relative path is meaningless on the server, so this resolves the same origin
 * the rewrite uses.
 */
const backendOrigin = () =>
  process.env.API_PROXY_ORIGIN || "https://fitworks-backend-production.up.railway.app";

/**
 * Membership plans at today's prices, for public pages.
 *
 * Revalidated every few minutes rather than on every request: prices change
 * about once a quarter, and the pricing page should stay static and fast.
 * Falls back to the launch prices if the API is unreachable or answers in a
 * shape we don't recognise. This runs at build time as well as at runtime, so
 * it must never throw: a deploy that fails because the backend was mid-restart
 * is a worse outcome than a page showing last quarter's prices.
 */
export async function fetchGymPlans(): Promise<GymPlan[]> {
  try {
    const res = await fetch(`${backendOrigin()}/api/gyms/plans`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK_PLANS;
    const json = await res.json();
    return normalizeGymPlans(json?.data);
  } catch {
    return FALLBACK_PLANS;
  }
}
