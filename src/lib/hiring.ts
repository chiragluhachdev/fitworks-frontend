/**
 * The shared vocabulary of the hiring workflow.
 *
 * A gym posts a requirement, the FitWorks team reviews it, finds trainers and
 * makes the introduction. Every screen that names a stage, a plan or a status
 * reads it from here, so the gym dashboard and the admin board can never
 * describe the same record differently.
 */

/* ───────────────────────────── Plans ───────────────────────────── */

export type GymPlanId = "monthly" | "quarterly" | "annual";

export interface GymPlan {
  id: GymPlanId;
  name: string;
  /** Rupees for the whole term. */
  price: number;
  months: number;
  /** How the price reads per month, for comparing terms honestly. */
  perMonth: number;
  cadence: string;
  savingsPercent: number;
  best?: boolean;
}

export type GymPrices = Record<GymPlanId, number>;

/**
 * The shape of what we sell. Prices are set by an admin in Settings, so the
 * numbers here are only what a screen shows before the API answers — never
 * what anyone is charged. The server prices every order itself.
 */
const PLAN_SHAPE: { id: GymPlanId; name: string; months: number; cadence: string; best?: boolean }[] = [
  { id: "monthly", name: "FitWorks Monthly", months: 1, cadence: "per month" },
  // The one we point people at. Annual still shows the larger saving, which
  // is why this is flagged "Recommended" and not "Best value" — the cheaper
  // per-month plan is the annual one and the badge must not claim otherwise.
  { id: "quarterly", name: "FitWorks 3 Months", months: 3, cadence: "per 3 months", best: true },
  { id: "annual", name: "FitWorks Annual", months: 12, cadence: "per year" },
];

export const DEFAULT_GYM_PRICES: GymPrices = { monthly: 199, quarterly: 499, annual: 999 };

/** Applies prices to the fixed shape. Mirrors the server's own derivation. */
export const buildGymPlans = (prices: Partial<GymPrices> = {}): GymPlan[] => {
  const monthlyRate = prices.monthly || DEFAULT_GYM_PRICES.monthly;
  return PLAN_SHAPE.map((shape) => {
    const price = prices[shape.id] ?? DEFAULT_GYM_PRICES[shape.id];
    return {
      ...shape,
      price,
      perMonth: Math.round(price / shape.months),
      savingsPercent: Math.max(0, Math.round((1 - price / shape.months / monthlyRate) * 100)),
    };
  });
};

/** Launch prices, for rendering before the live ones arrive. */
export const FALLBACK_PLANS: GymPlan[] = buildGymPlans();

/**
 * Turns whatever the API returned into plans this app can render.
 *
 * Only the id and the price are taken from the response; everything shown —
 * the per-month figure, the saving — is derived here from the same function
 * every screen uses. So a backend on an older or newer shape can never produce
 * a half-filled card, and two screens can never disagree about the maths.
 *
 * Returns the launch prices when the payload is unusable.
 */
export const normalizeGymPlans = (raw: unknown): GymPlan[] => {
  if (!Array.isArray(raw) || raw.length === 0) return FALLBACK_PLANS;

  const prices: Partial<GymPrices> = {};
  for (const item of raw) {
    const id = (item as { id?: string })?.id as GymPlanId | undefined;
    const price = Number((item as { price?: unknown })?.price);
    if (id && id in DEFAULT_GYM_PRICES && Number.isFinite(price) && price > 0) {
      prices[id] = price;
    }
  }

  return Object.keys(prices).length ? buildGymPlans(prices) : FALLBACK_PLANS;
};

/**
 * What every plan includes.
 *
 * Deliberately identical across all three: the longer terms buy a lower rate,
 * not more product. Nothing is withheld from the cheapest plan.
 */
export const PLAN_FEATURES = [
  "Unlimited vacancy posting",
  "Unlimited hiring requirements",
  "Access to the FitWorks trainer network",
  "Trainer recommendations from our team",
  "Verified trainer profiles only",
  "FitWorks-assisted hiring",
  "Vacancy management",
  "Gym profile",
  "Hiring support",
];

/** Looks a plan up in a priced list, or in the fallback when none is given. */
export const findPlan = (id?: string | null, plans: GymPlan[] = FALLBACK_PLANS) =>
  plans.find((p) => p.id === id) || null;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ─────────────────────── Vacancy status (gym) ─────────────────────── */

export type GymVacancyStatus = "active" | "under_review" | "filled" | "closed";

export const VACANCY_STATUS: Record<
  GymVacancyStatus,
  { label: string; dot: string; chip: string; note: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    chip: "text-emerald-700 bg-emerald-50 border-emerald-200/70",
    note: "Our team is working on this requirement.",
  },
  under_review: {
    label: "Under review",
    dot: "bg-amber-500",
    chip: "text-amber-700 bg-amber-50 border-amber-200/70",
    note: "We're reviewing your requirement and will start the search shortly.",
  },
  filled: {
    label: "Filled",
    dot: "bg-blue-500",
    chip: "text-blue-700 bg-blue-50 border-blue-200/70",
    note: "This role has been filled.",
  },
  closed: {
    label: "Closed",
    dot: "bg-gray-400",
    chip: "text-gray-600 bg-gray-100 border-gray-200",
    note: "This vacancy is closed. Reopen it whenever you're hiring again.",
  },
};

/* ────────────────────── Pipeline stages (admin) ────────────────────── */

export type PipelineStage =
  | "new"
  | "under_review"
  | "finding_trainers"
  | "trainers_shortlisted"
  | "gym_contacted"
  | "connecting"
  | "filled"
  | "closed";

export const PIPELINE: { id: PipelineStage; label: string; chip: string; dot: string }[] = [
  { id: "new", label: "New", chip: "text-red-700 bg-red-50 border-red-200/70", dot: "bg-[#d91a24]" },
  { id: "under_review", label: "Under review", chip: "text-amber-700 bg-amber-50 border-amber-200/70", dot: "bg-amber-500" },
  { id: "finding_trainers", label: "Finding trainers", chip: "text-indigo-700 bg-indigo-50 border-indigo-200/70", dot: "bg-indigo-500" },
  { id: "trainers_shortlisted", label: "Trainers shortlisted", chip: "text-violet-700 bg-violet-50 border-violet-200/70", dot: "bg-violet-500" },
  { id: "gym_contacted", label: "Gym contacted", chip: "text-sky-700 bg-sky-50 border-sky-200/70", dot: "bg-sky-500" },
  { id: "connecting", label: "Connecting", chip: "text-teal-700 bg-teal-50 border-teal-200/70", dot: "bg-teal-500" },
  { id: "filled", label: "Filled", chip: "text-emerald-700 bg-emerald-50 border-emerald-200/70", dot: "bg-emerald-500" },
  { id: "closed", label: "Closed", chip: "text-gray-600 bg-gray-100 border-gray-200", dot: "bg-gray-400" },
];

export const stageMeta = (id?: string) => PIPELINE.find((s) => s.id === id) || PIPELINE[0];

/* ───────────────────── Candidate stages (admin) ───────────────────── */

export type CandidateStage =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "contacted"
  | "interested"
  | "not_interested"
  | "connected"
  | "hired"
  | "rejected";

export const CANDIDATE_STAGE: Record<CandidateStage, { label: string; chip: string }> = {
  applied: { label: "Applied", chip: "text-gray-600 bg-gray-100 border-gray-200" },
  reviewing: { label: "Reviewing", chip: "text-gray-600 bg-gray-100 border-gray-200" },
  shortlisted: { label: "Shortlisted", chip: "text-violet-700 bg-violet-50 border-violet-200/70" },
  contacted: { label: "Contacted", chip: "text-sky-700 bg-sky-50 border-sky-200/70" },
  interested: { label: "Interested", chip: "text-teal-700 bg-teal-50 border-teal-200/70" },
  not_interested: { label: "Not interested", chip: "text-gray-500 bg-gray-100 border-gray-200" },
  connected: { label: "Finalized", chip: "text-amber-700 bg-amber-50 border-amber-200/70" },
  hired: { label: "Hired", chip: "text-emerald-700 bg-emerald-50 border-emerald-200/70" },
  rejected: { label: "Not a fit", chip: "text-gray-500 bg-gray-100 border-gray-200" },
};

export const candidateMeta = (id?: string) =>
  CANDIDATE_STAGE[(id as CandidateStage) || "shortlisted"] || CANDIDATE_STAGE.shortlisted;

/* ───────────────────────────── Helpers ───────────────────────────── */

/** "12 Mar 2026" — short, unambiguous, and the same everywhere. */
export const shortDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** "today", "3 days ago", "2 weeks ago" — for things posted recently. */
export const relativeDate = (value?: string | Date | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days < 14 ? "" : "s"} ago`;
  return shortDate(d);
};
