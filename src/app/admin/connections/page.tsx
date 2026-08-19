"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function AdminConnections() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/connections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setConnections(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Direct Connections</h1>
        <p className="text-neutral-400">View gym-to-trainer invitation requests.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Gym (Sender)</th>
                <th className="px-6 py-4 font-medium">Trainer (Recipient)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {connections.map((conn) => (
                <tr key={conn._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {conn.gymId?.gymName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    {conn.trainerId?.personal?.fullName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 border border-neutral-700">
                      {conn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(conn.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
              {connections.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No connections found.
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
