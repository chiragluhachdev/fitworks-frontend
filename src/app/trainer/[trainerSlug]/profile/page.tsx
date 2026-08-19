"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Award, 
  IndianRupee, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  Sparkles,
  UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
];

export default function TrainerProfilePage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "fitworks/profiles");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev: any) => ({
          ...prev,
          personal: { ...prev.personal, profilePhoto: data.url },
        }));
        toast.success("Profile photo uploaded to Cloudinary!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Network error during file upload");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      profilePhoto: "",
      city: "",
      location: "",
    },
    professional: {
      professionalTitle: "",
      yearsOfExperience: 1,
      specializations: "",
      skills: "",
      education: "",
      bio: "",
    },
    workPreferences: {
      expectedMonthlySalary: "",
      availability: "Immediate",
      willingToRelocate: false,
    },
  });

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/trainers/${trainerSlug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const t = json.data;
          setFormData({
            personal: {
              fullName: t.personal?.fullName || "",
              profilePhoto: t.personal?.profilePhoto || "",
              city: t.personal?.city || "",
              location: t.personal?.location || "",
            },
            professional: {
              professionalTitle: t.professional?.professionalTitle || "",
              yearsOfExperience: t.professional?.yearsOfExperience || 1,
              specializations: Array.isArray(t.professional?.specializations) ? t.professional.specializations.join(", ") : "",
              skills: Array.isArray(t.professional?.skills) ? t.professional.skills.join(", ") : "",
              education: t.professional?.education || "",
              bio: t.professional?.bio || "",
            },
            workPreferences: {
              expectedMonthlySalary: t.workPreferences?.expectedMonthlySalary || "",
              availability: t.workPreferences?.availability || "Immediate",
              willingToRelocate: Boolean(t.workPreferences?.willingToRelocate),
            },
          });
        }
      } catch (err) {
        console.error("Fetch Trainer Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [trainerSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { 
          ...prev[parent], 
          [child]: type === "checkbox" ? checked : value 
        },
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

      const payload = {
        personal: {
          ...formData.personal,
        },
        professional: {
          ...formData.professional,
          yearsOfExperience: Number(formData.professional.yearsOfExperience),
          specializations: formData.professional.specializations.split(",").map(s => s.trim()).filter(Boolean),
          skills: formData.professional.skills.split(",").map(s => s.trim()).filter(Boolean),
        },
        workPreferences: {
          ...formData.workPreferences,
        },
      };

      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        toast.success("Trainer profile and photo updated successfully!");
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
        <p className="text-xs font-semibold text-gray-500">Loading trainer profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Trainer Profile & Photo</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public trainer showcase card, headshot photo, and coaching credentials.</p>
        </div>

        <Button 
          type="submit" 
          form="trainer-profile-form" 
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
          Profile updated successfully! All changes are live on FitWorks.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      <form id="trainer-profile-form" onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Photo Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Profile Photo & Avatar</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative">
              {formData.personal.profilePhoto ? (
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-red-100 shadow-sm relative">
                  <Image 
                    src={formData.personal.profilePhoto} 
                    alt="Profile Photo" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-red-50 text-[#d91a24] border-2 border-red-100 flex items-center justify-center font-black text-3xl shadow-sm">
                  {formData.personal.fullName?.charAt(0) || "T"}
                </div>
              )}
            </div>

            {/* Upload Button, URL Input & Presets */}
            <div className="flex-1 space-y-3.5 w-full">
              
              {/* Direct Device Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Upload Photo from Device (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 bg-[#d91a24] hover:bg-[#cc1616] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all">
                    {uploadingPhoto ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    {uploadingPhoto ? "Uploading to Cloudinary..." : "Choose Headshot Photo"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handlePhotoFileUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400">JPG, PNG, or WEBP up to 10MB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Or Paste Photo Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="personal.profilePhoto"
                    placeholder="https://... or paste image URL"
                    value={formData.personal.profilePhoto}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
                  />
                </div>
              </div>

              {/* Quick Preset Avatars */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Or pick a professional fitness avatar preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, personal: { ...prev.personal, profilePhoto: url } }))}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                        formData.personal.profilePhoto === url 
                          ? "border-[#d91a24] scale-105 shadow-sm" 
                          : "border-transparent hover:border-gray-300 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image src={url} alt={`Preset ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                  {formData.personal.profilePhoto && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, personal: { ...prev.personal, profilePhoto: "" } }))}
                      className="text-xs text-red-600 hover:underline self-center ml-2 cursor-pointer font-bold"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <User className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="personal.fullName"
                required
                value={formData.personal.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                name="personal.city"
                required
                value={formData.personal.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Local Area / Landmark</label>
            <input
              type="text"
              name="personal.location"
              value={formData.personal.location}
              onChange={handleChange}
              placeholder="e.g. Bandra West, Indiranagar"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Briefcase className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Professional Coaching Experience</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Professional Title</label>
              <input
                type="text"
                name="professional.professionalTitle"
                required
                placeholder="e.g. Senior Functional & Strength Coach"
                value={formData.professional.professionalTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Years of Experience</label>
              <input
                type="number"
                name="professional.yearsOfExperience"
                min="0"
                max="50"
                required
                value={formData.professional.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Specializations <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="professional.specializations"
              placeholder="e.g. CrossFit, Kettlebell, HIIT, Weight Loss, Powerlifting"
              value={formData.professional.specializations}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Core Skills & Tools <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="professional.skills"
              placeholder="e.g. CPR Certified, Body Composition Analysis, Nutritional Guidance"
              value={formData.professional.skills}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Education / Primary Certification</label>
            <input
              type="text"
              name="professional.education"
              placeholder="e.g. ACE Certified Personal Trainer, B.Sc Physical Education"
              value={formData.professional.education}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Professional Bio & Coaching Philosophy</label>
            <textarea
              rows={4}
              name="professional.bio"
              placeholder="Describe your training methodology, client transformation philosophy, and track record..."
              value={formData.professional.bio}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
            />
          </div>
        </div>

        {/* Work Preferences */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <IndianRupee className="w-5 h-5 text-[#d91a24]" />
            <h2 className="text-lg font-bold text-gray-900">Salary & Availability Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Expected Monthly Compensation</label>
              <input
                type="text"
                name="workPreferences.expectedMonthlySalary"
                placeholder="e.g. ₹40,000 - ₹55,000 / month"
                value={formData.workPreferences.expectedMonthlySalary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Availability Status</label>
              <select
                name="workPreferences.availability"
                value={formData.workPreferences.availability}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
              >
                <option value="Immediate">Immediate (Within 1-7 days)</option>
                <option value="15 Days">15 Days Notice</option>
                <option value="1 Month">1 Month Notice</option>
                <option value="Part-time Only">Part-time / Freelance Hours</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="workPreferences.willingToRelocate"
                checked={formData.workPreferences.willingToRelocate}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#d91a24] focus:ring-[#d91a24]"
              />
              <span className="text-sm font-medium text-gray-700">Open to relocation for premium gym assignments</span>
            </label>
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
            {saving ? "Saving Changes..." : "Save Trainer Profile"}
          </Button>
        </div>

      </form>

    </div>
  );
}
