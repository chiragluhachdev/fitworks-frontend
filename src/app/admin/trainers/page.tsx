"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/trainers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTrainers(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleVerify = async (id: string, status: "verified" | "rejected") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/trainers/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success(`Trainer marked as ${status}`);
        fetchTrainers(); // Refresh
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trainers Directory</h1>
        <p className="text-neutral-400">Manage and verify trainer profiles.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Name / Title</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Verification</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {trainers.map((trainer) => (
                <tr key={trainer._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{trainer.personal?.fullName}</div>
                    <div className="text-xs text-neutral-500 mt-1">{trainer.professional?.professionalTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    {trainer.personal?.city}, {trainer.personal?.location}
                  </td>
                  <td className="px-6 py-4">
                    {trainer.verificationStatus === "verified" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {trainer.verificationStatus === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <AlertCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    {trainer.verificationStatus === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {trainer.verificationStatus !== "verified" && (
                      <button 
                        onClick={() => handleVerify(trainer._id, "verified")}
                        className="text-green-400 hover:text-green-300 text-xs font-medium px-3 py-1.5 rounded bg-green-400/10 hover:bg-green-400/20 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {trainer.verificationStatus !== "rejected" && (
                      <button 
                        onClick={() => handleVerify(trainer._id, "rejected")}
                        className="text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1.5 rounded bg-red-400/10 hover:bg-red-400/20 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                    <a href={`/trainer/${trainer.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-hover text-xs font-medium px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors ml-2">
                      View Profile
                    </a>
                  </td>
                </tr>
              ))}
              {trainers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No trainers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
