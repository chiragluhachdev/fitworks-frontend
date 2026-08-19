"use client";

import { useState, useEffect } from "react";
import { Lock, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GymSettingsPage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fitworks_user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u.email) setEmail(u.email);
        } catch (e) {}
      }
    }
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update password.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Network error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Account & Security Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your credentials and login password.</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>Password changed successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#d91a24] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Account Email</h2>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Primary Login Email</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{email || "raj@powerfit.com"}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white text-gray-600 border border-gray-200 rounded-lg">
            Active
          </span>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <KeyRound className="w-5 h-5 text-[#d91a24]" /> Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-7 h-11 rounded-xl text-sm font-bold shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
