"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/workspace/States";

/**
 * Gyms no longer manage an applicant list — FitWorks puts trainers forward, and
 * that lives under /trainers. Kept as a redirect so old links and bookmarks
 * still land somewhere useful.
 */
export default function ShortlistedRedirect() {
  const router = useRouter();
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  useEffect(() => {
    router.replace(`/gym/${gymSlug}/trainers`);
  }, [router, gymSlug]);

  return <Spinner label="Taking you to your trainer recommendations…" />;
}
