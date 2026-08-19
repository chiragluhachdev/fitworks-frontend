"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Building2, 
  Search, 
  MapPin, 
  User, 
  ExternalLink, 
  Briefcase,
  Globe
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminGyms() {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/gyms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setGyms(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch gyms directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  const filteredGyms = gyms.filter((g) => {
    const name = g.gymName?.toLowerCase() || "";
    const city = g.address?.city?.toLowerCase() || "";
    const contact = g.contactPerson?.name?.toLowerCase() || "";
    return name.includes(searchTerm.toLowerCase()) || 
           city.includes(searchTerm.toLowerCase()) || 
           contact.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Partner Gyms & Fitness Centers</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Directory of registered fitness studios, clubs, and corporate gyms across India.
          </p>
        </div>
        <div className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/60 self-start md:self-auto">
          {gyms.length} Registered Gyms
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gyms by name, city, or contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>
      </div>

      {/* Gyms Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-64 items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading gyms directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Gym Facility</th>
                  <th className="px-6 py-4">City & Address</th>
                  <th className="px-6 py-4">Contact Representative</th>
                  <th className="px-6 py-4">Hiring Needs</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGyms.map((gym) => (
                  <tr key={gym._id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Facility */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {gym.gymName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span>{gym.numberOfLocations || 1} Location(s)</span>
                            {gym.website && (
                              <a href={gym.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-600">
                                <Globe className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {gym.address?.city || "India"}, {gym.address?.state || ""}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">
                        {gym.address?.street || "Verified Address on File"}
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {gym.contactPerson?.name || "Primary Contact"}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {gym.contactPerson?.designation || "Gym Manager"}
                      </div>
                    </td>

                    {/* Hiring Needs */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-gray-900">
                        Budget: {gym.hiringInformation?.salaryBudget || "Market Rate"}
                      </div>
                      <div className="text-[11px] text-[#d91a24] font-medium mt-0.5">
                        {gym.hiringInformation?.preferredExperience || "1-3 Years"} Exp Preferred
                      </div>
                    </td>

                    {/* Profile Link */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/gym/${gym.slug}/dashboard`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#d91a24] text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Dashboard
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>

                  </tr>
                ))}

                {filteredGyms.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">No gyms match your query</p>
                        <p className="text-xs text-gray-400">Try searching for a different gym name or city.</p>
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
