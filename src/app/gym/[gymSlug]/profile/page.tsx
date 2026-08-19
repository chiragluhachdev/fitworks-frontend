"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Share2, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save,
  Camera,
  Image as ImageIcon,
  Sparkles,
  User,
  Briefcase,
  UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const PRESET_GYM_LOGOS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80",
];

export default function GymProfilePage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "fitworks/gyms");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev: any) => ({ ...prev, gymLogo: data.url }));
        toast.success("Gym brand logo uploaded to Cloudinary!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Network error during file upload");
    } finally {
      setUploadingLogo(false);
    }
  };

  const [formData, setFormData] = useState({
    gymName: "",
    gymLogo: "",
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
            gymLogo: json.data.gymLogo || "",
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
    setSuccess(false);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" 
        ? (localStorage.getItem("fitworks_token") || localStorage.getItem("token")) 
        : null;

      const res = await fetch(`${apiUrl}/gyms/${gymSlug}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        toast.success("Gym profile and logo updated successfully!");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to update profile");
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error updating profile");
      toast.error("Network error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading gym profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Gym Profile & Logo</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your fitness center profile, official brand logo, and hiring criteria.</p>
        </div>

        <Button 
          type="submit" 
          form="gym-profile-form" 
          disabled={saving}
          className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-6 h-11 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving Changes..." : "Save Profile"}
        </Button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          Gym information updated successfully! All changes are live on FitWorks.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      <form id="gym-profile-form" onSubmit={handleSave} className="space-y-6">
        
        {/* Brand Logo Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Official Gym Logo</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo Preview */}
            <div className="relative">
              {formData.gymLogo ? (
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-red-100 shadow-sm relative">
                  <Image 
                    src={formData.gymLogo} 
                    alt="Gym Logo" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 border-2 border-blue-100 flex items-center justify-center font-black text-3xl shadow-sm">
                  <Building2 className="w-10 h-10" />
                </div>
              )}
            </div>

            {/* Upload Button, URL input & presets */}
            <div className="flex-1 space-y-3.5 w-full">
              
              {/* Direct Device Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Upload Logo from Device (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 bg-[#d91a24] hover:bg-[#cc1616] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all">
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    {uploadingLogo ? "Uploading to Cloudinary..." : "Choose Brand Logo"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      onChange={handleLogoFileUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400">PNG, JPG, or SVG up to 10MB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Or Paste Brand Logo Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="gymLogo"
                    placeholder="https://... or paste logo URL"
                    value={formData.gymLogo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                  />
                </div>
              </div>

              {/* Quick Preset Logos */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Or pick a gym logo preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_GYM_LOGOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, gymLogo: url }))}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                        formData.gymLogo === url 
                          ? "border-[#d91a24] scale-105 shadow-sm" 
                          : "border-transparent hover:border-gray-300 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image src={url} alt={`Preset ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                  {formData.gymLogo && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, gymLogo: "" }))}
                      className="text-xs text-red-600 hover:underline self-center ml-2 cursor-pointer font-bold"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Facility Information */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Building2 className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Facility Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Gym Name</label>
              <input
                type="text"
                name="gymName"
                required
                value={formData.gymName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Number of Locations</label>
              <input
                type="number"
                name="numberOfLocations"
                min="1"
                required
                value={formData.numberOfLocations}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">About the Gym / Facility Description</label>
            <textarea
              rows={3}
              name="gymDescription"
              placeholder="Describe your gym's training vibe, equipment, client demographic, and specialty programs..."
              value={formData.gymDescription}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="website"
                  placeholder="https://powerfit.in"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Instagram Handle</label>
              <div className="relative">
                <Share2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="instagram"
                  placeholder="@powerfit_india"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <MapPin className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Location & Registered Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Street Address</label>
              <input
                type="text"
                name="address.street"
                required
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Building, Landmark, Area"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                name="address.city"
                required
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">State</label>
              <input
                type="text"
                name="address.state"
                required
                value={formData.address.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Pincode</label>
              <input
                type="text"
                name="address.pincode"
                required
                value={formData.address.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Contact Representative */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <User className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Primary Contact Representative</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Contact Name</label>
              <input
                type="text"
                name="contactPerson.name"
                required
                value={formData.contactPerson.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Designation</label>
              <input
                type="text"
                name="contactPerson.designation"
                required
                value={formData.contactPerson.designation}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Hiring Budget & Needs */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Briefcase className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Hiring Needs & Salary Budget</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Typical Monthly Salary Budget</label>
              <input
                type="text"
                name="hiringInformation.salaryBudget"
                placeholder="e.g. ₹35,000 - ₹50,000 / month"
                value={formData.hiringInformation.salaryBudget}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Experience Preferred</label>
              <input
                type="text"
                name="hiringInformation.preferredExperience"
                placeholder="e.g. 2-5 Years"
                value={formData.hiringInformation.preferredExperience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-8 h-12 rounded-2xl text-sm font-bold shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving Changes..." : "Save Gym Profile"}
          </Button>
        </div>

      </form>

    </div>
  );
}
