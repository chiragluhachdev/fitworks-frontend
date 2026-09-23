"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/workspace/States";

/**
 * Trainers no longer browse jobs, apply to them or manage invitations — the
 * FitWorks team makes the introduction. Everything that used to live across
 * these three screens is now one Opportunities page.
 *
 * Kept as a redirect so links already sent over WhatsApp still land somewhere.
 */
export default function LegacyTrainerRedirect() {
  const router = useRouter();
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "";

  useEffect(() => {
    router.replace(`/trainer/${trainerSlug}/opportunities`);
  }, [router, trainerSlug]);

  return <Spinner label="Taking you to your opportunities…" />;
}
