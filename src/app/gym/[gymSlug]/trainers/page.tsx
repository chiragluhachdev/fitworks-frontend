"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Users, ShieldCheck, Plus } from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Empty from "@/components/workspace/Empty";
import Callout from "@/components/workspace/Callout";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import TrainerCard, { type RecommendedTrainer } from "@/components/gym/TrainerCard";
import { api } from "@/lib/api";

export default function GymTrainersPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [rows, setRows] = useState<RecommendedTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [vacancyFilter, setVacancyFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: RecommendedTrainer[] }>(`/gyms/${gymSlug}/recommendations`);
    if (res.ok) {
      setRows(res.data?.data || []);
      setError("");
    } else {
      setError(res.error || "We couldn't load your recommendations.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const respond = async (id: string, interest: "interested" | "contact_requested") => {
    setBusyId(id);
    const res = await api(`/gyms/recommendations/${id}/interest`, {
      method: "PUT",
      body: JSON.stringify({ interest }),
    });
    setBusyId(null);
    if (res.ok) {
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, gymInterest: interest } : r)));
      toast.success(
        interest === "contact_requested"
          ? "We'll set up the introduction shortly."
          : "Noted — our team will follow up."
      );
    } else {
      toast.error(res.error || "Couldn't save your response.");
    }
  };

  // One chip per vacancy that actually has recommendations against it.
  const vacancies = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) {
      if (r.vacancy?._id && r.vacancy.position) seen.set(r.vacancy._id, r.vacancy.position);
    }
    return Array.from(seen, ([id, position]) => ({ id, position }));
  }, [rows]);

  const visible = useMemo(
    () => (vacancyFilter === "all" ? rows : rows.filter((r) => r.vacancy?._id === vacancyFilter)),
    [rows, vacancyFilter]
  );

  const awaiting = rows.filter((r) => r.gymInterest === "none").length;

  if (loading) return <PageSkeleton stats={0} rows={3} />;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Trainers"
        description="Profiles the FitWorks team has shortlisted for your open roles."
        actions={
          rows.length > 0 ? (
            <Button href={`/gym/${gymSlug}/vacancies/new`} variant="secondary" size="sm">
              <Plus className="w-3.5 h-3.5" /> Post a Vacancy
            </Button>
          ) : undefined
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : rows.length === 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-200/80">
            <Empty
              icon={Users}
              title="No recommendations yet"
              description="Once you've posted a vacancy, our team searches the FitWorks network and shares the trainers worth meeting here."
              action={{ label: "Post a Vacancy", href: `/gym/${gymSlug}/vacancies/new` }}
            />
          </div>
          <Callout icon={ShieldCheck} tone="neutral" title="Why you can't browse every trainer" >
            FitWorks introduces trainers rather than listing them. Our team checks documents, speaks to
            each person and only puts forward the ones who genuinely suit your role — so you review a
            handful of good profiles instead of hundreds of unknown ones.
          </Callout>
        </>
      ) : (
        <>
          {awaiting > 0 && (
            <Callout
              icon={Users}
              tone="success"
              title={`${awaiting} profile${awaiting === 1 ? "" : "s"} waiting for your response`}
              
            >
              Tell us who you like and we'll arrange the introduction.
            </Callout>
          )}

          {vacancies.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 mb-4 scrollbar-none">
              {[{ id: "all", position: "All roles" }, ...vacancies].map((v) => {
                const on = vacancyFilter === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVacancyFilter(v.id)}
                    className={`h-9 px-3.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      on
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {v.position}
                  </button>
                );
              })}
            </div>
          )}

          <div className={`space-y-4 ${awaiting > 0 && vacancies.length <= 1 ? "mt-4" : ""}`}>
            {visible.map((row) => (
              <TrainerCard
                key={row._id}
                row={row}
                busy={busyId === row._id}
                onRespond={(interest) => respond(row._id, interest)}
              />
            ))}
          </div>

          <p className="text-[12px] text-gray-400 text-center mt-6 leading-relaxed max-w-md mx-auto">
            Contact details stay with FitWorks until you ask for an introduction — it's how we protect
            trainers from cold outreach and keep the quality of the network up.
          </p>
        </>
      )}
    </div>
  );
}
