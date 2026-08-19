"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerProfilePage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
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
      setFormData((prev: any) => ({ ...prev, [name]: value }));
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

      const payload = {
        personal: formData.personal,
        professional: {
          ...formData.professional,
          yearsOfExperience: Number(formData.professional.yearsOfExperience) || 1,
          specializations: formData.professional.specializations.split(",").map(s => s.trim()).filter(Boolean),
          skills: formData.professional.skills.split(",").map(s => s.trim()).filter(Boolean),
        },
        workPreferences: formData.workPreferences,
      };

      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to update profile.");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save Trainer Profile Error:", err);
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
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Trainer Profile Details</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your specializations, professional bio, and work preferences.</p>
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
        
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#d91a24]" /> Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Full Name</label>
              <input
                type="text"
                name="personal.fullName"
                required
                value={formData.personal.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">City</label>
              <input
                type="text"
                name="personal.city"
                required
                value={formData.personal.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Area / Locality</label>
              <input
                type="text"
                name="personal.location"
                value={formData.personal.location}
                onChange={handleChange}
                placeholder="e.g. Bandra, Andheri"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#d91a24]" /> Professional Background
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Professional Title</label>
              <input
                type="text"
                name="professional.professionalTitle"
                required
                value={formData.professional.professionalTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Yoga Instructor, Strength Coach"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Years of Experience</label>
              <input
                type="number"
                name="professional.yearsOfExperience"
                min="0"
                required
                value={formData.professional.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Specializations (comma separated)</label>
              <input
                type="text"
                name="professional.specializations"
                required
                value={formData.professional.specializations}
                onChange={handleChange}
                placeholder="Yoga, CrossFit, HIIT, Pilates, Nutrition"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Professional Bio & Coaching Philosophy</label>
              <textarea
                name="professional.bio"
                rows={3}
                value={formData.professional.bio}
                onChange={handleChange}
                placeholder="Share your coaching background, certifications, and client achievements..."
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>
        </div>

        {/* Work Preferences */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#d91a24]" /> Work & Salary Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Expected Monthly Salary (₹)</label>
              <input
                type="text"
                name="workPreferences.expectedMonthlySalary"
                value={formData.workPreferences.expectedMonthlySalary}
                onChange={handleChange}
                placeholder="e.g. 35,000"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Availability</label>
              <select
                name="workPreferences.availability"
                value={formData.workPreferences.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] cursor-pointer"
              >
                <option value="Immediate">Immediate</option>
                <option value="15 Days Notice">15 Days Notice</option>
                <option value="1 Month Notice">1 Month Notice</option>
              </select>
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
