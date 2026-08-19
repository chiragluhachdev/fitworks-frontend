"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  UploadCloud, 
  Loader2, 
  FileCheck, 
  CreditCard,
  Award,
  Trash2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface RegisterTrainerFlowProps {
  onBack: () => void;
}

export default function RegisterTrainerFlow({ onBack }: RegisterTrainerFlowProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Upload States for Step 4
  const [certDoc, setCertDoc] = useState<{ url: string; name: string } | null>(null);
  const [govIdDoc, setGovIdDoc] = useState<{ url: string; name: string } | null>(null);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadingGovId, setUploadingGovId] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    personal: {
      fullName: "",
      dateOfBirth: "",
      gender: "",
      city: "",
      location: "",
    },
    professional: {
      professionalTitle: "",
      yearsOfExperience: "",
      specializations: "",
      skills: "",
      education: "",
      bio: "",
    },
    workPreferences: {
      expectedMonthlySalary: "",
      employmentType: "Full-time",
      availability: "Immediate",
      willingToRelocate: false,
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState("rahul-sharma");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setErrorMessage(null);
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const val = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: val }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCert(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "fitworks/certificates");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCertDoc({ url: data.url, name: file.name });
        toast.success("Certificate uploaded to Cloudinary!");
      } else {
        toast.error(data.message || "Failed to upload certificate");
      }
    } catch (err) {
      toast.error("Upload error. Please try again.");
    } finally {
      setUploadingCert(false);
    }
  };

  const handleGovIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGovId(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "fitworks/pan_cards");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGovIdDoc({ url: data.url, name: file.name });
        toast.success("Government ID uploaded to Cloudinary!");
      } else {
        toast.error(data.message || "Failed to upload government ID");
      }
    } catch (err) {
      toast.error("Upload error. Please try again.");
    } finally {
      setUploadingGovId(false);
    }
  };

  // STEP VALIDATION (Mandatory Fields Check)
  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        const msg = "Please enter a valid email address";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        const msg = "Password must be at least 6 characters long";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.personal.fullName || formData.personal.fullName.trim().length < 2) {
        const msg = "Please enter your full name";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.personal.dateOfBirth) {
        const msg = "Please select your date of birth";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.personal.gender) {
        const msg = "Please select your gender";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.personal.city || formData.personal.city.trim().length < 2) {
        const msg = "Please enter your city";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.personal.location || formData.personal.location.trim().length < 2) {
        const msg = "Please enter your specific area / locality";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
    }

    if (step === 2) {
      if (!formData.professional.professionalTitle || formData.professional.professionalTitle.trim().length < 2) {
        const msg = "Please enter your professional title (e.g. Senior Yoga Instructor, Personal Trainer)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (formData.professional.yearsOfExperience === "" || Number(formData.professional.yearsOfExperience) < 0) {
        const msg = "Please enter your years of experience";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.professional.specializations || formData.professional.specializations.trim().length < 2) {
        const msg = "Please enter at least one specialization (e.g. Weight Loss, Strength)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.professional.education || formData.professional.education.trim().length < 2) {
        const msg = "Please enter your education or fitness certification name";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.professional.bio || formData.professional.bio.trim().length < 10) {
        const msg = "Please write a short bio (minimum 10 characters)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
    }

    if (step === 3) {
      if (!formData.workPreferences.expectedMonthlySalary || formData.workPreferences.expectedMonthlySalary.trim().length < 2) {
        const msg = "Please enter your expected monthly salary range";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.workPreferences.employmentType) {
        const msg = "Please select your preferred employment type";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.workPreferences.availability) {
        const msg = "Please select your joining availability";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    if (step === 1) onBack();
    else setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    // Re-verify all steps
    if (!formData.email || !formData.password || !formData.personal.fullName) {
      setStep(1);
      toast.error("Please complete Step 1: Account & Personal Details");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

      const verificationDocuments = [
        certDoc?.url ? `Fitness Certification: ${certDoc.name} | ${certDoc.url}` : null,
        govIdDoc?.url ? `Government ID (Aadhaar/PAN): ${govIdDoc.name} | ${govIdDoc.url}` : null,
      ].filter(Boolean);

      const payload = {
        ...formData,
        professional: {
          ...formData.professional,
          yearsOfExperience: Number(formData.professional.yearsOfExperience) || 1,
          specializations: formData.professional.specializations ? formData.professional.specializations.split(",").map(s => s.trim()).filter(Boolean) : ["General Fitness"],
          skills: formData.professional.skills ? formData.professional.skills.split(",").map(s => s.trim()).filter(Boolean) : ["Fitness Coaching"],
        },
        workPreferences: {
          ...formData.workPreferences,
          employmentType: [formData.workPreferences.employmentType],
          preferredLocations: [formData.personal.city || "Mumbai"],
        },
        verificationDocuments,
      };

      const res = await fetch(`${apiUrl}/auth/register/trainer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Registration failed. Please try again.");
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("fitworks_token", data.token);
        localStorage.setItem("fitworks_user", JSON.stringify(data.user));
      }

      setCreatedSlug(data.trainer?.slug || "rahul-sharma");
      setIsSuccess(true);
      toast.success("Trainer account registered successfully!");
    } catch (err: any) {
      console.error("Trainer registration error:", err);
      setErrorMessage("Network error connecting to server.");
      toast.error("Network error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col h-full items-center justify-center p-6 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Registration Successful!</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Your trainer profile has been created with your submitted documents and is currently pending review. You can now access your dashboard.</p>
        <Link href={`/trainer/${createdSlug}/dashboard`} className="w-full max-w-[240px]">
          <Button className="w-full bg-[#d91a24] hover:bg-[#cc1616] text-white py-6 rounded-xl font-bold cursor-pointer">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full relative p-6 md:p-10 lg:p-12">
      <button onClick={handlePrev} className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mt-8 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trainer Registration</h2>
            <p className="text-sm text-gray-500 mt-1.5 font-medium">
              {step === 1 && "Step 1: Account & Personal Info (Mandatory)"}
              {step === 2 && "Step 2: Professional Experience (Mandatory)"}
              {step === 3 && "Step 3: Work Preferences (Mandatory)"}
              {step === 4 && "Step 4: Verification Documents (Cloudinary)"}
            </p>
          </div>
          <div className="flex gap-2 mb-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 w-8 md:w-10 rounded-full transition-colors ${s <= step ? "bg-[#d91a24]" : "bg-gray-100"}`} />
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#d91a24] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-5">
          
          {/* STEP 1: Account & Personal */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="trainer@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Create password (min 6 chars)" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="personal.fullName" required value={formData.personal.fullName} onChange={handleChange} placeholder="E.g. Rahul Sharma" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" name="personal.dateOfBirth" required value={formData.personal.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Gender <span className="text-red-500">*</span></label>
                  <select name="personal.gender" required value={formData.personal.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="">Select Gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">City <span className="text-red-500">*</span></label>
                  <input type="text" name="personal.city" required value={formData.personal.city} onChange={handleChange} placeholder="E.g. Mumbai" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Specific Location / Area <span className="text-red-500">*</span></label>
                  <input type="text" name="personal.location" required value={formData.personal.location} onChange={handleChange} placeholder="E.g. Andheri West" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Professional Title <span className="text-red-500">*</span></label>
                  <input type="text" name="professional.professionalTitle" required value={formData.professional.professionalTitle} onChange={handleChange} placeholder="E.g. Senior Yoga Instructor, Personal Trainer" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Years of Experience <span className="text-red-500">*</span></label>
                  <input type="number" name="professional.yearsOfExperience" required value={formData.professional.yearsOfExperience} onChange={handleChange} min="0" placeholder="0" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Specializations (Comma separated) <span className="text-red-500">*</span></label>
                <input type="text" name="professional.specializations" required value={formData.professional.specializations} onChange={handleChange} placeholder="E.g. Weight Loss, Strength Training, CrossFit, HIIT" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Skills (Comma separated)</label>
                <input type="text" name="professional.skills" value={formData.professional.skills} onChange={handleChange} placeholder="E.g. Nutrition planning, CPR, Client Management" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Education / Fitness Certification <span className="text-red-500">*</span></label>
                <input type="text" name="professional.education" required value={formData.professional.education} onChange={handleChange} placeholder="E.g. ACE Certified, ISSA, BSc Sports Science, K11" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Bio / About You <span className="text-red-500">*</span></label>
                <textarea name="professional.bio" required value={formData.professional.bio} onChange={handleChange} rows={3} placeholder="Tell partner gyms about your coaching philosophy and client achievements..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 resize-none" />
              </div>
            </div>
          )}

          {/* STEP 3: Work Preferences */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Expected Monthly Salary <span className="text-red-500">*</span></label>
                  <input type="text" name="workPreferences.expectedMonthlySalary" required value={formData.workPreferences.expectedMonthlySalary} onChange={handleChange} placeholder="E.g. ₹25,000 - ₹35,000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Employment Type <span className="text-red-500">*</span></label>
                  <select name="workPreferences.employmentType" required value={formData.workPreferences.employmentType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Availability <span className="text-red-500">*</span></label>
                <select name="workPreferences.availability" required value={formData.workPreferences.availability} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                  <option value="Immediate">Immediate</option>
                  <option value="In 1 week">In 1 week</option>
                  <option value="In 1 month">In 1 month</option>
                </select>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" name="workPreferences.willingToRelocate" checked={formData.workPreferences.willingToRelocate} onChange={handleChange} className="w-5 h-5 text-[#d91a24] border-gray-300 rounded focus:ring-[#d91a24]" />
                <span className="text-sm font-medium text-gray-700">I am willing to relocate for the right gym opportunity</span>
              </label>
            </div>
          )}

          {/* STEP 4: Verification Documents (Cloudinary Upload) */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs sm:text-sm text-blue-800 font-medium leading-relaxed">
                  Upload your documents now for faster verification. You can also upload or update them anytime from your dashboard after signup.
                </p>
              </div>
              
              {/* Certifications Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-900 ml-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#d91a24]" /> Coaching Certificate (Optional / Recommended)
                </label>
                
                {certDoc ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-900 block truncate">{certDoc.name}</span>
                        <span className="text-[11px] font-semibold text-emerald-700">Certificate uploaded &amp; attached</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCertDoc(null)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-7 text-center hover:border-[#d91a24] hover:bg-red-50/30 transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={handleCertUpload}
                      disabled={uploadingCert}
                      className="hidden"
                    />
                    {uploadingCert ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin mb-2" />
                        <p className="text-xs font-bold text-gray-700">Uploading certificate to Cloudinary...</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-9 h-9 text-gray-400 group-hover:text-[#d91a24] mx-auto mb-2 transition-colors" />
                        <p className="text-xs md:text-sm font-bold text-gray-800 mb-0.5 group-hover:text-[#d91a24]">
                          Click to upload certificate
                        </p>
                        <p className="text-[11px] text-gray-400">PDF, JPG, or PNG (Max 10MB)</p>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* Government ID (Aadhaar/PAN) Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-900 ml-1 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#d91a24]" /> Government ID (Aadhaar / PAN Card)
                </label>

                {govIdDoc ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-900 block truncate">{govIdDoc.name}</span>
                        <span className="text-[11px] font-semibold text-emerald-700">Identity proof uploaded &amp; attached</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGovIdDoc(null)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-7 text-center hover:border-[#d91a24] hover:bg-red-50/30 transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={handleGovIdUpload}
                      disabled={uploadingGovId}
                      className="hidden"
                    />
                    {uploadingGovId ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin mb-2" />
                        <p className="text-xs font-bold text-gray-700">Uploading ID proof to Cloudinary...</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-9 h-9 text-gray-400 group-hover:text-[#d91a24] mx-auto mb-2 transition-colors" />
                        <p className="text-xs md:text-sm font-bold text-gray-800 mb-0.5 group-hover:text-[#d91a24]">
                          Click to upload ID (Aadhaar / PAN)
                        </p>
                        <p className="text-[11px] text-gray-400">PDF, JPG, or PNG (Max 10MB)</p>
                      </>
                    )}
                  </label>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center bg-white">
        {step > 1 ? (
          <button onClick={handlePrev} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
            Previous
          </button>
        ) : (
          <div></div> // Spacer
        )}
        <Button 
          onClick={handleNext} 
          disabled={loading || uploadingCert || uploadingGovId} 
          className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-95 text-white px-8 py-5 rounded-xl font-bold transition-all shadow-[0_8px_20px_rgb(217,26,36,0.15)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Profile...
            </>
          ) : (
            step === totalSteps ? "Submit & Create Profile" : "Continue"
          )}
          {!loading && step < totalSteps && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
