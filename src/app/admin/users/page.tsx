"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Building2, 
  Dumbbell, 
  Calendar,
  Mail,
  UserCheck
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch registered users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const email = u.email?.toLowerCase() || "";
    const matchesSearch = email.includes(searchTerm.toLowerCase());
    if (roleFilter === "all") return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });

  const gymCount = users.filter(u => u.role === "gym").length;
  const trainerCount = users.filter(u => u.role === "trainer").length;
  const adminCount = users.filter(u => u.role === "admin").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Registered User Accounts</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Audit underlying authentication records, credentials, and access roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/60">
            {gymCount} Gyms
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-[#d91a24] border border-red-200/60">
            {trainerCount} Trainers
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: `All Users (${users.length})` },
            { id: "gym", label: `Gym Owners (${gymCount})` },
            { id: "trainer", label: `Trainers (${trainerCount})` },
            { id: "admin", label: `Administrators (${adminCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                roleFilter === tab.id
                  ? "bg-[#d91a24] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-64 items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading user accounts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Account Identifier</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Linked Profile Status</th>
                  <th className="px-6 py-4 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Identifier */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {user.email}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            ID: {user._id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          Master Admin
                        </span>
                      )}
                      {user.role === "gym" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          Gym Partner
                        </span>
                      )}
                      {user.role === "trainer" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-[#d91a24] border border-red-200">
                          <Dumbbell className="w-3.5 h-3.5 text-[#d91a24]" />
                          Fitness Trainer
                        </span>
                      )}
                    </td>

                    {/* Linked Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {user.profileId ? "Profile Linked" : "Active Authentication"}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                      {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "Recent"}
                    </td>

                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <Users className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">No accounts match search criteria</p>
                        <p className="text-xs text-gray-400">Try searching with a different email address.</p>
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
