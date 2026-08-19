"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Building2, 
  Search, 
  MapPin, 
  User, 
  Briefcase,
  Globe,
  Eye,
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Phone,
  Layers,
  IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AdminGyms() {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [selectedGym, setSelectedGym] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Deletion confirmation
  const [deletingGym, setDeletingGym] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const openGymModal = (gym: any) => {
    setSelectedGym(gym);
    setIsEditing(false);
    setEditFormData({
      gymName: gym.gymName || "",
      gymDescription: gym.gymDescription || "",
      website: gym.website || "",
      instagram: gym.instagram || "",
      numberOfLocations: gym.numberOfLocations || 1,
      address: {
        street: gym.address?.street || "",
        city: gym.address?.city || "",
        state: gym.address?.state || "",
        pincode: gym.address?.pincode || "",
      },
      contactPerson: {
        name: gym.contactPerson?.name || "",
        designation: gym.contactPerson?.designation || "",
        phone: gym.contactPerson?.phone || "",
      },
      hiringInformation: {
        salaryBudget: gym.hiringInformation?.salaryBudget || "",
        preferredExperience: gym.hiringInformation?.preferredExperience || "",
        trainersRequired: gym.hiringInformation?.trainersRequired || 1,
      }
    });
  };

  const handleSaveGymEdit = async () => {
    if (!selectedGym) return;
    setSavingEdit(true);

    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/gyms/${selectedGym._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Gym details updated successfully!");
        setSelectedGym(data.data);
        setIsEditing(false);
        fetchGyms();
      } else {
        toast.error(data.message || "Failed to update gym details");
      }
    } catch (err) {
      toast.error("Network error saving gym edits");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteGym = async () => {
    if (!deletingGym) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/gyms/${deletingGym._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Gym and associated vacancies deleted");
        if (selectedGym && selectedGym._id === deletingGym._id) {
          setSelectedGym(null);
        }
        setDeletingGym(null);
        fetchGyms();
      } else {
        toast.error(data.message || "Failed to delete gym");
      }
    } catch (err) {
      toast.error("Network error deleting gym");
    } finally {
      setIsDeleting(false);
    }
  };

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
            Directory of registered fitness studios. Click on any gym to inspect details, modify parameters, or manage accounts.
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
                  <th className="px-6 py-4">Hiring Budget</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGyms.map((gym) => (
                  <tr 
                    key={gym._id} 
                    onClick={() => openGymModal(gym)}
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    
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
                              <span className="text-[#d91a24] flex items-center gap-0.5 font-medium">
                                <Globe className="w-3 h-3" /> Website
                              </span>
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
                        {gym.address?.street || "Registered Center"}
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
                        {gym.hiringInformation?.salaryBudget || "Market Rate"}
                      </div>
                      <div className="text-[11px] text-[#d91a24] font-medium mt-0.5">
                        {gym.hiringInformation?.preferredExperience || "1-3 Years"} Exp Preferred
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openGymModal(gym);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingGym(gym);
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
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

      {/* GYM DETAILS & EDIT MODAL */}
      {selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedGym.gymName}</h3>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    Slug: <span className="font-mono text-gray-700">@{selectedGym.slug}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isEditing 
                      ? "bg-gray-900 text-white border-gray-900" 
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>

                <button 
                  onClick={() => setSelectedGym(null)}
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
              
              {!isEditing ? (
                <>
                  {/* Read-Only View */}
                  {selectedGym.gymDescription && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About Facility</h4>
                      <p className="text-xs md:text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                        {selectedGym.gymDescription}
                      </p>
                    </div>
                  )}

                  {/* Quick specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Locations</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                        {selectedGym.numberOfLocations || 1} Branch(es)
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">City</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                        {selectedGym.address?.city || "India"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Salary Budget</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                        {selectedGym.hiringInformation?.salaryBudget || "Market Rate"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Contact Name</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                        {selectedGym.contactPerson?.name || "N/A"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Designation</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                        {selectedGym.contactPerson?.designation || "Gym Manager"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Experience Wanted</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                        {selectedGym.hiringInformation?.preferredExperience || "1-3 Years"}
                      </span>
                    </div>
                  </div>

                  {/* Street address & Website */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/70 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-blue-950">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Full Address: </span>
                        <span>{selectedGym.address?.street || "Verified street on file"}, {selectedGym.address?.city}, {selectedGym.address?.state} {selectedGym.address?.pincode}</span>
                      </div>
                    </div>

                    {selectedGym.website && (
                      <div className="flex items-center gap-2 pt-1">
                        <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                        <a 
                          href={selectedGym.website.startsWith("http") ? selectedGym.website : `https://${selectedGym.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#d91a24] font-bold hover:underline flex items-center gap-1"
                        >
                          {selectedGym.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Edit Mode Form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Gym Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                      value={editFormData.gymName}
                      onChange={(e) => setEditFormData({ ...editFormData, gymName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                      value={editFormData.gymDescription}
                      onChange={(e) => setEditFormData({ ...editFormData, gymDescription: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Website URL
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                        value={editFormData.website}
                        onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                        value={editFormData.address?.city}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          address: { ...editFormData.address, city: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                        value={editFormData.contactPerson?.name}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          contactPerson: { ...editFormData.contactPerson, name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                        value={editFormData.contactPerson?.designation}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          contactPerson: { ...editFormData.contactPerson, designation: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Salary Budget
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                        value={editFormData.hiringInformation?.salaryBudget}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          hiringInformation: { ...editFormData.hiringInformation, salaryBudget: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Locations Count
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                        value={editFormData.numberOfLocations}
                        onChange={(e) => setEditFormData({ ...editFormData, numberOfLocations: Number(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setDeletingGym(selectedGym)}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Gym
              </button>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button
                    onClick={handleSaveGymEdit}
                    disabled={savingEdit}
                    className="bg-[#d91a24] hover:bg-[#cc1616] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {savingEdit ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Changes
                  </Button>
                ) : (
                  <button
                    onClick={() => setSelectedGym(null)}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {deletingGym && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Gym Profile</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-bold text-gray-900">{deletingGym.gymName}</span> and all associated job vacancies? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingGym(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGym}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Yes, Delete Gym
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
