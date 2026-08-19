"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
  Calendar,
  Globe,
  ExternalLink,
  Users,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface Job {
  _id: string;
  position: string;
  description: string;
  requirements: {
    experience?: string;
    specialization?: string;
    trainerTypes?: string[];
    preferredExperience?: string;
  };
  salaryRange: string;
  employmentType: string;
  location: string;
  numberOfOpenings?: number;
  gymId: {
    _id: string;
    gymName: string;
    gymLogo?: string;
    slug?: string;
    gymDescription?: string;
    website?: string;
    instagram?: string;
    numberOfLocations?: number;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
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

  // Modal State for Viewing Details & Applying
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
      const token = typeof window !== "undefined" 
        ? (localStorage.getItem("fitworks_token") || localStorage.getItem("token")) 
        : null;

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

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Application submitted successfully!");
        toast.success("Application submitted successfully!");
        setTimeout(() => {
          setSelectedJob(null);
          setSuccessMsg(null);
          setCoverLetter("");
        }, 1800);
      } else {
        setErrorMsg(data.message || "Failed to submit application");
        toast.error(data.message || "Failed to submit application");
      }
    } catch (err) {
      setErrorMsg("Network error submitting application");
      toast.error("Network error submitting application");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#d91a24] bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Open Hiring Positions
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">Find Trainer Vacancies</h1>
          <p className="text-sm text-gray-500 mt-1">Browse verified gym openings, inspect facility details, and apply directly.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>
          <Button type="submit" className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-5 rounded-xl text-sm font-semibold cursor-pointer">
            Search
          </Button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["", "Full-time", "Part-time", "Freelance", "Personal Trainer"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedType === type
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50"
            }`}
          >
            {type === "" ? "All Employment Types" : type}
          </button>
        ))}
      </div>

      {/* Vacancy Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading open job positions...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No vacancies found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Try clearing your filters or searching for another city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              onClick={() => {
                setSelectedJob(job);
                setSuccessMsg(null);
                setErrorMsg(null);
              }}
              className="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {job.gymId?.gymLogo ? (
                      <div className="w-11 h-11 rounded-2xl overflow-hidden border border-gray-200 shadow-2xs relative shrink-0">
                        <Image src={job.gymId.gymLogo} alt={job.gymId.gymName || "Gym"} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                        {job.gymId?.gymName?.charAt(0) || "G"}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#d91a24] transition-colors line-clamp-1">
                        {job.position}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        {job.gymId?.gymName || "Verified Gym Partner"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full shrink-0">
                    {job.employmentType}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {job.location || job.gymId?.address?.city || "India"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-gray-900 font-bold">
                    <IndianRupee className="w-3 h-3" />
                    {job.salaryRange}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {job.createdAt ? `Posted ${new Date(job.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}` : "Recently posted"}
                </span>

                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                    setSuccessMsg(null);
                    setErrorMsg(null);
                  }}
                  className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl text-xs font-bold h-9 px-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View & Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JOB & GYM DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                {selectedJob.gymId?.gymLogo ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative shrink-0">
                    <Image src={selectedJob.gymId.gymLogo} alt="Logo" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-bold text-lg shrink-0">
                    {selectedJob.gymId?.gymName?.charAt(0) || "G"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedJob.position}</h3>
                  <p className="text-xs font-semibold text-[#d91a24] flex items-center gap-1 mt-0.5">
                    {selectedJob.gymId?.gymName || "FitWorks Gym Partner"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedJob(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
              
              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Monthly Salary</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">{selectedJob.salaryRange}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Employment</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">{selectedJob.employmentType}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Location</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                    {selectedJob.location || selectedJob.gymId?.address?.city || "India"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Required Experience</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                    {selectedJob.requirements?.experience || selectedJob.requirements?.preferredExperience || "1-3 Years"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Specialization</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                    {selectedJob.requirements?.specialization || "General Fitness"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Openings</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                    {selectedJob.numberOfOpenings || 1} Trainer(s)
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Job Description & Responsibilities</h4>
                <p className="text-xs md:text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              {/* Gym Facility Details */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    About {selectedJob.gymId?.gymName || "Gym Partner"}
                  </h4>
                  {selectedJob.gymId?.numberOfLocations && (
                    <span className="text-[10px] font-bold bg-blue-100/70 text-blue-800 px-2 py-0.5 rounded-md">
                      {selectedJob.gymId.numberOfLocations} Branch(es)
                    </span>
                  )}
                </div>

                {selectedJob.gymId?.gymDescription && (
                  <p className="text-xs text-blue-950/80 leading-relaxed">
                    {selectedJob.gymId.gymDescription}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-900 pt-1">
                  {selectedJob.gymId?.address?.street && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {selectedJob.gymId.address.street}, {selectedJob.gymId.address.city}
                    </span>
                  )}
                  {selectedJob.gymId?.website && (
                    <a 
                      href={selectedJob.gymId.website.startsWith("http") ? selectedJob.gymId.website : `https://${selectedJob.gymId.website}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[#d91a24] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Visit Gym Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedJob.gymId?.instagram && (
                    <span className="text-gray-500 font-normal">
                      Instagram: @{selectedJob.gymId.instagram.replace("@", "")}
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Letter / Note to Gym */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Cover Note / Pitch to Hiring Manager (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                  placeholder="Introduce yourself, your key coaching certifications, and why you are a great fit for this gym..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              {/* Status feedback */}
              {successMsg && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600" />
                  {errorMsg}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <button
                onClick={() => setSelectedJob(null)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 px-4 py-2 cursor-pointer"
              >
                Close
              </button>

              <Button
                onClick={handleApply}
                disabled={applying}
                className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl text-xs font-bold h-10 px-6 flex items-center gap-2 shadow-sm shadow-red-500/20 cursor-pointer disabled:opacity-50"
              >
                {applying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
