export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
  /** Ready to show a user. Empty when the call succeeded. */
  error: string;
}

/** Seconds the server asked us to wait, from Retry-After or a body field. */
const retryAfterSeconds = (res: Response, body: Record<string, unknown>): number | null => {
  const header = Number(res.headers.get("retry-after"));
  if (Number.isFinite(header) && header > 0) return header;
  const fromBody = Number((body as { retryAfter?: unknown }).retryAfter);
  return Number.isFinite(fromBody) && fromBody > 0 ? fromBody : null;
};

const waitPhrase = (seconds: number): string => {
  if (seconds < 90) return `about ${Math.ceil(seconds)} seconds`;
  const mins = Math.ceil(seconds / 60);
  return `about ${mins} minute${mins === 1 ? "" : "s"}`;
};

/**
 * fetch + JSON parsing that never misreports why something failed.
 *
 * Calling res.json() directly throws on any non-JSON response — a rate limiter
 * replying in text, a gateway's HTML error page, a proxy interstitial — and the
 * surrounding catch then blames the user's connection. A real trainer coming
 * from an Instagram ad hit exactly that: a 429 shown as "Network error. Please
 * try again.", which is neither true nor actionable.
 *
 * Every failure here resolves with a message that matches the real cause.
 */
export async function apiFetch<T = Record<string, unknown>>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    // The only case that is genuinely the connection.
    return {
      ok: false,
      status: 0,
      data: {} as T,
      error: "Couldn't reach FitWorks. Please check your internet connection and try again.",
    };
  }

  const raw = await res.text().catch(() => "");
  let body: Record<string, unknown> = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    body = {};
  }
  const serverMessage = typeof body.message === "string" ? body.message : "";

  if (res.ok) {
    return { ok: true, status: res.status, data: body as T, error: "" };
  }

  if (res.status === 429) {
    const wait = retryAfterSeconds(res, body);
    return {
      ok: false,
      status: res.status,
      data: body as T,
      error:
        serverMessage ||
        `Too many attempts from your network. Please try again in ${wait ? waitPhrase(wait) : "a few minutes"}.`,
    };
  }

  if (res.status >= 500) {
    return {
      ok: false,
      status: res.status,
      data: body as T,
      error: serverMessage || "FitWorks is busy right now. Please try again in a moment.",
    };
  }

  return {
    ok: false,
    status: res.status,
    data: body as T,
    error: serverMessage || `Something went wrong (error ${res.status}). Please try again.`,
  };
}
