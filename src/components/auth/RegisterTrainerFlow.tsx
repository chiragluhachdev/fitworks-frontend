import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, UploadCloud } from "lucide-react";
import Link from "next/link";

interface RegisterTrainerFlowProps {
  onBack: () => void;
}

export default function RegisterTrainerFlow({ onBack }: RegisterTrainerFlowProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      employmentType: "",
      availability: "",
      willingToRelocate: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step === 1) onBack();
    else setStep((s) => Math.max(s - 1, 1));
  };

  const [createdSlug, setCreatedSlug] = useState("rahul-sharma");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const payload = {
        ...formData,
        professional: {
          ...formData.professional,
          yearsOfExperience: Number(formData.professional.yearsOfExperience) || 1,
          specializations: formData.professional.specializations.split(",").map(s => s.trim()).filter(Boolean),
          skills: formData.professional.skills.split(",").map(s => s.trim()).filter(Boolean),
        },
        workPreferences: {
          ...formData.workPreferences,
          employmentType: [formData.workPreferences.employmentType],
          preferredLocations: [formData.personal.city],
        }
      };

      const res = await fetch(`${apiUrl}/auth/register/trainer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("fitworks_token", data.token);
        localStorage.setItem("fitworks_user", JSON.stringify(data.user));
      }

      setCreatedSlug(data.trainer?.slug || "rahul-sharma");
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Trainer registration error:", err);
      setErrorMessage("Network error connecting to server.");
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
        <p className="text-gray-500 mb-8 max-w-sm">Your trainer profile has been created and is currently pending verification. You can now access your dashboard.</p>
        <Link href={`/trainer/${createdSlug}/dashboard`} className="w-full max-w-[240px]">
          <Button className="w-full bg-[#d91a24] hover:bg-[#cc1616] text-white py-6 rounded-xl font-bold">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full relative p-6 md:p-10 lg:p-12">
      <button onClick={handlePrev} className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mt-8 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trainer Registration</h2>
            <p className="text-sm text-gray-500 mt-1.5">
              {step === 1 && "Account & Personal Info"}
              {step === 2 && "Professional Experience"}
              {step === 3 && "Work Preferences"}
              {step === 4 && "Verification Documents"}
            </p>
          </div>
          <div className="flex gap-2 mb-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 w-8 md:w-10 rounded-full transition-colors ${s <= step ? "bg-[#d91a24]" : "bg-gray-100"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-5">
          
          {/* STEP 1: Account & Personal */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="trainer@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Full Name</label>
                <input type="text" name="personal.fullName" value={formData.personal.fullName} onChange={handleChange} placeholder="E.g. Rahul Sharma" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Date of Birth</label>
                  <input type="date" name="personal.dateOfBirth" value={formData.personal.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Gender</label>
                  <select name="personal.gender" value={formData.personal.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">City</label>
                  <input type="text" name="personal.city" value={formData.personal.city} onChange={handleChange} placeholder="E.g. Mumbai" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Specific Location/Area</label>
                  <input type="text" name="personal.location" value={formData.personal.location} onChange={handleChange} placeholder="E.g. Andheri West" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Professional Title</label>
                  <input type="text" name="professional.professionalTitle" value={formData.professional.professionalTitle} onChange={handleChange} placeholder="E.g. Senior Yoga Instructor" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Years of Experience</label>
                  <input type="number" name="professional.yearsOfExperience" value={formData.professional.yearsOfExperience} onChange={handleChange} min="0" placeholder="0" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Specializations (Comma separated)</label>
                <input type="text" name="professional.specializations" value={formData.professional.specializations} onChange={handleChange} placeholder="E.g. Weight Loss, Strength Training, CrossFit" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Skills (Comma separated)</label>
                <input type="text" name="professional.skills" value={formData.professional.skills} onChange={handleChange} placeholder="E.g. Nutrition planning, CPR, Client Management" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Education/Highest Degree</label>
                <input type="text" name="professional.education" value={formData.professional.education} onChange={handleChange} placeholder="E.g. BSc Sports Science" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Bio / About You</label>
                <textarea name="professional.bio" value={formData.professional.bio} onChange={handleChange} rows={3} placeholder="Tell gyms about your background and coaching style..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 resize-none" />
              </div>
            </div>
          )}

          {/* STEP 3: Work Preferences */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Expected Monthly Salary</label>
                  <input type="text" name="workPreferences.expectedMonthlySalary" value={formData.workPreferences.expectedMonthlySalary} onChange={handleChange} placeholder="E.g. ₹20,000 - ₹30,000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Employment Type</label>
                  <select name="workPreferences.employmentType" value={formData.workPreferences.employmentType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="">Select...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Availability</label>
                <select name="workPreferences.availability" value={formData.workPreferences.availability} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                  <option value="">Select...</option>
                  <option value="Immediate">Immediate</option>
                  <option value="In 1 week">In 1 week</option>
                  <option value="In 1 month">In 1 month</option>
                </select>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" name="workPreferences.willingToRelocate" checked={formData.workPreferences.willingToRelocate} onChange={handleChange} className="w-5 h-5 text-[#d91a24] border-gray-300 rounded focus:ring-[#d91a24]" />
                <span className="text-sm font-medium text-gray-700">I am willing to relocate for the right job</span>
              </label>
            </div>
          )}

          {/* STEP 4: Verification Documents */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-2">
                <p className="text-sm text-blue-800 font-medium">To maintain platform quality, all trainers must provide documents for verification. Your profile will be marked as "Verified" once approved.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 ml-1">Certifications Upload</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#d91a24] hover:bg-red-50/30 transition-all cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload certificates</p>
                  <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 ml-1">Government ID</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#d91a24] hover:bg-red-50/30 transition-all cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload ID (Aadhar/PAN)</p>
                  <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center bg-white">
        {step > 1 ? (
          <button onClick={handlePrev} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            Previous
          </button>
        ) : (
          <div></div> // Spacer
        )}
        <Button onClick={handleNext} disabled={loading} className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-95 text-white px-8 py-5 rounded-xl font-bold transition-all shadow-[0_8px_20px_rgb(217,26,36,0.15)] flex items-center gap-2">
          {loading ? "Processing..." : (step === totalSteps ? "Submit & Create Profile" : "Continue")}
          {!loading && step < totalSteps && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
