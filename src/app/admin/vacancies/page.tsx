"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Briefcase, 
  Search, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminVacancies() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchVacancies = async () => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/vacancies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setVacancies(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch vacancies directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const filteredVacancies = vacancies.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const gym = job.gymId?.gymName?.toLowerCase() || "";
    const location = job.location?.city?.toLowerCase() || "";
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || 
                          gym.includes(searchTerm.toLowerCase()) || 
                          location.includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && job.status === statusFilter;
  });

  const openCount = vacancies.filter(v => v.status === "open").length;
  const closedCount = vacancies.filter(v => v.status === "closed").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Job Vacancies & Openings</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Directory of all open and closed trainer vacancies posted by partner gyms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            {openCount} Open Positions
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 border border-gray-200">
            {closedCount} Closed
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by position title or gym name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: `All (${vacancies.length})` },
            { id: "open", label: `Active Openings (${openCount})` },
            { id: "closed", label: `Closed (${closedCount})` },
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

      {/* Vacancies Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-64 items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading vacancies...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Job Position</th>
                  <th className="px-6 py-4">Posting Gym</th>
                  <th className="px-6 py-4">Salary Package</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVacancies.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Position */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">
                        {job.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                          {job.employmentType || "Full-time"}
                        </span>
                        <span>{job.vacanciesCount || 1} Openings</span>
                      </div>
                    </td>

                    {/* Gym */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-xs shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">
                            {job.gymId?.gymName || "FitWorks Partner Gym"}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location?.city || "India"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-900 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                        {job.salaryRange?.min?.toLocaleString()} - {job.salaryRange?.max?.toLocaleString()}
                        <span className="text-[10px] text-gray-400 font-normal ml-1">/ mo</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {job.status === "open" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle className="w-3.5 h-3.5 text-gray-400" />
                          Closed
                        </span>
                      )}
                    </td>

                    {/* Date Posted */}
                    <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                      {job.createdAt ? format(new Date(job.createdAt), "MMM d, yyyy") : "Recent"}
                    </td>

                  </tr>
                ))}

                {filteredVacancies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">No vacancies match criteria</p>
                        <p className="text-xs text-gray-400">Try adjusting your filters.</p>
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
