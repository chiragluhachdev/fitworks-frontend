"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Award,
  X,
  User,
  GraduationCap,
  FileCheck,
  Calendar,
  IndianRupee,
  Eye,
  Check,
  ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTrainer, setSelectedTrainer] = useState<any | null>(null);

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/trainers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTrainers(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch trainers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleVerify = async (id: string, status: "verified" | "rejected") => {
    try {
      const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/admin/trainers/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success(`Trainer verification status updated to ${status}`);
        if (selectedTrainer && selectedTrainer._id === id) {
          setSelectedTrainer((prev: any) => ({ ...prev, verificationStatus: status }));
        }
        fetchTrainers(); // Refresh
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Network error updating trainer status");
    }
  };

  const filteredTrainers = trainers.filter((t) => {
    const name = t.personal?.fullName?.toLowerCase() || "";
    const title = t.professional?.professionalTitle?.toLowerCase() || "";
    const city = t.personal?.city?.toLowerCase() || "";
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                          title.includes(searchTerm.toLowerCase()) || 
                          city.includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && t.verificationStatus === filterStatus;
  });

  const pendingCount = trainers.filter(t => t.verificationStatus === "pending").length;
  const verifiedCount = trainers.filter(t => t.verificationStatus === "verified").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trainers & Verification</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Review professional profiles, audit credentials in modal view, and grant verification badges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
            {pendingCount} Pending Review
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-green-50 text-green-800 border border-green-200/60">
            {verifiedCount} Verified
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, title, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: `All (${trainers.length})` },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "verified", label: `Verified (${verifiedCount})` },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-[#d91a24] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trainers Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col h-64 items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#d91a24] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading trainers directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Trainer Profile</th>
                  <th className="px-6 py-4">Location & Experience</th>
                  <th className="px-6 py-4">Specializations</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTrainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Trainer Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black text-sm shrink-0">
                          {trainer.personal?.fullName?.charAt(0) || "T"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            {trainer.personal?.fullName}
                            {trainer.verificationStatus === "verified" && (
                              <ShieldCheck className="w-4 h-4 text-[#d91a24] shrink-0" />
                            )}
                          </div>
                          <div className="text-xs font-medium text-[#d91a24]">
                            {trainer.professional?.professionalTitle || "Fitness Trainer"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location & Exp */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {trainer.personal?.city || "India"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {trainer.professional?.yearsOfExperience || 0} Years Exp
                        </div>
                      </div>
                    </td>

                    {/* Specializations */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {trainer.professional?.specializations?.slice(0, 2).map((spec: string, idx: number) => (
                          <span key={idx} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            {spec}
                          </span>
                        ))}
                        {(trainer.professional?.specializations?.length || 0) > 2 && (
                          <span className="text-[10px] font-bold text-gray-400 self-center">
                            +{trainer.professional.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="px-6 py-4">
                      {trainer.verificationStatus === "verified" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          Verified
                        </span>
                      )}
                      {trainer.verificationStatus === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Pending Review
                        </span>
                      )}
                      {trainer.verificationStatus === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTrainer(trainer)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Profile
                      </button>

                      {trainer.verificationStatus !== "verified" && (
                        <button 
                          onClick={() => handleVerify(trainer._id, "verified")}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {trainer.verificationStatus !== "rejected" && (
                        <button 
                          onClick={() => handleVerify(trainer._id, "rejected")}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </td>

                  </tr>
                ))}

                {filteredTrainers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <Award className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">No trainers match your filter</p>
                        <p className="text-xs text-gray-400">Try adjusting your search keywords or status tab.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TRAINER PROFILE DETAILS MODAL */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black text-lg">
                  {selectedTrainer.personal?.fullName?.charAt(0) || "T"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {selectedTrainer.personal?.fullName}
                    {selectedTrainer.verificationStatus === "verified" && (
                      <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-semibold text-[#d91a24]">
                    {selectedTrainer.professional?.professionalTitle || "Fitness Trainer"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTrainer(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
              
              {/* Bio */}
              {selectedTrainer.professional?.bio && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Professional Summary</h4>
                  <p className="text-xs md:text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                    {selectedTrainer.professional.bio}
                  </p>
                </div>
              )}

              {/* Personal & Experience Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Experience</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                    {selectedTrainer.professional?.yearsOfExperience || 0} Years
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Location</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                    {selectedTrainer.personal?.city || "India"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Gender</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block capitalize">
                    {selectedTrainer.personal?.gender || "Not specified"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Expected Salary</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                    {selectedTrainer.workPreferences?.expectedMonthlySalary || "Market standard"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Availability</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block capitalize">
                    {selectedTrainer.workPreferences?.availability || "Immediate"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Education</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block truncate">
                    {selectedTrainer.professional?.education || "Certified"}
                  </span>
                </div>
              </div>

              {/* Specializations & Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Specializations & Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTrainer.professional?.specializations?.map((s: string, idx: number) => (
                    <span key={idx} className="bg-red-50 text-[#d91a24] border border-red-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {s}
                    </span>
                  ))}
                  {selectedTrainer.professional?.skills?.map((sk: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {selectedTrainer.professional?.certifications && selectedTrainer.professional.certifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Certifications</h4>
                  <div className="space-y-1.5">
                    {selectedTrainer.professional.certifications.map((cert: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#d91a24]" />
                          {typeof cert === "string" ? cert : cert.name}
                        </span>
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
                            Verify Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Documents Uploaded */}
              {selectedTrainer.verificationDocuments && selectedTrainer.verificationDocuments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Submitted Verification Documents</h4>
                  <div className="space-y-1.5">
                    {selectedTrainer.verificationDocuments.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                        <span className="font-semibold text-amber-900 flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-amber-600" />
                          Document #{idx + 1}
                        </span>
                        <a href={doc} target="_blank" rel="noreferrer" className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1">
                          View Attachment <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-gray-400">
                Trainer ID: <span className="font-mono text-gray-600">{selectedTrainer._id}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedTrainer.verificationStatus !== "verified" && (
                  <button
                    onClick={() => handleVerify(selectedTrainer._id, "verified")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Approve Trainer
                  </button>
                )}
                {selectedTrainer.verificationStatus !== "rejected" && (
                  <button
                    onClick={() => handleVerify(selectedTrainer._id, "rejected")}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
