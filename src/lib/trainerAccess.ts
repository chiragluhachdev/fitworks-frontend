import type { LockInfo } from "@/components/dashboard/AccessLocked";

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
 * Client-side mirror of the server's getJobAccess.
 *
 * Verification is the gate, and it is free: an approved profile is active, and
 * anything before approval is not.
 */
export const getTrainerLock = (verificationStatus: string | undefined): LockInfo | null => {
  if (verificationStatus === "pending") {
    return {
      reason: "pending_review",
      title: "Your profile is under review",
      message:
        "Our team is checking the documents you uploaded. Once approved, your profile goes active and every gym vacancy unlocks here — usually within 24 hours.",
    };
  }

  if (verificationStatus === "rejected") {
    return {
      reason: "rejected",
      title: "Your profile needs attention",
      message:
        "We couldn't verify the documents you submitted. Re-upload a valid certificate and a clear government ID to get approved.",
    };
  }

  return null;
};
