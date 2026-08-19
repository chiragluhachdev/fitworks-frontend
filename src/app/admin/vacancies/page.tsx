"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function AdminVacancies() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVacancies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/vacancies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setVacancies(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch vacancies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Job Vacancies</h1>
        <p className="text-neutral-400">View all active and closed job postings.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Gym</th>
                <th className="px-6 py-4 font-medium">Salary Range</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {vacancies.map((job) => (
                <tr key={job._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {job.title}
                  </td>
                  <td className="px-6 py-4">
                    {job.gymId?.gymName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    ₹{job.salaryRange?.min.toLocaleString()} - ₹{job.salaryRange?.max.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {job.status === "open" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
              {vacancies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No vacancies found.
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
