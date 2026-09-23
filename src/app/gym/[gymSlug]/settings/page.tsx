"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/workspace/States";

/**
 * Account settings live alongside the gym profile now — one screen rather than
 * three. Kept as a redirect so existing links still work.
 */
export default function GymSettingsRedirect() {
  const router = useRouter();
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  useEffect(() => {
    router.replace(`/gym/${gymSlug}/profile`);
  }, [router, gymSlug]);

  return <Spinner label="Taking you to your profile and settings…" />;
}
