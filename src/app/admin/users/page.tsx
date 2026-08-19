"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Shield, Dumbbell, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Registered Accounts</h1>
        <p className="text-neutral-400">View all User accounts and their associated roles.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {user.role === "admin" && <Shield className="w-4 h-4 text-primary" />}
                    {user.role === "gym" && <Dumbbell className="w-4 h-4 text-blue-400" />}
                    {user.role === "trainer" && <User className="w-4 h-4 text-purple-400" />}
                    <span className="capitalize">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                    No users found.
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
