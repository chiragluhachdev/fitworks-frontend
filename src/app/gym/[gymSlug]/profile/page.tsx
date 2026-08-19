"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Share2, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GymProfilePage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    gymName: "",
    gymDescription: "",
    website: "",
    instagram: "",
    numberOfLocations: 1,
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    hiringInformation: {
      trainersRequired: 2,
      trainerTypes: [] as string[],
      preferredExperience: "1-3 Years",
      salaryBudget: "25000-35000",
      hiringFrequency: "Regular",
    },
    contactPerson: {
      name: "",
      designation: "Owner",
      phone: "",
    },
  });

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/gyms/${gymSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            gymName: json.data.gymName || "",
            gymDescription: json.data.gymDescription || "",
            website: json.data.website || "",
            instagram: json.data.instagram || "",
            numberOfLocations: json.data.numberOfLocations || 1,
            address: json.data.address || { street: "", city: "", state: "", pincode: "" },
            hiringInformation: json.data.hiringInformation || {
              trainersRequired: 2,
              trainerTypes: ["Yoga", "Strength"],
              preferredExperience: "1-3 Years",
              salaryBudget: "25000-35000",
              hiringFrequency: "Regular",
            },
            contactPerson: json.data.contactPerson || { name: "", designation: "Owner", phone: "" },
          });
        }
      } catch (err) {
        console.error("Fetch Gym Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [gymSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/gyms/${gymSlug}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update profile.");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Network error saving profile.");
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Gym Profile & Information</h1>
        <p className="text-sm text-gray-500 mt-1">Keep your gym details and hiring preferences up to date.</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-[#d91a24] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#d91a24]" /> Basic Gym Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Gym / Facility Name</label>
              <input
                type="text"
                name="gymName"
                required
                value={formData.gymName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Gym Description</label>
              <textarea
                name="gymDescription"
                required
                rows={3}
                value={formData.gymDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Website URL (Optional)</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://powerfit.in"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Instagram Handle (Optional)</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@powerfit_studio"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#d91a24]" /> Location & Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Street Address</label>
              <input
                type="text"
                name="address.street"
                required
                value={formData.address.street}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">City</label>
              <input
                type="text"
                name="address.city"
                required
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">State</label>
              <input
                type="text"
                name="address.state"
                required
                value={formData.address.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-8 h-12 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>

      </form>

    </div>
  );
}
