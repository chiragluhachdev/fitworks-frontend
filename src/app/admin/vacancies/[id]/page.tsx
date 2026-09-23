"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Building2,
  MapPin,
  Banknote,
  Clock,
  Users,
  Phone,
  Search,
  Plus,
  Trash2,
  BadgeCheck,
  X,
  StickyNote,
  Save,
} from "lucide-react";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import StatusPill from "@/components/workspace/StatusPill";
import Empty from "@/components/workspace/Empty";
import { Input, Select, Textarea } from "@/components/workspace/Field";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import WhatsAppButton from "@/components/admin/WhatsAppButton";
import { api } from "@/lib/api";
import {
  PIPELINE,
  CANDIDATE_STAGE,
  candidateMeta,
  stageMeta,
  shortDate,
  type CandidateStage,
  type PipelineStage,
} from "@/lib/hiring";

/** The stages an admin actually moves a candidate through, in order. */
const CANDIDATE_FLOW: CandidateStage[] = [
  "shortlisted",
  "contacted",
  "interested",
  "not_interested",
  "shared",
  "connected",
  "hired",
  "rejected",
];

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </p>
      <p className="text-[13.5px] font-semibold text-gray-900 mt-1 break-words">{value}</p>
    </div>
  );
}

/* ─────────────── Trainer picker ─────────────── */

function TrainerPicker({
  jobId,
  defaultCity,
  defaultSpecialization,
  onAdded,
  onClose,
}: {
  jobId: string;
  defaultCity?: string;
  defaultSpecialization?: string;
  onAdded: (row: any) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(defaultCity || "");
  const [specialization, setSpecialization] = useState(defaultSpecialization || "");
  const [status, setStatus] = useState("verified");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ jobId, status });
    if (query.trim()) params.set("q", query.trim());
    if (city.trim()) params.set("city", city.trim());
    if (specialization.trim()) params.set("specialization", specialization.trim());

    const res = await api<{ data?: any[] }>(`/admin/hiring/trainer-search?${params}`);
    setResults(res.ok ? res.data?.data || [] : []);
    if (!res.ok) toast.error(res.error || "Search failed.");
    setLoading(false);
  }, [jobId, query, city, specialization, status]);

  // Run once on open with the vacancy's own city and specialization prefilled —
  // that is almost always the right first search.
  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = async (trainerId: string) => {
    setAdding(trainerId);
    const res = await api<{ data?: any }>(`/admin/hiring/vacancies/${jobId}/shortlist`, {
      method: "POST",
      body: JSON.stringify({ trainerId }),
    });
    setAdding(null);
    if (res.ok && res.data?.data) {
      onAdded(res.data.data);
      setResults((prev) => prev.filter((t) => t._id !== trainerId));
      toast.success("Added to shortlist");
    } else {
      toast.error(res.error || "Couldn't add this trainer.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-[16px] font-extrabold text-gray-900">Find trainers</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Only trainers we've verified are shown by default.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Name, title or skill"
                className="h-10 pl-9"
              />
            </div>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="City"
              className="h-10"
            />
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10">
              <option value="verified">Verified only</option>
              <option value="pending">Pending</option>
              <option value="any">Any status</option>
            </Select>
          </div>
          <div className="flex items-center gap-2.5">
            <Input
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Specialization"
              className="h-10 flex-1"
            />
            <Button size="sm" onClick={search} loading={loading}>
              <Search className="w-3.5 h-3.5" /> Search
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-3">
          {loading ? (
            <p className="text-[13px] text-gray-500 py-10 text-center">Searching…</p>
          ) : results.length === 0 ? (
            <p className="text-[13px] text-gray-500 py-10 text-center">
              No trainers match. Try widening the city or dropping the specialization.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((t) => (
                <li key={t._id} className="flex items-center gap-3.5 py-3">
                  <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-extrabold shrink-0">
                    {t.personal?.fullName?.charAt(0)?.toUpperCase() || "T"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-gray-900 truncate flex items-center gap-1.5">
                      {t.personal?.fullName || "Trainer"}
                      {t.verificationStatus === "verified" && (
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </p>
                    <p className="text-[12px] text-gray-500 truncate mt-0.5">
                      {t.professional?.professionalTitle || "Trainer"} ·{" "}
                      {t.professional?.yearsOfExperience ?? 0} yrs · {t.personal?.city || "India"}
                    </p>
                    {!!t.professional?.specializations?.length && (
                      <p className="text-[11.5px] text-gray-400 truncate mt-0.5">
                        {t.professional.specializations.slice(0, 3).join(" · ")}
                      </p>
                    )}
                  </div>
                  <Button size="sm" loading={adding === t._id} onClick={() => add(t._id)}>
                    <Plus className="w-3.5 h-3.5" /> Shortlist
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Page ─────────────── */

export default function AdminVacancyWorkspace() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [vacancy, setVacancy] = useState<any>(null);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStage, setSavingStage] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [picker, setPicker] = useState(false);
  const [busyRow, setBusyRow] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any }>(`/admin/hiring/vacancies/${id}`);
    if (res.ok && res.data?.data) {
      setVacancy(res.data.data.vacancy);
      setShortlist(res.data.data.shortlist || []);
      setNotes(res.data.data.vacancy?.adminNotes || "");
      setError("");
    } else {
      setError(res.error || "We couldn't load this vacancy.");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const setStage = async (pipelineStatus: PipelineStage) => {
    setSavingStage(true);
    const res = await api<{ data?: any }>(`/admin/hiring/vacancies/${id}/stage`, {
      method: "PUT",
      body: JSON.stringify({ pipelineStatus }),
    });
    setSavingStage(false);
    if (res.ok && res.data?.data) {
      setVacancy(res.data.data);
      toast.success(`Moved to "${stageMeta(pipelineStatus).label}"`);
    } else {
      toast.error(res.error || "Couldn't update the stage.");
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    const res = await api(`/admin/hiring/vacancies/${id}/stage`, {
      method: "PUT",
      body: JSON.stringify({ adminNotes: notes }),
    });
    setSavingNotes(false);
    toast[res.ok ? "success" : "error"](res.ok ? "Notes saved" : res.error || "Couldn't save notes.");
  };

  const moveCandidate = async (rowId: string, status: CandidateStage) => {
    setBusyRow(rowId);
    const res = await api<{ data?: any }>(`/admin/hiring/shortlist/${rowId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyRow(null);
    if (res.ok && res.data?.data) {
      setShortlist((prev) => prev.map((r) => (r._id === rowId ? res.data!.data : r)));
      // The vacancy's own stage can move with a candidate, so refresh it.
      load();
    } else {
      toast.error(res.error || "Couldn't update this trainer.");
    }
  };

  const removeCandidate = async (rowId: string) => {
    if (!confirm("Remove this trainer from the shortlist?")) return;
    setBusyRow(rowId);
    const res = await api(`/admin/hiring/shortlist/${rowId}`, { method: "DELETE" });
    setBusyRow(null);
    if (res.ok) {
      setShortlist((prev) => prev.filter((r) => r._id !== rowId));
      toast.success("Removed");
    } else {
      toast.error(res.error || "Couldn't remove this trainer.");
    }
  };

  if (loading) return <PageSkeleton stats={0} rows={4} />;
  if (!vacancy) return <ErrorState message={error} onRetry={load} />;

  const meta = stageMeta(vacancy.pipelineStatus);
  const gym = vacancy.gymId || {};

  return (
    <div className="animate-in fade-in duration-300">
      <Link
        href="/admin/vacancies"
        className="inline-flex items-center gap-1 -ml-1 mb-3 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> All vacancies
      </Link>

      <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <StatusPill label={meta.label} chip={meta.chip} dot={meta.dot} />
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-gray-900 tracking-[-0.02em] mt-2 leading-tight">
            {vacancy.position}
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-1.5">
            {gym.gymName || "Unknown gym"} · posted {shortDate(vacancy.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Select
            value={vacancy.pipelineStatus}
            onChange={(e) => setStage(e.target.value as PipelineStage)}
            disabled={savingStage}
            className="h-11 w-full lg:w-52"
            aria-label="Pipeline stage"
          >
            {PIPELINE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
          <Button onClick={() => setPicker(true)} className="shrink-0">
            <Plus className="w-4 h-4" /> Add trainer
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* ── Shortlist ── */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <Panel
            title={`Shortlist (${shortlist.length})`}
            description="Trainers being worked on for this role. Moving someone to “Shared” makes them visible to the gym."
            bodyClassName={shortlist.length ? "p-0" : ""}
          >
            {shortlist.length === 0 ? (
              <Empty
                icon={Users}
                title="No trainers shortlisted yet"
                description="Search the network and add the trainers who fit this requirement. The gym sees them only once you share."
                secondary={
                  <Button size="sm" onClick={() => setPicker(true)}>
                    <Search className="w-3.5 h-3.5" /> Find trainers
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-gray-100">
                {shortlist.map((row) => {
                  const t = row.trainerId || {};
                  const stage = candidateMeta(row.status);
                  return (
                    <li key={row._id} className="p-4 sm:p-5">
                      <div className="flex items-start gap-3.5">
                        <span className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-extrabold shrink-0">
                          {t.personal?.fullName?.charAt(0)?.toUpperCase() || "T"}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[14.5px] font-bold text-gray-900 truncate">
                              {t.personal?.fullName || "Trainer"}
                            </p>
                            {t.verificationStatus === "verified" && (
                              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            <StatusPill label={stage.label} chip={stage.chip} size="sm" />
                            {row.gymInterest !== "none" && (
                              <StatusPill
                                label={
                                  row.gymInterest === "contact_requested"
                                    ? "Gym asked for contact"
                                    : "Gym interested"
                                }
                                chip="text-[#d91a24] bg-red-50 border-red-200/70"
                                size="sm"
                              />
                            )}
                          </div>

                          <p className="text-[12.5px] text-gray-500 mt-1">
                            {t.professional?.professionalTitle || "Trainer"} ·{" "}
                            {t.professional?.yearsOfExperience ?? 0} yrs · {t.personal?.city || "India"}
                          </p>

                          {t.personal?.phone && (
                            <p className="text-[12px] text-gray-500 mt-1 inline-flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {t.personal.phone}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <Select
                              value={row.status}
                              disabled={busyRow === row._id}
                              onChange={(e) => moveCandidate(row._id, e.target.value as CandidateStage)}
                              className="h-9 w-auto min-w-[9.5rem] text-[13px]"
                              aria-label="Candidate stage"
                            >
                              {CANDIDATE_FLOW.map((s) => (
                                <option key={s} value={s}>
                                  {CANDIDATE_STAGE[s].label}
                                </option>
                              ))}
                            </Select>

                            <WhatsAppButton
                              trainer={{
                                personal: {
                                  fullName: t.personal?.fullName,
                                  phone: t.personal?.phone,
                                },
                                slug: t.slug,
                                verificationStatus: t.verificationStatus,
                              }}
                            />

                            <button
                              onClick={() => removeCandidate(row._id)}
                              disabled={busyRow === row._id}
                              aria-label="Remove from shortlist"
                              className="w-9 h-9 rounded-lg border border-gray-200 text-gray-400 hover:text-[#d91a24] hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Requirement">
            <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
              {vacancy.description}
            </p>
            {vacancy.requirementsText && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[12.5px] font-bold text-gray-900 mb-1.5">Requirements</p>
                <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {vacancy.requirementsText}
                </p>
              </div>
            )}
            {vacancy.additionalInfo && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[12.5px] font-bold text-gray-900 mb-1.5">Additional information</p>
                <p className="text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {vacancy.additionalInfo}
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* ── Gym + facts + notes ── */}
        <div className="space-y-4 sm:space-y-5">
          <Panel title="The gym">
            <div className="space-y-4">
              <Fact icon={Building2} label="Gym" value={gym.gymName} />
              <Fact
                icon={MapPin}
                label="Address"
                value={[gym.address?.street, gym.address?.city, gym.address?.state]
                  .filter(Boolean)
                  .join(", ")}
              />
              <Fact
                icon={Phone}
                label="Contact"
                value={
                  gym.contactPerson?.name
                    ? `${gym.contactPerson.name} · ${gym.contactPerson.phone || "no phone"}`
                    : gym.contactPerson?.phone
                }
              />
            </div>
            {gym.slug && (
              <Button href={`/admin/gyms`} variant="secondary" size="sm" block className="mt-5">
                Open in Gyms
              </Button>
            )}
          </Panel>

          <Panel title="Role facts">
            <div className="space-y-4">
              <Fact icon={MapPin} label="Location" value={vacancy.location} />
              <Fact icon={Building2} label="Branch" value={vacancy.branchName} />
              <Fact
                icon={Users}
                label="Role"
                value={vacancy.requirements?.trainerType || vacancy.requirements?.specialization}
              />
              <Fact icon={Clock} label="Experience" value={vacancy.requirements?.experience} />
              <Fact icon={Banknote} label="Salary" value={vacancy.salaryRange} />
              <Fact icon={Clock} label="Hours" value={vacancy.workingHours} />
              <Fact icon={Users} label="Job type" value={vacancy.employmentType} />
              <Fact
                icon={Users}
                label="Openings"
                value={`${vacancy.numberOfOpenings || 1}`}
              />
            </div>
          </Panel>

          <Panel title="Internal notes" description="Only the FitWorks team sees this.">
            <Textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Who you've called, what the gym said, anything the next person picking this up should know…"
            />
            <Button loading={savingNotes} onClick={saveNotes} variant="secondary" block className="mt-3">
              {!savingNotes && <Save className="w-4 h-4" />} Save notes
            </Button>
            {!notes && (
              <p className="text-[11.5px] text-gray-400 mt-3 flex items-start gap-1.5">
                <StickyNote className="w-3.5 h-3.5 shrink-0 mt-px" />
                Notes are never shown to the gym or the trainer.
              </p>
            )}
          </Panel>
        </div>
      </div>

      {picker && (
        <TrainerPicker
          jobId={id}
          defaultCity={gym.address?.city}
          defaultSpecialization={vacancy.requirements?.specialization}
          onAdded={(row) => setShortlist((prev) => [row, ...prev])}
          onClose={() => {
            setPicker(false);
            load();
          }}
        />
      )}
    </div>
  );
}
