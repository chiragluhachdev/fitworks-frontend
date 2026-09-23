"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Users, Clock, ArrowUpRight, Briefcase } from "lucide-react";
import StatusPill from "@/components/workspace/StatusPill";
import { VACANCY_STATUS, relativeDate, type GymVacancyStatus } from "@/lib/hiring";

export interface VacancyRow {
  _id: string;
  position: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  numberOfOpenings?: number;
  requirements?: { experience?: string; specialization?: string; trainerType?: string };
  gymStatus?: GymVacancyStatus;
  candidatesInReview?: number;
  createdAt?: string;
}

/**
 * One vacancy as a card.
 *
 * The number of trainers we're working on sits on the right at display size,
 * because on this screen it is the only thing that changes day to day — the
 * role's own details are already known to the person reading.
 */
export default function VacancyCard({ vacancy, href }: { vacancy: VacancyRow; href: string }) {
  const status = VACANCY_STATUS[vacancy.gymStatus || "under_review"];
  const inReview = vacancy.candidatesInReview ?? 0;

  return (
    <Link
      href={href}
      className="group block bg-white rounded-[20px] ring-1 ring-gray-200/70 hover:ring-gray-300 p-4 sm:p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_16px_34px_-14px_rgba(16,24,40,0.18)] active:scale-[0.995] transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusPill label={status.label} chip={status.chip} dot={status.dot} size="sm" />
            {vacancy.createdAt && (
              <span className="text-[11.5px] text-gray-400 font-medium">
                Posted {relativeDate(vacancy.createdAt)}
              </span>
            )}
          </div>

          <h3 className="text-[15px] sm:text-[17px] font-bold text-gray-900 leading-snug group-hover:text-brand transition-colors">
            {vacancy.position}
          </h3>

          <div className="flex items-center gap-x-3.5 gap-y-1.5 mt-2.5 flex-wrap text-[11.5px] sm:text-[12.5px] text-gray-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {vacancy.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              {vacancy.requirements?.trainerType || vacancy.requirements?.specialization || "Trainer"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {vacancy.requirements?.experience || "Any experience"}
            </span>
          </div>

          <p className="text-[12.5px] sm:text-[13px] font-bold text-gray-900 mt-2.5 sm:mt-3">
            {vacancy.salaryRange}
            <span className="text-gray-400 font-medium"> · {vacancy.employmentType}</span>
            {(vacancy.numberOfOpenings ?? 1) > 1 && (
              <span className="text-gray-400 font-medium"> · {vacancy.numberOfOpenings} openings</span>
            )}
          </p>
        </div>

        {/* Candidate count — the one figure worth a glance. */}
        <div className="shrink-0 text-right pl-3 sm:pl-4 border-l border-gray-100 self-stretch flex flex-col justify-center min-w-[74px] sm:min-w-[92px]">
          <p className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 leading-none tabular-nums">
            {inReview}
          </p>
          <p className="text-[11px] font-semibold text-gray-400 mt-1.5 leading-tight">being reviewed</p>
          <span className="hidden sm:inline-flex items-center justify-end gap-1 text-[11.5px] font-bold text-brand mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Compact row for the overview list — the same data, less of it. */
export function VacancyRowItem({ vacancy, href }: { vacancy: VacancyRow; href: string }) {
  const status = VACANCY_STATUS[vacancy.gymStatus || "under_review"];
  const count = vacancy.candidatesInReview ?? 0;

  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <span className="w-10 h-10 rounded-xl bg-brand-tint text-brand flex items-center justify-center shrink-0">
        <Briefcase className="w-[18px] h-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] sm:text-[14px] font-bold text-gray-900 truncate">{vacancy.position}</p>
        <p className="text-[11.5px] sm:text-[12px] text-gray-500 truncate mt-0.5">
          {vacancy.location} · {vacancy.salaryRange}
        </p>
      </div>
      <div className="hidden sm:flex flex-col items-end shrink-0">
        <StatusPill label={status.label} chip={status.chip} dot={status.dot} size="sm" />
        <span className="text-[11px] text-gray-400 font-medium mt-1.5">
          {count} trainer{count === 1 ? "" : "s"}
        </span>
      </div>
      <Users className="sm:hidden w-4 h-4 text-gray-300 shrink-0" />
    </Link>
  );
}
