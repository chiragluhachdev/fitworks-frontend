"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Send,
  Loader2,
  Briefcase,
  CheckCircle2,
  X,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";

interface Trainer {
  _id: string;
  slug: string;
  personal: {
    fullName: string;
    city: string;
    location?: string;
    profilePhoto?: string;
  };
  professional: {
    professionalTitle: string;
    yearsOfExperience: number;
    specializations: string[];
    bio?: string;
    education?: string;
  };
  workPreferences?: {
    expectedMonthlySalary?: string;
    employmentType?: string[];
    availability?: string;
  };
}

export default function GymFindTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  // Modal State for Connection Request
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      let url = `${apiUrl}/trainers?`;
      if (searchTerm) url += `location=${encodeURIComponent(searchTerm)}&`;
      if (selectedSpecialization) url += `specialization=${encodeURIComponent(selectedSpecialization)}&`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setTrainers(json.data || []);
      }
    } catch (err) {
      console.error("Fetch Trainers Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [selectedSpecialization]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrainers();
  };

  const handleSendConnection = async () => {
    if (!selectedTrainer) return;
    setSending(true);
    setErrorMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          trainerId: selectedTrainer._id,
          message: connectionMessage || "We would like to invite you to interview for a trainer position at our gym.",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.message || "Failed to send request. You may have already connected.");
      } else {
        setSuccessMessage(`Connection request sent to ${selectedTrainer.personal.fullName}!`);
        setTimeout(() => {
          setSelectedTrainer(null);
          setSuccessMessage(null);
          setConnectionMessage("");
        }, 2000);
      }
    } catch (err) {
      console.error("Send connection error:", err);
      setErrorMessage("Network error sending connection request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300">

      {/* ── Header ── */}
      <header className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Find verified trainers
        </h1>
        <p className="text-[13px] sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          Browse pre-screened professionals and send a direct interview invitation.
        </p>
      </header>

      {/* ── Search + filter ── */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] space-y-2.5 sm:space-y-0 sm:flex sm:gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            inputMode="search"
            placeholder="Search by city…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 sm:h-11 pl-10 pr-4 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2.5">
          <div className="relative flex-1 sm:flex-none">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              aria-label="Specialization"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full h-12 sm:h-11 pl-10 pr-8 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none focus:border-[#d91a24]"
            >
              <option value="">All specializations</option>
              <option value="Yoga">Yoga</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Pilates">Pilates</option>
              <option value="Strength">Strength &amp; Conditioning</option>
              <option value="HIIT">HIIT</option>
            </select>
          </div>

          <button
            type="submit"
            className="h-12 sm:h-11 px-6 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold shrink-0 active:scale-[0.98] transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {/* ── Results ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Finding trainers…</p>
        </div>
      ) : trainers.length === 0 ? (
        <div className="bg-white px-6 py-12 text-center rounded-2xl sm:rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
          <span className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-gray-300" />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">No verified trainers found</h2>
          <p className="text-[13px] text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Try a different city or clear the specialization filter. Only trainers approved by our team appear here.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold text-gray-500 px-1">
            {trainers.length} verified trainer{trainers.length === 1 ? "" : "s"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {trainers.map((trainer) => (
              <article
                key={trainer._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] hover:shadow-md hover:border-red-100 transition-all flex flex-col"
              >
                {/* Identity */}
                <div className="flex items-start gap-3 mb-3.5">
                  <span className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-extrabold text-lg shrink-0">
                    {trainer.personal.fullName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[15px] font-bold text-gray-900 truncate">
                        {trainer.personal.fullName}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-label="Verified" />
                    </div>
                    <p className="text-xs font-semibold text-[#d91a24] truncate mt-0.5">
                      {trainer.professional.professionalTitle}
                    </p>
                  </div>
                </div>

                {/* Facts */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-gray-500 font-medium mb-3.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {trainer.personal.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {trainer.professional.yearsOfExperience} yrs
                  </span>
                  {trainer.workPreferences?.expectedMonthlySalary && (
                    <span className="inline-flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-bold text-gray-800">
                        ₹{trainer.workPreferences.expectedMonthlySalary}
                      </span>
                    </span>
                  )}
                </div>

                {/* Specializations */}
                {trainer.professional.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trainer.professional.specializations.slice(0, 4).map((spec) => (
                      <span
                        key={spec}
                        className="text-[11px] font-semibold px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-100 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                    {trainer.professional.specializations.length > 4 && (
                      <span className="text-[11px] font-semibold px-2 py-1 text-gray-400">
                        +{trainer.professional.specializations.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="mt-auto w-full h-12 sm:h-11 rounded-xl bg-gray-900 hover:bg-[#d91a24] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Invite to connect
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      {/* ── Invite sheet (mobile) / modal (desktop) ── */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div
            onClick={() => setSelectedTrainer(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
          />

          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-7 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-250">
            <button
              onClick={() => setSelectedTrainer(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 active:bg-gray-100 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5 pr-10">
              <span className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-extrabold text-lg shrink-0">
                {selectedTrainer.personal.fullName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  Invite {selectedTrainer.personal.fullName}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {selectedTrainer.professional.professionalTitle} • {selectedTrainer.personal.city}
                </p>
              </div>
            </div>

            {successMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold mb-4">
                    {errorMessage}
                  </div>
                )}

                <label htmlFor="invite-message" className="text-xs font-bold text-gray-700 block mb-1.5">
                  Invitation message
                </label>
                <textarea
                  id="invite-message"
                  rows={4}
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  placeholder="Hi! We saw your profile on FitWorks and would love to discuss a trainer opportunity at our gym…"
                  className="w-full p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 resize-none"
                />

                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  The trainer receives your invitation and can accept to start the conversation.
                </p>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-5">
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    className="h-12 sm:h-11 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendConnection}
                    disabled={sending}
                    className="h-12 sm:h-11 px-6 rounded-xl bg-[#d91a24] hover:bg-[#cc1616] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? "Sending…" : "Send invitation"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
