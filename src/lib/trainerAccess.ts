import type { LockInfo } from "@/components/dashboard/AccessLocked";
import type { ActivationState } from "@/components/dashboard/ActivationBanner";

/** The slice of a trainer record a gated page needs to render its lock. */
export interface LockablePersonal {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface LockableTrainer {
  personal?: LockablePersonal;
  verificationStatus?: string;
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
 * profile, then the one-time ₹99 is paid. Verification comes first because
 * paying cannot fix a rejected profile.
 */
export const getTrainerLock = (
  verificationStatus: string | undefined,
  activation: ActivationState | null | undefined
): LockInfo | null => {
  const isActivated = Boolean(activation?.isActive);

  if (verificationStatus === "pending") {
    return {
      reason: "pending_review",
      title: "Your profile is under review",
      message:
        "Our team is checking your documents. Once approved, gym vacancies unlock here — usually within 24 hours.",
      isActivated,
    };
  }

  if (verificationStatus === "rejected") {
    return {
      reason: "rejected",
      title: "Your profile needs attention",
      message:
        "We couldn't verify the documents you submitted. Re-upload a valid certificate and a clear government ID to get approved.",
      isActivated,
    };
  }

  if (!isActivated) {
    return {
      reason: "not_activated",
      title: "Activate your profile",
      message:
        "FitWorks charges trainers a one-time ₹99 to activate. Pay once and your profile stays live — browse vacancies, apply to roles and get discovered by hiring gyms, with nothing more to pay later.",
      isActivated: false,
    };
  }

  return null;
};
