/**
 * The shared vocabulary of the hiring workflow.
 *
 * A gym posts a requirement, the FitWorks team reviews it, finds trainers and
 * makes the introduction. Every screen that names a stage, a plan or a status
 * reads it from here, so the gym dashboard and the admin board can never
 * describe the same record differently.
 */

/* ───────────────────────────── Plans ───────────────────────────── */

export interface GymPlan {
  id: "monthly" | "quarterly" | "annual";
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

const MONTHLY_RATE = 199;

const plan = (
  id: GymPlan["id"],
  name: string,
  price: number,
  months: number,
  cadence: string,
  best = false
): GymPlan => ({
  id,
  name,
  price,
  months,
  cadence,
  perMonth: Math.round(price / months),
  savingsPercent: Math.round((1 - price / months / MONTHLY_RATE) * 100),
  best,
});

export const GYM_PLANS: GymPlan[] = [
  plan("monthly", "FitWorks Monthly", 199, 1, "per month"),
  plan("quarterly", "FitWorks 3 Months", 499, 3, "per 3 months"),
  plan("annual", "FitWorks Annual", 999, 12, "per year", true),
];

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

export const findPlan = (id?: string | null) => GYM_PLANS.find((p) => p.id === id) || null;

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
  | "shared"
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
  shared: { label: "Shared with gym", chip: "text-indigo-700 bg-indigo-50 border-indigo-200/70" },
  connected: { label: "Connected", chip: "text-amber-700 bg-amber-50 border-amber-200/70" },
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
