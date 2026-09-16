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
 * FitWorks is free for trainers, so the only thing that blocks access is an
 * explicit rejection. A pending review does not.
 */
export const getTrainerLock = (verificationStatus: string | undefined): LockInfo | null => {
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
