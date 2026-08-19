"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerVerificationPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainer = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrainer(json.data);
      }
    } catch (err) {
      console.error("Fetch Trainer Verification Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainer();
  }, [trainerSlug]);

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const currentDocs = trainer?.verificationDocuments || [];
      const newDocs = [...currentDocs, { name: docName, url: docUrl || "https://example.com/certificate.pdf" }];

      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ documents: newDocs }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to submit document.");
      } else {
        setSuccess(true);
        setDocName("");
        setDocUrl("");
        fetchTrainer();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Submit document error:", err);
      setError("Network error submitting document.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
      </div>
    );
  }

  const isVerified = trainer?.verificationStatus === "verified";
  const isPending = trainer?.verificationStatus === "pending";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Verification & Credentials</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage certifications, diplomas, and identity documents for FitWorks verification.</p>
      </div>

      {/* Verification Status Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
        isVerified 
          ? "bg-green-50/70 border-green-200" 
          : isPending 
          ? "bg-amber-50/70 border-amber-200"
          : "bg-red-50/70 border-red-200"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            isVerified ? "bg-green-100 text-green-700" : isPending ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
          }`}>
            {isVerified ? <ShieldCheck className="w-8 h-8" /> : isPending ? <Clock className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>
          <div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1.5 ${
              isVerified ? "bg-green-200/80 text-green-900" : isPending ? "bg-amber-200/80 text-amber-900" : "bg-red-200/80 text-red-900"
            }`}>
              {trainer?.verificationStatus || "Pending Review"}
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              {isVerified ? "Your Profile is 100% Verified ✓" : isPending ? "Documents Under Review" : "Verification Incomplete"}
            </h2>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-xl">
              {isVerified 
                ? "Your certification credentials have been reviewed by our compliance team. Partner gyms can view your verified badge."
                : "Our verification team typically verifies credentials within 24-48 hours. Ensure your official certificates and ID are uploaded below."}
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>Document submitted for review successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-[#d91a24] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Document Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-[#d91a24]" /> Submit New Certificate or ID
        </h2>

        <form onSubmit={handleUploadDoc} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Document / Certificate Name</label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. ACE Certified Personal Trainer, RYT-200 Yoga, Govt ID"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Document Link / Cloud URL (Optional)</label>
              <input
                type="text"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-6 h-11 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Submit for Review
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
