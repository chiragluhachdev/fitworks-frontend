"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications`, {
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

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Job Applications</h1>
        <p className="text-neutral-400">View pipeline of all submitted job applications.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Trainer</th>
                <th className="px-6 py-4 font-medium">Gym</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {app.trainerId?.personal?.fullName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    {app.gymId?.gymName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    {app.jobId?.title || "Unknown Position"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 border border-neutral-700">
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No applications found.
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
