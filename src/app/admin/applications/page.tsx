"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  FileText, 
  Search, 
  Building2, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles,
  Briefcase
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const trainerName = app.trainerId?.personal?.fullName?.toLowerCase() || "";
    const gymName = app.gymId?.gymName?.toLowerCase() || "";
    const jobTitle = app.jobId?.title?.toLowerCase() || "";
    const matchesSearch = trainerName.includes(searchTerm.toLowerCase()) || 
                          gymName.includes(searchTerm.toLowerCase()) || 
                          jobTitle.includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && app.status === statusFilter;
  });

  const hiredCount = applications.filter(a => a.status === "hired").length;
  const shortlistedCount = applications.filter(a => a.status === "shortlisted").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hiring Applications Pipeline</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Global tracking of candidate submissions, shortlisting stages, and successful gym hires.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            {hiredCount} Placed / Hired
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
            {shortlistedCount} Shortlisted
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by trainer, gym, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: `All (${applications.length})` },
            { id: "applied", label: "Applied" },
            { id: "shortlisted", label: `Shortlisted (${shortlistedCount})` },
            { id: "hired", label: `Hired (${hiredCount})` },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#d91a24] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-64 items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading applications pipeline...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Applicant Trainer</th>
                  <th className="px-6 py-4">Target Position</th>
                  <th className="px-6 py-4">Hiring Gym</th>
                  <th className="px-6 py-4">Pipeline Status</th>
                  <th className="px-6 py-4 text-right">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Trainer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-bold text-xs shrink-0">
                          {app.trainerId?.personal?.fullName?.charAt(0) || "T"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {app.trainerId?.personal?.fullName || "Registered Trainer"}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {app.trainerId?.slug ? `@${app.trainerId.slug}` : "Applicant"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-xs flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {app.jobId?.title || "Trainer Vacancy"}
                      </div>
                    </td>

                    {/* Gym */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900">
                          {app.gymId?.gymName || "FitWorks Gym"}
                        </span>
                      </div>
                    </td>

                    {/* Pipeline Status */}
                    <td className="px-6 py-4">
                      {app.status === "hired" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Hired 🎉
                        </span>
                      )}
                      {app.status === "shortlisted" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Shortlisted
                        </span>
                      )}
                      {app.status === "applied" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          Under Review
                        </span>
                      )}
                      {app.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Declined
                        </span>
                      )}
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                      {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "Recent"}
                    </td>

                  </tr>
                ))}

                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">No applications found</p>
                        <p className="text-xs text-gray-400">Applications submitted by trainers will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
