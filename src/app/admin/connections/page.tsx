"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { 
  Link2, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminConnections() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setConnections(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch direct connection requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections.filter((conn) => {
    const gymName = conn.gymId?.gymName?.toLowerCase() || "";
    const trainerName = conn.trainerId?.personal?.fullName?.toLowerCase() || "";
    const matchesSearch = gymName.includes(searchTerm.toLowerCase()) || 
                          trainerName.includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && conn.status === statusFilter;
  });

  const pendingCount = connections.filter(c => c.status === "pending").length;
  const acceptedCount = connections.filter(c => c.status === "accepted").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Direct Gym-Trainer Connections</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Audit log of direct interview and hiring invitations sent from gyms to verified trainers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-green-50 text-green-800 border border-green-200/60">
            {acceptedCount} Accepted
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
            {pendingCount} Pending Response
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by gym or trainer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: `All (${connections.length})` },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "accepted", label: `Accepted (${acceptedCount})` },
            { id: "rejected", label: "Declined" },
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

      {/* Connections Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-64 items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading direct connections...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Sender Gym</th>
                  <th className="px-6 py-4">Target Trainer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invitation Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredConnections.map((conn) => (
                  <tr key={conn._id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Gym Logo / Picture */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {conn.gymId?.gymLogo ? (
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-200 relative shrink-0 shadow-2xs">
                            <Image src={conn.gymId.gymLogo} alt="Logo" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {conn.gymId?.gymName?.charAt(0) || "G"}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {conn.gymId?.gymName || "FitWorks Gym Partner"}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {conn.gymId?.slug ? `@${conn.gymId.slug}` : "Gym"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Trainer Profile Photo */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {conn.trainerId?.personal?.profilePhoto ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 relative shrink-0 shadow-2xs">
                            <Image src={conn.trainerId.personal.profilePhoto} alt="Trainer" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {conn.trainerId?.personal?.fullName?.charAt(0) || "T"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-xs">
                            {conn.trainerId?.personal?.fullName || "Trainer"}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {conn.trainerId?.slug ? `@${conn.trainerId.slug}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {conn.status === "accepted" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          Accepted
                        </span>
                      )}
                      {conn.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Response
                        </span>
                      )}
                      {conn.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Declined
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                      {conn.createdAt ? format(new Date(conn.createdAt), "MMM d, yyyy") : "Recent"}
                    </td>

                  </tr>
                ))}

                {filteredConnections.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <Link2 className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">No connections match filters</p>
                        <p className="text-xs text-gray-400">Gym invitations sent to trainers will appear here.</p>
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
