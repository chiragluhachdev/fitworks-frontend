"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldAlert, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [otpEnabled, setOtpEnabled] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("fitworks_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      
      const res = await fetch(`${apiUrl}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setOtpEnabled(data.data.otpEnabled);
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("fitworks_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      
      const res = await fetch(`${apiUrl}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otpEnabled }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings.");
      }
    } catch (err) {
      console.error("Failed to update settings", err);
      toast.error("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Settings</h1>
          <p className="text-gray-500 text-sm">Manage platform-wide configuration and feature flags.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Authentication & Security</h2>
          <p className="text-sm text-gray-500 mb-6">Control how users sign up and log in to the platform.</p>

          <div className="flex items-start justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-gray-900">OTP Verification</h3>
              </div>
              <p className="text-sm text-gray-500 max-w-lg">
                Require users to verify their phone number via SMS OTP during registration and login.
                If disabled, users can register without OTP and cannot use OTP to log in.
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={otpEnabled} 
                onChange={(e) => setOtpEnabled(e.target.checked)} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d91a24]"></div>
              <span className="ml-3 text-sm font-bold text-gray-700 w-12">
                {otpEnabled ? "ON" : "OFF"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
