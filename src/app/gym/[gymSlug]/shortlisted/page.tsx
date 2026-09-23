"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/workspace/States";

/**
 * Gyms don't manage candidates on FitWorks — our team runs the search and
 * contacts them directly. Kept as a redirect so old links still land somewhere.
 */
export default function ShortlistedRedirect() {
  const router = useRouter();
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  useEffect(() => {
    router.replace(`/gym/${gymSlug}/dashboard`);
  }, [router, gymSlug]);

  return <Spinner label="Taking you to your dashboard…" />;
}
