"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface TrainerApplication {
  _id: string;
  jobId: {
    _id: string;
    position: string;
    location: string;
    salaryRange: string;
    employmentType: string;
  };
  gymId: {
    _id: string;
    gymName: string;
    slug?: string;
  };
  status: "applied" | "reviewing" | "shortlisted" | "hired" | "rejected";
  createdAt: string;
}

export default function TrainerApplicationsPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const trainerRes = await fetch(`${apiUrl}/trainers/${trainerSlug}`);
      const trainerData = await trainerRes.json();
      if (trainerData.success && trainerData.data) {
        const appRes = await fetch(`${apiUrl}/applications/trainer/${trainerData.data._id}`);
        const appJson = await appRes.json();
        if (appJson.success) {
          setApplications(appJson.data || []);
        }
      }
    } catch (err) {
      console.error("Fetch Trainer Applications Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [trainerSlug]);

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm("Are you sure you want to withdraw and delete this job application?")) {
      return;
    }

    setDeletingId(appId);
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/applications/${appId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Application withdrawn successfully");
        setApplications(prev => prev.filter(a => a._id !== appId));
      } else {
        toast.error(data.message || "Failed to delete application");
      }
    } catch (err) {
      toast.error("Network error withdrawing application");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = applications.filter(a => filter === "all" || a.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">My Job Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Track the hiring status of your submitted gym applications or withdraw them.</p>
        </div>
        <Link href={`/trainer/${trainerSlug}/jobs`}>
          <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-5 h-11 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Apply for More Jobs
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "applied", "shortlisted", "hired", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
              filter === tab
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50"
            }`}
          >
            {tab === "all" ? "All Applications" : tab} ({
              tab === "all" ? applications.length : applications.filter(a => a.status === tab).length
            })
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto mb-6">Browse open vacancies and apply to connect with gym hiring managers.</p>
          <Link href={`/trainer/${trainerSlug}/jobs`}>
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl font-bold px-6 cursor-pointer">
              Browse Vacancies
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div key={app._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-base font-bold text-gray-900">{app.jobId?.position || "Trainer Role"}</h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    app.status === "hired" ? "bg-green-50 text-green-700 border border-green-200" :
                    app.status === "shortlisted" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                    app.status === "rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                    "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {app.status === "applied" ? "Under Review" : app.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#d91a24] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> {app.gymId?.gymName || "Verified Gym Partner"}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-2">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.jobId?.location || "India"}</span>
                  <span>•</span>
                  <span>{app.jobId?.salaryRange}</span>
                  <span>•</span>
                  <span>{app.jobId?.employmentType}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <div className="text-xs text-gray-400 font-medium">
                  Applied on {new Date(app.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </div>

                <button
                  onClick={() => handleDeleteApplication(app._id)}
                  disabled={deletingId === app._id}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200/60 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {deletingId === app._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
