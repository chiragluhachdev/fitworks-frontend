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
      <span className="w-9 h-9 rounded-xl bg-gray-50 ring-1 ring-gray-200/70 flex items-center justify-center shrink-0">
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
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm" loading={busy} onClick={toggleOpen} className="flex-1 sm:flex-none">
              {closed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {closed ? "Reopen" : "Close"}
            </Button>
            <Button variant="danger" size="sm" loading={busy} onClick={remove} aria-label="Remove vacancy" className="shrink-0 px-3">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
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
          {vacancy.finalizedCandidates && vacancy.finalizedCandidates.length > 0 && (
            <Panel title="Finalized Trainers">
              <div className="space-y-3">
                {vacancy.finalizedCandidates.map((t: any) => (
                  <div key={t._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl ring-1 ring-gray-200/70 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold shrink-0">
                        {t.personal?.fullName?.charAt(0) || "T"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 truncate">{t.personal?.fullName}</p>
                        <p className="text-[13px] text-gray-500 font-medium">{t.personal?.phone}</p>
                      </div>
                    </div>
                    {t.personal?.phone && (
                      <a
                        href={`https://wa.me/91${t.personal.phone.replace(/\D/g, "").slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-3 sm:py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors text-[#128C3E] rounded-lg text-[13px] font-bold w-full sm:w-auto"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23z" />
                        </svg>
                        Message
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          )}

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
