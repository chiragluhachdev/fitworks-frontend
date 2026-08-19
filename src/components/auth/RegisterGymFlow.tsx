"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface RegisterGymFlowProps {
  onBack: () => void;
}

export default function RegisterGymFlow({ onBack }: RegisterGymFlowProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gymName: "",
    gymDescription: "",
    website: "",
    instagram: "",
    numberOfLocations: "1",
    address: { street: "", city: "", state: "", pincode: "" },
    hiringInformation: {
      trainersRequired: "1",
      trainerTypes: "",
      preferredExperience: "Intermediate (1-3 yrs)",
      salaryBudget: "₹20,000 - ₹30,000",
      hiringFrequency: "Regular (Monthly)",
    },
    contactPerson: { name: "", designation: "Owner", phone: "" },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState("powerfit-studio");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setErrorMessage(null);
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
      if (!formData.contactPerson.name || formData.contactPerson.name.trim().length < 2) {
        const msg = "Please enter the contact person's full name";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.contactPerson.designation || formData.contactPerson.designation.trim().length < 2) {
        const msg = "Please enter your designation (e.g. Owner, General Manager)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.contactPerson.phone || formData.contactPerson.phone.trim().length < 10) {
        const msg = "Please enter a valid 10-digit phone number";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
    }

    if (step === 2) {
      if (!formData.gymName || formData.gymName.trim().length < 2) {
        const msg = "Please enter your official gym name";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.gymDescription || formData.gymDescription.trim().length < 10) {
        const msg = "Please write a brief gym description (minimum 10 characters)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.numberOfLocations || Number(formData.numberOfLocations) < 1) {
        const msg = "Please specify the number of gym branches (at least 1)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
    }

    if (step === 3) {
      if (!formData.address.street || formData.address.street.trim().length < 3) {
        const msg = "Please enter the street address / area of your gym";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.address.city || formData.address.city.trim().length < 2) {
        const msg = "Please enter the city";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.address.state || formData.address.state.trim().length < 2) {
        const msg = "Please enter the state";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.address.pincode || formData.address.pincode.trim().length < 4) {
        const msg = "Please enter a valid pincode";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
    }

    if (step === 4) {
      if (!formData.hiringInformation.trainersRequired || Number(formData.hiringInformation.trainersRequired) < 1) {
        const msg = "Please enter how many trainers you require";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.hiringInformation.trainerTypes || formData.hiringInformation.trainerTypes.trim().length < 2) {
        const msg = "Please enter required trainer specializations (e.g. Yoga, Crossfit, Strength)";
        setErrorMessage(msg);
        toast.error(msg);
        return false;
      }
      if (!formData.hiringInformation.salaryBudget || formData.hiringInformation.salaryBudget.trim().length < 2) {
        const msg = "Please enter your salary budget range";
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
    if (!formData.email || !formData.password || !formData.gymName) {
      setStep(1);
      toast.error("Please complete Step 1 & 2 before submitting");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const payload = {
        ...formData,
        numberOfLocations: Number(formData.numberOfLocations) || 1,
        hiringInformation: {
          ...formData.hiringInformation,
          trainersRequired: Number(formData.hiringInformation.trainersRequired) || 1,
          trainerTypes: formData.hiringInformation.trainerTypes ? formData.hiringInformation.trainerTypes.split(",").map(s => s.trim()).filter(Boolean) : ["General Fitness"],
        }
      };

      const res = await fetch(`${apiUrl}/auth/register/gym`, {
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

      setCreatedSlug(data.gym?.slug || "powerfit-studio");
      setIsSuccess(true);
      toast.success("Gym account registered successfully!");
    } catch (err: any) {
      console.error("Gym registration error:", err);
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
        <p className="text-gray-500 mb-8 max-w-sm">Your gym account has been created. You can now access your dashboard and start hiring.</p>
        <Link href={`/gym/${createdSlug}/dashboard`} className="w-full max-w-[240px]">
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gym Registration</h2>
            <p className="text-sm text-gray-500 mt-1.5 font-medium">
              {step === 1 && "Step 1: Account & Contact Details (Mandatory)"}
              {step === 2 && "Step 2: Gym Information (Mandatory)"}
              {step === 3 && "Step 3: Location & Social (Mandatory)"}
              {step === 4 && "Step 4: Hiring Preferences (Mandatory)"}
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
          {/* STEP 1: Account & Contact */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="gym@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Create password (min 6 chars)" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Contact Person Name <span className="text-red-500">*</span></label>
                  <input type="text" name="contactPerson.name" required value={formData.contactPerson.name} onChange={handleChange} placeholder="E.g. Ashish / Vikram" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Designation <span className="text-red-500">*</span></label>
                  <input type="text" name="contactPerson.designation" required value={formData.contactPerson.designation} onChange={handleChange} placeholder="Owner / General Manager" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="contactPerson.phone" required value={formData.contactPerson.phone} onChange={handleChange} placeholder="10-digit mobile number" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Gym Information */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Official Gym Name <span className="text-red-500">*</span></label>
                <input type="text" name="gymName" required value={formData.gymName} onChange={handleChange} placeholder="E.g. HOPE GYM & SPA" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Gym Description <span className="text-red-500">*</span></label>
                <textarea name="gymDescription" required value={formData.gymDescription} onChange={handleChange} rows={4} placeholder="Tell us about your fitness club, facilities, floor area, and culture..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Number of Locations / Branches <span className="text-red-500">*</span></label>
                <input type="number" name="numberOfLocations" required value={formData.numberOfLocations} onChange={handleChange} min="1" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
            </div>
          )}

          {/* STEP 3: Location & Social */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Street Address / Locality <span className="text-red-500">*</span></label>
                <input type="text" name="address.street" required value={formData.address.street} onChange={handleChange} placeholder="Building name, Road / Sector" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">City <span className="text-red-500">*</span></label>
                  <input type="text" name="address.city" required value={formData.address.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">State <span className="text-red-500">*</span></label>
                  <input type="text" name="address.state" required value={formData.address.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-700 ml-1">Pincode <span className="text-red-500">*</span></label>
                  <input type="text" name="address.pincode" required value={formData.address.pincode} onChange={handleChange} placeholder="Pincode" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Website (Optional)</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Instagram Handle (Optional)</label>
                  <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@gymhandle" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Hiring Preferences */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Trainers Required Now <span className="text-red-500">*</span></label>
                  <input type="number" name="hiringInformation.trainersRequired" required value={formData.hiringInformation.trainersRequired} onChange={handleChange} min="1" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Hiring Frequency <span className="text-red-500">*</span></label>
                  <select name="hiringInformation.hiringFrequency" required value={formData.hiringInformation.hiringFrequency} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks)</option>
                    <option value="Regular (Monthly)">Regular (Monthly)</option>
                    <option value="Occasionally">Occasionally</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1">Trainer Specializations Required <span className="text-red-500">*</span></label>
                <input type="text" name="hiringInformation.trainerTypes" required value={formData.hiringInformation.trainerTypes} onChange={handleChange} placeholder="E.g. Yoga, Crossfit, Strength & Conditioning (comma separated)" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Preferred Experience <span className="text-red-500">*</span></label>
                  <select name="hiringInformation.preferredExperience" required value={formData.hiringInformation.preferredExperience} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                    <option value="Intermediate (1-3 yrs)">Intermediate (1-3 yrs)</option>
                    <option value="Expert (3+ yrs)">Expert (3+ yrs)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 ml-1">Salary Budget Range <span className="text-red-500">*</span></label>
                  <input type="text" name="hiringInformation.salaryBudget" required value={formData.hiringInformation.salaryBudget} onChange={handleChange} placeholder="E.g. ₹20,000 - ₹35,000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
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
          disabled={loading} 
          className="bg-[#d91a24] hover:bg-[#cc1616] active:scale-95 text-white px-8 py-5 rounded-xl font-bold transition-all shadow-[0_8px_20px_rgb(217,26,36,0.15)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Gym Account...
            </>
          ) : (
            step === totalSteps ? "Create Gym Account" : "Continue"
          )}
          {!loading && step < totalSteps && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
