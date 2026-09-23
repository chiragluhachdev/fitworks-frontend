"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Briefcase, Search } from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Empty from "@/components/workspace/Empty";
import { Input } from "@/components/workspace/Field";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import VacancyCard, { type VacancyRow } from "@/components/gym/VacancyCard";
import { api } from "@/lib/api";
import { VACANCY_STATUS, type GymVacancyStatus } from "@/lib/hiring";

const TABS: { id: "all" | GymVacancyStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "under_review", label: "Under review" },
  { id: "filled", label: "Filled" },
  { id: "closed", label: "Closed" },
];

export default function GymVacanciesPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  const [vacancies, setVacancies] = useState<VacancyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"all" | GymVacancyStatus>("all");
  const [query, setQuery] = useState("");

  /**
   * Pick up a query handed over from the top bar's search.
   *
   * Read from the URL rather than through useSearchParams, which would put
   * this whole screen behind a Suspense boundary for one string.
   */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: VacancyRow[] }>(`/jobs/gym/slug/${gymSlug}`);
    if (res.ok) {
      setVacancies(res.data?.data || []);
      setError("");
    } else {
      setError(res.error || "We couldn't load your vacancies.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: vacancies.length };
    for (const v of vacancies) {
      const s = v.gymStatus || "under_review";
      map[s] = (map[s] || 0) + 1;
    }
    return map;
  }, [vacancies]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vacancies.filter((v) => {
      if (tab !== "all" && (v.gymStatus || "under_review") !== tab) return false;
      if (!q) return true;
      return [v.position, v.location, v.requirements?.specialization, v.requirements?.trainerType]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
  }, [vacancies, tab, query]);

  if (loading) return <PageSkeleton stats={0} rows={4} />;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="My vacancies"
        description="Every role you've asked us to hire for, and how far along each one is."
        actions={
          <Button href={`/gym/${gymSlug}/vacancies/new`}>
            <Plus className="w-4 h-4" /> Post a Vacancy
          </Button>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : vacancies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/80">
          <Empty
            icon={Briefcase}
            title="No vacancies yet"
            description="Post your first requirement and our team will start looking for trainers who fit it. It takes about a minute."
            action={{ label: "Post a Vacancy", href: `/gym/${gymSlug}/vacancies/new` }}
          />
        </div>
      ) : (
        <>
          {/* Filters — tabs scroll sideways on a phone rather than wrapping. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
              {TABS.map((t) => {
                const n = counts[t.id] || 0;
                if (t.id !== "all" && n === 0) return null;
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`h-9 px-3.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      on
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {t.label}
                    <span className={on ? "text-white/60 ml-1.5" : "text-gray-400 ml-1.5"}>{n}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vacancies"
                className="h-10 pl-9"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80">
              <Empty
                icon={Search}
                title="Nothing matches that"
                description={
                  query
                    ? `No vacancy matches "${query}". Try a different word, or clear the search.`
                    : `You have no ${VACANCY_STATUS[tab as GymVacancyStatus]?.label.toLowerCase()} vacancies.`
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((v) => (
                <VacancyCard key={v._id} vacancy={v} href={`/gym/${gymSlug}/vacancies/${v._id}`} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
