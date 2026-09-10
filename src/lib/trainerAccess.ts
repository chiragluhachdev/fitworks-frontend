import type { LockInfo } from "@/components/dashboard/AccessLocked";
import type { SubscriptionState } from "@/components/dashboard/SubscriptionBanner";

/** The slice of a trainer record a gated page needs to render its lock. */
export interface LockablePersonal {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface LockableTrainer {
  personal?: LockablePersonal;
  verificationStatus?: string;
  subscription?: { cyclesPaid?: number };
}

/**
 * Client-side mirror of the server's getJobAccess (backend/src/utils/subscription.ts).
 *
 * The server is still the authority — it refuses to return vacancies or accept
 * an application on its own. This exists so a page that has already fetched the
 * trainer record can show the right lock screen without a second round trip,
 * and so every surface words it identically.
 *
 * Two gates, checked in the order they have to be cleared: an admin approves the
 * profile, then the membership is paid. Verification comes first because paying
 * cannot fix a rejected profile.
 */
export const getTrainerLock = (
  verificationStatus: string | undefined,
  subscription: SubscriptionState | null | undefined
): LockInfo | null => {
  const membershipActive = Boolean(subscription?.isActive);

  if (verificationStatus === "pending") {
    return {
      reason: "pending_review",
      title: "Your profile is under review",
      message:
        "Our team is checking your documents. Once approved, gym vacancies unlock here — usually within 24 hours.",
      membershipActive,
    };
  }

  if (verificationStatus === "rejected") {
    return {
      reason: "rejected",
      title: "Your profile needs attention",
      message:
        "We couldn't verify the documents you submitted. Re-upload a valid certificate and a clear government ID to get approved.",
      membershipActive,
    };
  }

  if (!membershipActive) {
    return {
      reason: "subscription_inactive",
      title: "Activate your membership",
      message:
        "FitWorks is a paid platform for trainers. Activate your ₹99/month membership to browse vacancies, apply to roles and be discovered by hiring gyms.",
      membershipActive: false,
      hasLapsed: (subscription?.cyclesPaid ?? 0) > 0,
    };
  }

  return null;
};
