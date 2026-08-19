"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Loader2, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";

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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Find Verified Trainers</h1>
          <p className="text-sm text-gray-500 mt-1">Browse pre-screened fitness professionals and send direct interview invitations.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by city (e.g. Mumbai, Delhi, Bangalore)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-1 focus:ring-[#d91a24]"
          />
        </div>

        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="py-2.5 px-4 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-semibold text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Specializations</option>
          <option value="Yoga">Yoga</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Pilates">Pilates</option>
          <option value="Strength">Strength & Conditioning</option>
          <option value="HIIT">HIIT</option>
        </select>

        <Button type="submit" className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-6 font-semibold rounded-xl h-11">
          Filter
        </Button>
      </form>

      {/* Trainers Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No verified trainers found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Try broadening your search query or removing specialization filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col justify-between">
              <div>
                {/* Avatar & Title */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-extrabold text-lg shrink-0">
                    {trainer.personal.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-900 truncate">{trainer.personal.fullName}</h3>
                    <p className="text-xs font-semibold text-[#d91a24] truncate">{trainer.professional.professionalTitle}</p>
                  </div>
                  <span className="p-1 rounded-full bg-green-50 text-green-600" title="Verified">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {trainer.personal.city}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {trainer.professional.yearsOfExperience} yrs exp
                  </span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {trainer.professional.specializations.map((spec) => (
                    <span key={spec} className="text-[11px] font-semibold px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-100 rounded-lg">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Expected Salary */}
                {trainer.workPreferences?.expectedMonthlySalary && (
                  <p className="text-xs text-gray-500 mb-4">
                    Expected: <span className="font-bold text-gray-900">₹{trainer.workPreferences.expectedMonthlySalary} / mo</span>
                  </p>
                )}
              </div>

              <Button
                onClick={() => setSelectedTrainer(trainer)}
                className="w-full bg-gray-900 hover:bg-[#d91a24] text-white rounded-xl text-xs font-bold h-10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Invite to Connect
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Connection Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-base">
                {selectedTrainer.personal.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Invite {selectedTrainer.personal.fullName}</h3>
                <p className="text-xs text-gray-500">{selectedTrainer.professional.professionalTitle} • {selectedTrainer.personal.city}</p>
              </div>
            </div>

            {successMessage ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold flex items-center gap-2.5 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Invitation Message</label>
                    <textarea
                      rows={4}
                      value={connectionMessage}
                      onChange={(e) => setConnectionMessage(e.target.value)}
                      placeholder="Hi! We saw your profile on FitWorks and would love to discuss a trainer opportunity at our gym..."
                      className="w-full p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-1 focus:ring-[#d91a24]"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Note: FitWorks preserves member privacy. The trainer will receive your invitation and can accept to initiate an interview.
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTrainer(null)}
                      className="rounded-xl border-gray-200 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendConnection}
                      disabled={sending}
                      className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl font-bold px-6"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invitation"}
                    </Button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
