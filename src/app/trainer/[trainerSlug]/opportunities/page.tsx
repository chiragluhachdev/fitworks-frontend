"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * The opportunities page has been removed — trainers don't browse jobs.
 * FitWorks contacts trainers directly. Redirect to the dashboard.
 */
export default function TrainerOpportunitiesRedirect() {
  const params = useParams();
  const router = useRouter();
  const trainerSlug = (params?.trainerSlug as string) || "";

  useEffect(() => {
    router.replace(`/trainer/${trainerSlug}/dashboard`);
  }, [router, trainerSlug]);

  return null;
}
