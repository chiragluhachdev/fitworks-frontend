import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
      preferredExperience: "",
      salaryBudget: "",
      hiringFrequency: "",
    },
    contactPerson: { name: "", designation: "", phone: "" },
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

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step === 1) onBack();
    else setStep((s) => Math.max(s - 1, 1));
  };

  const [createdSlug, setCreatedSlug] = useState("powerfit-studio");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
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
          trainerTypes: formData.hiringInformation.trainerTypes.split(",").map(s => s.trim()).filter(Boolean),
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
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("fitworks_token", data.token);
        localStorage.setItem("fitworks_user", JSON.stringify(data.user));
      }

      setCreatedSlug(data.gym?.slug || "powerfit-studio");
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Gym registration error:", err);
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
        <p className="text-gray-500 mb-8 max-w-sm">Your gym account has been created. You can now access your dashboard and start hiring.</p>
        <Link href={`/gym/${createdSlug}/dashboard`} className="w-full max-w-[240px]">
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gym Registration</h2>
            <p className="text-sm text-gray-500 mt-1.5">
              {step === 1 && "Account & Contact Details"}
              {step === 2 && "Gym Information"}
              {step === 3 && "Location & Social"}
              {step === 4 && "Hiring Preferences"}
            </p>
          </div>
          <div className="flex gap-2 mb-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 w-8 md:w-10 rounded-full transition-colors ${s <= step ? "bg-[#d91a24]" : "bg-gray-100"}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-5">
          {/* STEP 1: Account & Contact */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="gym@example.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Contact Person Name</label>
                  <input type="text" name="contactPerson.name" value={formData.contactPerson.name} onChange={handleChange} placeholder="E.g. Rahul Sharma" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Designation</label>
                  <input type="text" name="contactPerson.designation" value={formData.contactPerson.designation} onChange={handleChange} placeholder="Owner / Manager" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Phone Number</label>
                  <input type="tel" name="contactPerson.phone" value={formData.contactPerson.phone} onChange={handleChange} placeholder="+91 9876543210" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Gym Information */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Gym Name</label>
                <input type="text" name="gymName" value={formData.gymName} onChange={handleChange} placeholder="E.g. PowerFit Studio" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Gym Description</label>
                <textarea name="gymDescription" value={formData.gymDescription} onChange={handleChange} rows={4} placeholder="Tell us about your gym, facilities, and culture..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Number of Locations</label>
                <input type="number" name="numberOfLocations" value={formData.numberOfLocations} onChange={handleChange} min="1" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
            </div>
          )}

          {/* STEP 3: Location & Social */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Street Address</label>
                <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Building, Street name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">City</label>
                  <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">State</label>
                  <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Pincode</label>
                  <input type="text" name="address.pincode" value={formData.address.pincode} onChange={handleChange} placeholder="000000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Website (Optional)</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Instagram (Optional)</label>
                  <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@username" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Hiring Preferences */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Trainers Required Now</label>
                  <input type="number" name="hiringInformation.trainersRequired" value={formData.hiringInformation.trainersRequired} onChange={handleChange} min="0" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Hiring Frequency</label>
                  <select name="hiringInformation.hiringFrequency" value={formData.hiringInformation.hiringFrequency} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="">Select...</option>
                    <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks)</option>
                    <option value="Regular (Monthly)">Regular (Monthly)</option>
                    <option value="Occasionally">Occasionally</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 ml-1">Trainer Types Required</label>
                <input type="text" name="hiringInformation.trainerTypes" value={formData.hiringInformation.trainerTypes} onChange={handleChange} placeholder="E.g. Yoga, Crossfit, General Fitness (comma separated)" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Preferred Experience</label>
                  <select name="hiringInformation.preferredExperience" value={formData.hiringInformation.preferredExperience} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10">
                    <option value="">Select...</option>
                    <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                    <option value="Intermediate (1-3 yrs)">Intermediate (1-3 yrs)</option>
                    <option value="Expert (3+ yrs)">Expert (3+ yrs)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Salary Budget Range</label>
                  <input type="text" name="hiringInformation.salaryBudget" value={formData.hiringInformation.salaryBudget} onChange={handleChange} placeholder="E.g. ₹15,000 - ₹25,000" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10" />
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
          {loading ? "Processing..." : (step === totalSteps ? "Create Gym Account" : "Continue")}
          {!loading && step < totalSteps && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
