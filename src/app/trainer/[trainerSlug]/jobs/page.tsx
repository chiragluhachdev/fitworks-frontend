"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Send, 
  Loader2, 
  CheckCircle2, 
  X,
  Building2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  _id: string;
  position: string;
  description: string;
  requirements: {
    experience: string;
    specialization: string;
  };
  salaryRange: string;
  employmentType: string;
  location: string;
  gymId: {
    _id: string;
    gymName: string;
    slug?: string;
  };
  createdAt: string;
}

export default function TrainerFindJobsPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Modal State for Applying
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      let url = `${apiUrl}/jobs?`;
      if (searchTerm) url += `location=${encodeURIComponent(searchTerm)}&`;
      if (selectedType) url += `type=${encodeURIComponent(selectedType)}&`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setJobs(json.data || []);
      }
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setErrorMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          jobId: selectedJob._id,
          coverLetter: coverLetter || "I am very interested in this trainer role and my experience aligns with your requirements.",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.message || "Failed to submit application. You might have already applied.");
      } else {
        setSuccessMsg("Application submitted successfully!");
        setTimeout(() => {
          setSelectedJob(null);
          setSuccessMsg(null);
          setCoverLetter("");
        }, 2000);
      }
    } catch (err) {
      console.error("Apply error:", err);
      setErrorMsg("Network error submitting application.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Explore Open Vacancies</h1>
          <p className="text-sm text-gray-500 mt-1">Discover verified gym positions tailored for certified fitness trainers.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by city or area (e.g. Bandra, Mumbai, Bangalore)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-1 focus:ring-[#d91a24]"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="py-2.5 px-4 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-semibold text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Employment Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>

        <Button type="submit" className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-6 font-semibold rounded-xl h-11">
          Search
        </Button>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No open vacancies found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Check back soon as new gyms publish hiring requirements daily.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.position}</h3>
                    <p className="text-xs font-semibold text-[#d91a24] flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {job.gymId?.gymName || "Verified Gym Partner"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-100 rounded-lg">
                    {job.employmentType}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {job.description}
                </p>

                <div className="space-y-2 text-xs text-gray-500 font-medium mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{job.salaryRange}</span>
                    <span>• {job.requirements?.experience} experience</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setSelectedJob(job)}
                className="w-full bg-gray-900 hover:bg-[#d91a24] text-white rounded-xl text-xs font-bold h-11 transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Apply for this Role
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#d91a24] uppercase tracking-wider">Applying For</span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">{selectedJob.position}</h3>
              <p className="text-xs text-gray-500">{selectedJob.gymId?.gymName} • {selectedJob.location}</p>
            </div>

            {successMsg ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold flex items-center gap-2.5 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold mb-4">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Note to Gym Owner (Optional)</label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly state your availability and why you're a great fit for this role..."
                      className="w-full p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-1 focus:ring-[#d91a24]"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    FitWorks will share your verified certifications, experience, and profile details directly with {selectedJob.gymId?.gymName}.
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedJob(null)}
                      className="rounded-xl border-gray-200 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleApply}
                      disabled={applying}
                      className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl font-bold px-6"
                    >
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
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
