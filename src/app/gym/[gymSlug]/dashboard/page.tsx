"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Briefcase, CreditCard, ArrowRight } from "lucide-react";
import Button from "@/components/workspace/Button";
import Stat from "@/components/workspace/Stat";
import Panel from "@/components/workspace/Panel";
import Empty from "@/components/workspace/Empty";
import Callout from "@/components/workspace/Callout";
import HiringSteps from "@/components/workspace/HiringSteps";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { VacancyRowItem } from "@/components/gym/VacancyCard";
import { api } from "@/lib/api";
import { findPlan, shortDate } from "@/lib/hiring";

export default function GymOverviewPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>(`/gyms/${gymSlug}/dashboard`);
    if (res.ok && res.data?.data) {
      setData(res.data.data);
      setError("");
    } else {
      setError(res.error || "We couldn't load your dashboard.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageSkeleton />;
  if (!data) return <ErrorState message={error} onRetry={load} />;

  const { gym, stats, subscription, activeVacancies = [] } = data;
  const firstName = (gym?.contactPerson?.name || "").split(" ")[0];
  const hasVacancies = (stats?.totalVacancies ?? 0) > 0;
  const plan = findPlan(subscription?.plan);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* ── The pitch, restated every time they land here ── */}
      <section className="relative overflow-hidden bg-gray-900 rounded-3xl px-6 py-8 sm:px-9 sm:py-11 mb-5 sm:mb-6">
        {/* A single soft light source, not a full-bleed gradient. */}
        <span
          aria-hidden
          className="absolute -top-28 -right-16 w-80 h-80 rounded-full bg-[#d91a24] opacity-25 blur-3xl"
        />
        <div className="relative max-w-2xl">
          {firstName && (
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/50 mb-3">
              Welcome back, {firstName}
            </p>
          )}
          <h1 className="text-[27px] sm:text-[36px] font-extrabold text-white tracking-[-0.025em] leading-[1.12]">
            Find the right fitness professionals for your gym.
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/65 mt-3.5 leading-relaxed">
            Post your hiring requirements and let the FitWorks team help you find suitable trainers.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 mt-7">
            <Button href={`/gym/${gymSlug}/vacancies/new`} size="lg" className="sm:w-auto">
              <Plus className="w-4 h-4" /> Post a Vacancy
            </Button>
            {hasVacancies && (
              <Link
                href={`/gym/${gymSlug}/vacancies`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-[15px] font-bold text-white border border-white/20 hover:bg-white/10 active:scale-[0.98] transition-all"
              >
                View my vacancies <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Two figures. This screen is for posting vacancies, not reporting. ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <Stat
          label="Active vacancies"
          value={stats?.activeVacancies ?? 0}
          icon={Briefcase}
          href={`/gym/${gymSlug}/vacancies`}
          hint={`${stats?.totalVacancies ?? 0} posted in total`}
        />
        <Stat
          label="Subscription"
          value={subscription?.isActive ? plan?.name.replace("FitWorks ", "") || "Active" : "Inactive"}
          icon={CreditCard}
          href={`/gym/${gymSlug}/subscription`}
          hint={
            subscription?.isActive
              ? `Renews ${shortDate(subscription.expiresAt)}`
              : "Choose a plan to keep hiring"
          }
        />
      </div>

      {!subscription?.isActive && (
        <div className="mb-5 sm:mb-6">
          <Callout
            icon={CreditCard}
            tone="warning"
            title={
              subscription?.status === "expired"
                ? "Your FitWorks plan has expired"
                : "Activate your FitWorks plan"
            }
            action={
              <Button href={`/gym/${gymSlug}/subscription`} size="sm" variant="secondary">
                View plans
              </Button>
            }
          >
            Unlimited vacancies and full hiring support from our team.
          </Callout>
        </div>
      )}

      <Panel
        title="Your active vacancies"
        description={
          hasVacancies
            ? "Where each of your open roles has got to."
            : "Your open roles will be listed here."
        }
        action={hasVacancies ? { label: "See all", href: `/gym/${gymSlug}/vacancies` } : undefined}
        bodyClassName={activeVacancies.length ? "p-2 sm:p-2.5" : ""}
      >
        {activeVacancies.length === 0 ? (
          <Empty
            icon={Briefcase}
            title={hasVacancies ? "No open vacancies right now" : "You haven't posted a vacancy yet"}
            description={
              hasVacancies
                ? "All your roles are closed or filled. Post a new one whenever you're hiring again."
                : "Tell us what you're hiring for and our team will start finding suitable trainers for you."
            }
            action={{ label: "Post a Vacancy", href: `/gym/${gymSlug}/vacancies/new` }}
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {activeVacancies.map((v: any) => (
              <li key={v._id}>
                <VacancyRowItem vacancy={v} href={`/gym/${gymSlug}/vacancies/${v._id}`} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <HiringSteps className="mt-4 sm:mt-5" />
    </div>
  );
}
