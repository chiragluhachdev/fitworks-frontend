"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function CreateVacancyPage() {
  const router = useRouter();
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    position: "",
    description: "",
    requirements: {
      experience: "1-3 Years",
      specialization: "General Fitness",
    },
    salaryRange: "₹25,000 - ₹35,000",
    employmentType: "Full-time",
    location: "Mumbai",
    numberOfOpenings: "1",
    applicationDeadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          gymSlug,
          ...formData,
          numberOfOpenings: Number(formData.numberOfOpenings) || 1,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to post vacancy. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/gym/${gymSlug}/vacancies`);
    } catch (err) {
      console.error("Create vacancy error:", err);
      setError("Network error connecting to server.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <Link href={`/gym/${gymSlug}/vacancies`} className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vacancies
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#d91a24]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Post a New Vacancy</h1>
            <p className="text-xs text-gray-500 mt-0.5">Publish a job listing to receive applications from pre-verified trainers.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Job Position / Title</label>
              <input
                type="text"
                name="position"
                required
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Senior Strength Coach, Yoga Instructor"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Specialization Required</label>
              <select
                name="requirements.specialization"
                value={formData.requirements.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] cursor-pointer"
              >
                <option value="General Fitness">General Fitness</option>
                <option value="Personal Trainer">Personal Trainer</option>
                <option value="Yoga">Yoga</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Strength">Strength & Conditioning</option>
                <option value="Pilates">Pilates</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Experience Level</label>
              <select
                name="requirements.experience"
                value={formData.requirements.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] cursor-pointer"
              >
                <option value="Entry Level (<1 yr)">Entry Level (&lt;1 yr)</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Salary / Budget Range</label>
              <input
                type="text"
                name="salaryRange"
                required
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. ₹30,000 - ₹45,000 / mo"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Job Location (Area / City)</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bandra West, Mumbai"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Openings Count</label>
              <input
                type="number"
                name="numberOfOpenings"
                min="1"
                required
                value={formData.numberOfOpenings}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block">Job Description & Responsibilities</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe daily duties, class formats, client interaction, and requirements..."
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link href={`/gym/${gymSlug}/vacancies`}>
              <Button type="button" variant="outline" className="border-gray-200 text-gray-700 rounded-xl px-5 h-11 text-sm font-semibold">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl px-7 h-11 text-sm font-bold shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Posting...
                </>
              ) : (
                "Publish Vacancy"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
