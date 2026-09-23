"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MapPin,
  Banknote,
  Clock,
  Users,
  CalendarDays,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  Search,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import StatusPill from "@/components/workspace/StatusPill";
import Callout from "@/components/workspace/Callout";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import { VACANCY_STATUS, shortDate, type GymVacancyStatus } from "@/lib/hiring";

/** One labelled fact about the role. */
function Detail({ icon: Icon, label, value }: { icon: any; label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400">{label}</p>
        <p className="text-[13.5px] font-semibold text-gray-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function GymVacancyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gymSlug = (params?.gymSlug as string) || "";
  const jobId = (params?.jobId as string) || "";

  const [vacancy, setVacancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>(`/jobs/${jobId}`);
    if (res.ok && res.data?.data) {
      setVacancy(res.data.data);
      setError("");
    } else {
      setError(res.error || "We couldn't load this vacancy.");
    }
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleOpen = async () => {
    setBusy(true);
    const next = vacancy.status === "open" ? "closed" : "open";
    const res = await api<{ data?: any }>(`/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok && res.data?.data) {
      setVacancy(res.data.data);
      toast.success(next === "open" ? "Vacancy reopened" : "Vacancy closed");
    } else {
      toast.error(res.error || "Couldn't update this vacancy.");
    }
  };

  const remove = async () => {
    if (!confirm("Remove this vacancy? This can't be undone.")) return;
    setBusy(true);
    const res = await api(`/jobs/${jobId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      toast.success("Vacancy removed");
      router.push(`/gym/${gymSlug}/vacancies`);
    } else {
      toast.error(res.error || "Couldn't remove this vacancy.");
    }
  };

  if (loading) return <PageSkeleton stats={0} rows={3} />;
  if (!vacancy) return <ErrorState message={error} onRetry={load} />;

  const status = VACANCY_STATUS[(vacancy.gymStatus as GymVacancyStatus) || "under_review"];
  const inReview = vacancy.candidatesInReview ?? 0;
  const closed = vacancy.status === "closed";

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        back={{ href: `/gym/${gymSlug}/vacancies`, label: "My vacancies" }}
        title={vacancy.position}
        description={
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <StatusPill label={status.label} chip={status.chip} dot={status.dot} />
            <span className="text-gray-400">·</span>
            <span>Posted {shortDate(vacancy.createdAt)}</span>
          </span>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" loading={busy} onClick={toggleOpen}>
              {closed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {closed ? "Reopen" : "Close"}
            </Button>
            <Button variant="danger" size="sm" loading={busy} onClick={remove} aria-label="Remove vacancy">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        }
      />

      {/* ── Where the search has got to ── */}
      <div className="mb-4 sm:mb-5">
        <Callout
          icon={Search}
          tone={inReview > 0 ? "info" : "neutral"}
          title="FitWorks is working on this requirement"
        >
          {inReview > 0 ? (
            <>
              {inReview} trainer{inReview === 1 ? " is" : "s are"} being reviewed for this role. We'll
              call you as soon as we have someone worth meeting.
            </>
          ) : (
            <>{status.note} We'll get in touch the moment we have someone suitable.</>
          )}
        </Callout>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <Panel title="Role details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Detail icon={MapPin} label="Location" value={vacancy.location} />
              <Detail icon={Building2} label="Branch" value={vacancy.branchName} />
              <Detail
                icon={Users}
                label="Role"
                value={vacancy.requirements?.trainerType || vacancy.requirements?.specialization}
              />
              <Detail icon={Sparkles} label="Specialization" value={vacancy.requirements?.specialization} />
              <Detail icon={Clock} label="Experience required" value={vacancy.requirements?.experience} />
              <Detail icon={Banknote} label="Salary" value={vacancy.salaryRange} />
              <Detail icon={Clock} label="Working hours" value={vacancy.workingHours} />
              <Detail icon={Users} label="Job type" value={vacancy.employmentType} />
              <Detail
                icon={Users}
                label="Openings"
                value={`${vacancy.numberOfOpenings || 1} position${(vacancy.numberOfOpenings || 1) > 1 ? "s" : ""}`}
              />
              <Detail
                icon={CalendarDays}
                label="Hiring by"
                value={vacancy.applicationDeadline ? shortDate(vacancy.applicationDeadline) : null}
              />
            </div>
          </Panel>

          <Panel title="Description">
            <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
              {vacancy.description}
            </p>

            {vacancy.requirementsText && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="text-[13px] font-bold text-gray-900 mb-2">Requirements</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {vacancy.requirementsText}
                </p>
              </div>
            )}

            {vacancy.additionalInfo && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="text-[13px] font-bold text-gray-900 mb-2">Additional information</h3>
                <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {vacancy.additionalInfo}
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* ── Progress at a glance ── */}
        <div className="space-y-4 sm:space-y-5">
          <Panel title="Trainers for this role">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-gray-600">Being reviewed</span>
              <span className="text-[28px] font-extrabold text-gray-900 tabular-nums leading-none">
                {inReview}
              </span>
            </div>

            <p className="text-[12px] text-gray-400 leading-relaxed mt-4">
              Trainers don't apply directly. Our team searches the network, checks every profile and
              contacts you with the ones who fit.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
