"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  MapPin,
  Banknote,
  Building2,
  ChevronRight,
  Users,
  Calendar,
} from "lucide-react";
import StatusPill from "@/components/workspace/StatusPill";
import Empty from "@/components/workspace/Empty";
import { Input } from "@/components/workspace/Field";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api } from "@/lib/api";
import { PIPELINE, stageMeta, shortDate, relativeDate, type PipelineStage } from "@/lib/hiring";

interface BoardRow {
  _id: string;
  position: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  numberOfOpenings?: number;
  pipelineStatus: PipelineStage;
  requirements?: { experience?: string; specialization?: string; trainerType?: string };
  gymId?: { _id: string; gymName?: string; gymLogo?: string; slug?: string; address?: any };
  shortlistedCount?: number;
  inReviewCount?: number;
  createdAt?: string;
}

export default function AdminVacancyBoard() {
  const [rows, setRows] = useState<BoardRow[]>([]);
  const [byStage, setByStage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"all" | PipelineStage>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: BoardRow[]; byStage?: Record<string, number> }>(
      `/admin/hiring/vacancies`
    );
    if (res.ok) {
      setRows(res.data?.data || []);
      setByStage(res.data?.byStage || {});
      setError("");
    } else {
      setError(res.error || "We couldn't load the vacancy board.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (stage !== "all" && r.pipelineStatus !== stage) return false;
      if (!q) return true;
      return [r.position, r.location, r.gymId?.gymName, r.requirements?.specialization]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
  }, [rows, stage, query]);

  // What the team has to act on today, called out above everything else.
  const queue = (byStage.new || 0) + (byStage.under_review || 0);

  if (loading) return <PageSkeleton stats={0} rows={5} />;

  return (
    <div className="animate-in fade-in duration-300">
      <header className="mb-6">
        <h1 className="text-[26px] sm:text-[30px] font-extrabold text-gray-900 tracking-[-0.02em]">
          Gym vacancies
        </h1>
        <p className="text-[14px] text-gray-500 mt-1.5">
          Every requirement gyms have sent us, and where each one stands.
          {queue > 0 && (
            <>
              {" "}
              <span className="font-bold text-[#E92E3D]">
                {queue} need{queue === 1 ? "s" : ""} attention.
              </span>
            </>
          )}
        </p>
      </header>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          {/* ── Stage filters ── */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
              <button
                onClick={() => setStage("all")}
                className={`h-9 px-3.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  stage === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                All <span className={stage === "all" ? "text-white/60 ml-1.5" : "text-gray-400 ml-1.5"}>{rows.length}</span>
              </button>
              {PIPELINE.map((s) => {
                const n = byStage[s.id] || 0;
                if (!n) return null;
                const on = stage === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStage(s.id)}
                    className={`h-9 px-3.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      on
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {s.label}
                    <span className={on ? "text-white/60 ml-1.5" : "text-gray-400 ml-1.5"}>{n}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative lg:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gym, role or city"
                className="h-10 pl-9"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80">
              <Empty
                icon={Briefcase}
                title={rows.length === 0 ? "No vacancies yet" : "Nothing matches that"}
                description={
                  rows.length === 0
                    ? "Requirements posted by gyms will land here for the team to work on."
                    : "Try a different search or clear the stage filter."
                }
              />
            </div>
          ) : (
            <div className="space-y-2.5">
              {visible.map((row) => {
                const meta = stageMeta(row.pipelineStatus);
                return (
                  <Link
                    key={row._id}
                    href={`/admin/vacancies/${row._id}`}
                    className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 hover:border-gray-300 active:scale-[0.998] transition-all"
                  >
                    <span className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-extrabold shrink-0">
                      {row.gymId?.gymName?.charAt(0)?.toUpperCase() || <Building2 className="w-5 h-5" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusPill label={meta.label} chip={meta.chip} dot={meta.dot} size="sm" />
                        <span className="text-[11.5px] text-gray-400 font-medium">
                          {relativeDate(row.createdAt)}
                        </span>
                      </div>
                      <p className="text-[15px] font-bold text-gray-900 mt-1.5 truncate group-hover:text-[#E92E3D] transition-colors">
                        {row.position}
                      </p>
                      <div className="flex items-center gap-x-3.5 gap-y-1 flex-wrap text-[12px] text-gray-500 font-medium mt-1">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          {row.gymId?.gymName || "Unknown gym"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {row.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Banknote className="w-3.5 h-3.5 text-gray-400" />
                          {row.salaryRange}
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {shortDate(row.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end shrink-0 pl-3 min-w-[84px]">
                      <span className="inline-flex items-center gap-1.5 text-[20px] font-extrabold text-gray-900 tabular-nums">
                        <Users className="w-4 h-4 text-gray-300" />
                        {row.shortlistedCount ?? 0}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400 mt-0.5">shortlisted</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-[#E92E3D] transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
