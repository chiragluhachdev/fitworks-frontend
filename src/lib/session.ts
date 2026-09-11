export interface StoredUser {
  role?: "gym" | "trainer" | "admin";
  slug?: string;
}

/**
 * Where a signed-in user belongs. Null when there is nowhere valid to send them
 * — a trainer or gym whose profile has been deleted has no dashboard, and
 * guessing a slug would drop them into someone else's URL.
 */
export const dashboardPath = (user: StoredUser | null | undefined): string | null => {
  if (!user?.role) return null;
  if (user.role === "admin") return "/admin/dashboard";
  if (!user.slug) return null;
  return user.role === "gym" ? `/gym/${user.slug}/dashboard` : `/trainer/${user.slug}/dashboard`;
};

/**
 * Sanitises a ?next= value before we navigate to it.
 *
 * Only same-site absolute paths are allowed. Without this, `?next=//evil.com`
 * or `?next=https://evil.com` would turn our own login into an open redirect
 * that phishers can point at from a link that genuinely starts with fitworks.in.
 */
export const safeNextPath = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  let value = raw.trim();
  if (!value.startsWith("/")) return null;
  // "//host" and "/\host" are protocol-relative URLs, not local paths.
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  try {
    value = decodeURI(value);
  } catch {
    return null;
  }
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  // Never bounce back into the auth pages — that loops.
  if (value === "/auth" || value.startsWith("/auth/")) return null;
  return value;
};

/** Reads the stored session. Returns null when signed out or the blob is junk. */
export const readStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("fitworks_token");
  const stored = localStorage.getItem("fitworks_user");
  if (!token || !stored) return null;
  try {
    return JSON.parse(stored) as StoredUser;
  } catch {
    return null;
  }
};

/** Path to send someone to when they need to sign in to reach `current`. */
export const loginPathFor = (current: string): string =>
  `/auth?next=${encodeURIComponent(current)}`;
