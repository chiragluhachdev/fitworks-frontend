"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function AdminGyms() {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gyms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setGyms(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch gyms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gyms Directory</h1>
        <p className="text-neutral-400">View all registered fitness centers.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Gym Name</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Contact Person</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {gyms.map((gym) => (
                <tr key={gym._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {gym.gymName}
                  </td>
                  <td className="px-6 py-4">
                    {gym.address?.city}, {gym.address?.state}
                  </td>
                  <td className="px-6 py-4">
                    {gym.contactPerson?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={`/gym/${gym.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-hover text-xs font-medium px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors">
                      View Profile
                    </a>
                  </td>
                </tr>
              ))}
              {gyms.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No gyms found.
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
