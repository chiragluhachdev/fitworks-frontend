"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  Users,
  CreditCard,
  ArrowRight,
  Building2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/workspace/Button";
import Stat from "@/components/workspace/Stat";
import Panel from "@/components/workspace/Panel";
import Empty from "@/components/workspace/Empty";
import Callout from "@/components/workspace/Callout";
import HiringSteps from "@/components/workspace/HiringSteps";
import { ProgressRing } from "@/components/workspace/Progress";
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

  const { gym, stats, subscription, completion, activeVacancies = [] } = data;
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

      {/* ── The four numbers ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <Stat
          label="Active vacancies"
          value={stats?.activeVacancies ?? 0}
          icon={Briefcase}
          href={`/gym/${gymSlug}/vacancies`}
          hint={`${stats?.totalVacancies ?? 0} posted in total`}
        />
        <Stat
          label="Being reviewed"
          value={stats?.trainersInReview ?? 0}
          icon={Users}
          accent={(stats?.trainersInReview ?? 0) > 0}
          href={`/gym/${gymSlug}/trainers`}
          hint="Trainers our team is working on for you"
        />
        <Stat
          label="Shared with you"
          value={stats?.trainersShared ?? 0}
          icon={Sparkles}
          href={`/gym/${gymSlug}/trainers`}
          hint="Recommendations ready to review"
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

      {/* ── Anything asking for a decision, at most one at a time ── */}
      <div className="space-y-3 mb-5 sm:mb-6">
        {!subscription?.isActive && (
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
            Plans start at ₹199 a month and include unlimited vacancies and full hiring support from our
            team.
          </Callout>
        )}

        {(stats?.trainersShared ?? 0) > 0 && (
          <Callout
            icon={Sparkles}
            tone="success"
            title={`${stats.trainersShared} trainer${stats.trainersShared === 1 ? "" : "s"} ready for you to review`}
            action={
              <Button href={`/gym/${gymSlug}/trainers`} size="sm">
                Review now
              </Button>
            }
          >
            Our team has shortlisted these profiles for your open roles.
          </Callout>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* ── Active vacancies ── */}
        <Panel
          className="lg:col-span-2"
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

        {/* ── Profile completeness ── */}
        <Panel title="Your gym profile" description="A fuller profile helps trainers say yes.">
          <div className="flex items-center gap-4">
            <ProgressRing percent={completion?.percent ?? 0} size={62} />
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-gray-900">
                {completion?.percent >= 100 ? "All done" : `${completion?.percent ?? 0}% complete`}
              </p>
              <p className="text-[12.5px] text-gray-500 mt-0.5 leading-snug">
                {completion?.missing?.length
                  ? `Still missing: ${completion.missing.slice(0, 2).join(", ")}`
                  : "Everything a trainer wants to know is here."}
              </p>
            </div>
          </div>

          <Button href={`/gym/${gymSlug}/profile`} variant="secondary" size="md" block className="mt-5">
            <Building2 className="w-4 h-4" />
            {completion?.percent >= 100 ? "Edit profile" : "Complete profile"}
          </Button>

          <div className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Every trainer we put forward has had their certificates and government ID checked by our
              team.
            </p>
          </div>
        </Panel>
      </div>

      <HiringSteps className="mt-4 sm:mt-5" />
    </div>
  );
}
