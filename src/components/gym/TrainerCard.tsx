"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, MapPin, Briefcase, GraduationCap, Heart, PhoneCall, Check } from "lucide-react";
import Button from "@/components/workspace/Button";

export interface RecommendedTrainer {
  _id: string;
  status: string;
  gymInterest: "none" | "interested" | "contact_requested";
  sharedAt?: string;
  vacancy?: { _id: string; position?: string; location?: string };
  trainer: {
    fullName?: string;
    city?: string;
    location?: string;
    profilePhoto?: string;
    verificationStatus?: string;
    professionalTitle?: string;
    yearsOfExperience?: number;
    specializations?: string[];
    skills?: string[];
    certifications?: string[];
    education?: string;
    bio?: string;
  };
}

/**
 * A trainer the FitWorks team has put forward.
 *
 * No phone number and no email: the introduction is ours to make. The gym tells
 * us it is interested and we take it from there, which is what keeps the
 * process — and the quality of it — in our hands.
 */
export default function TrainerCard({
  row,
  onRespond,
  busy,
}: {
  row: RecommendedTrainer;
  onRespond: (interest: "interested" | "contact_requested") => void;
  busy?: boolean;
}) {
  const t = row.trainer;
  const verified = t.verificationStatus === "verified";
  const responded = row.gymInterest !== "none";

  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {t.profilePhoto ? (
            <span className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 border border-gray-200">
              <Image src={t.profilePhoto} alt="" fill className="object-cover" />
            </span>
          ) : (
            <span className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center font-extrabold text-lg shrink-0">
              {t.fullName?.charAt(0)?.toUpperCase() || "T"}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-[16px] font-bold text-gray-900 truncate">{t.fullName || "Trainer"}</h3>
              {verified && (
                <span
                  title="Documents verified by FitWorks"
                  className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded-full"
                >
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-[13px] font-semibold text-[#d91a24] mt-0.5">
              {t.professionalTitle || "Fitness Trainer"}
            </p>

            <div className="flex items-center gap-x-3.5 gap-y-1 mt-2 flex-wrap text-[12px] text-gray-500 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {t.location || t.city || "India"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                {t.yearsOfExperience ?? 0} yr{(t.yearsOfExperience ?? 0) === 1 ? "" : "s"} experience
              </span>
              {!!t.certifications?.length && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  {t.certifications.length} certificate{t.certifications.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>

        {!!t.specializations?.length && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {t.specializations.slice(0, 5).map((s) => (
              <span
                key={s}
                className="text-[11.5px] font-semibold px-2 py-1 bg-gray-50 text-gray-700 border border-gray-200/80 rounded-lg"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {t.bio && (
          <p className="text-[12.5px] text-gray-600 leading-relaxed mt-3.5 line-clamp-3">{t.bio}</p>
        )}

        {row.vacancy?.position && (
          <p className="text-[12px] text-gray-400 mt-3.5">
            Suggested for <span className="font-semibold text-gray-600">{row.vacancy.position}</span>
          </p>
        )}
      </div>

      <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100">
        {responded ? (
          <p className="inline-flex items-center gap-2 text-[12.5px] font-bold text-emerald-700">
            <Check className="w-4 h-4" />
            {row.gymInterest === "contact_requested"
              ? "Contact requested — our team will set up the introduction."
              : "Marked as interested. We'll be in touch shortly."}
          </p>
        ) : (
          <div className="flex items-center gap-2.5">
            <Button size="sm" variant="secondary" loading={busy} onClick={() => onRespond("interested")}>
              <Heart className="w-3.5 h-3.5" /> Interested
            </Button>
            <Button size="sm" loading={busy} onClick={() => onRespond("contact_requested")}>
              <PhoneCall className="w-3.5 h-3.5" /> Request contact
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
