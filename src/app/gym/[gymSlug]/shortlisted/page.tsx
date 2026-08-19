"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Users, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  UserPlus, 
  Loader2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationItem {
  _id: string;
  jobId: {
    _id: string;
    position: string;
  };
  trainerId: {
    _id: string;
    slug: string;
    personal: {
      fullName: string;
      city: string;
    };
    professional: {
      professionalTitle: string;
      yearsOfExperience: number;
      specializations: string[];
      bio?: string;
    };
  };
  coverLetter?: string;
  status: "applied" | "reviewing" | "shortlisted" | "hired" | "rejected";
  createdAt: string;
}

export default function GymApplicationsPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      // First get gymId
      const gymRes = await fetch(`${apiUrl}/gyms/${gymSlug}`);
      const gymData = await gymRes.json();
      if (gymData.success && gymData.data) {
        const appRes = await fetch(`${apiUrl}/applications/gym/${gymData.data._id}`);
        const appJson = await appRes.json();
        if (appJson.success) {
          setApplications(appJson.data || []);
        }
      }
    } catch (err) {
      console.error("Fetch Gym Applications Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [gymSlug]);

  const updateStatus = async (appId: string, newStatus: string) => {
    setActionId(appId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/applications/${appId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus as any } : a));
      }
    } catch (err) {
      console.error("Update Status Error:", err);
    } finally {
      setActionId(null);
    }
  };

  const filteredApps = applications.filter(app => {
    if (activeFilter === "all") return true;
    return app.status === activeFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Applications & Hiring Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Review candidates, shortlist profiles, and finalize trainer hires.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "applied", "shortlisted", "hired", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50"
            }`}
          >
            {tab === "all" ? "All Applicants" : tab} ({
              tab === "all" ? applications.length : applications.filter(a => a.status === tab).length
            })
          </button>
        ))}
      </div>

      {/* Candidates List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No applications in this status</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Applications received for your job vacancies will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div key={app._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Candidate Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-base shrink-0">
                  {app.trainerId?.personal?.fullName?.charAt(0) || "T"}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900">{app.trainerId?.personal?.fullName || "Trainer"}</h3>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      app.status === "hired" ? "bg-green-50 text-green-700 border border-green-200" :
                      app.status === "shortlisted" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                      app.status === "rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#d91a24] font-semibold mt-0.5">{app.trainerId?.professional?.professionalTitle || "Fitness Trainer"}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-2 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.trainerId?.personal?.city || "India"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {app.trainerId?.professional?.yearsOfExperience || 1} yrs exp</span>
                    <span>•</span>
                    <span>Applied for: <span className="font-bold text-gray-800">{app.jobId?.position || "Trainer Position"}</span></span>
                  </div>

                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-gray-600 max-w-xl">
                      <p className="font-semibold text-gray-700 mb-0.5">Applicant Note:</p>
                      "{app.coverLetter}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {app.status !== "shortlisted" && app.status !== "hired" && (
                  <Button
                    size="sm"
                    disabled={actionId === app._id}
                    onClick={() => updateStatus(app._id, "shortlisted")}
                    className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-bold"
                  >
                    <Bookmark className="w-3.5 h-3.5 mr-1" /> Shortlist
                  </Button>
                )}

                {app.status !== "hired" && (
                  <Button
                    size="sm"
                    disabled={actionId === app._id}
                    onClick={() => updateStatus(app._id, "hired")}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1" /> Mark Hired
                  </Button>
                )}

                {app.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionId === app._id}
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold"
                  >
                    Reject
                  </Button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
