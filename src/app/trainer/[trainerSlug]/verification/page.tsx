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
  Plus,
  ExternalLink,
  Trash2,
  FileCheck,
  CreditCard,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function TrainerVerificationPage() {
  const params = useParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("PAN Card");
  const [docUrl, setDocUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "fitworks/documents");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDocUrl(data.url);
        if (!docName) {
          setDocName(file.name.replace(/\.[^/.]+$/, ""));
        }
        toast.success("Document uploaded to Cloudinary!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Network error during file upload");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) {
      toast.error("Please enter a document title");
      return;
    }
    if (!docUrl) {
      toast.error("Please upload a file or provide a document link");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? (localStorage.getItem("fitworks_token") || localStorage.getItem("token")) : null;

      const currentDocs = trainer?.verificationDocuments || [];
      const newEntry = `${docType}: ${docName} | ${docUrl}`;
      const newDocs = [...currentDocs, newEntry];

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
        toast.error(json.message || "Failed to submit document.");
      } else {
        setSuccess(true);
        toast.success("Verification document submitted for review!");
        setDocName("");
        setDocUrl("");
        fetchTrainer();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Submit document error:", err);
      setError("Network error submitting document.");
      toast.error("Network error submitting document.");
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
  const documents: string[] = trainer?.verificationDocuments || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Verification & Credentials</h1>
        <p className="text-sm text-gray-500 mt-1">Upload your PAN card, government ID, and coaching certifications for verified status.</p>
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
              {trainer?.verificationStatus === "verified" ? "Verified" : trainer?.verificationStatus === "pending" ? "Pending Review" : "Action Needed"}
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              {isVerified ? "Your Profile is 100% Verified ✓" : isPending ? "Documents Under Review" : "Verification Incomplete"}
            </h2>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-xl">
              {isVerified 
                ? "Your certification credentials and identity documents have been approved. Partner gyms can view your verified badge."
                : "Our compliance team typically verifies credentials within 24-48 hours. Ensure your PAN card and certifications are uploaded below."}
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

      {/* Upload Document Form (Direct Cloudinary Upload) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-[#d91a24]" />
          <h2 className="text-lg font-bold text-gray-900">Upload Verification Document / PAN Card</h2>
        </div>

        <form onSubmit={handleUploadDoc} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Document Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-xs md:text-sm outline-none focus:border-[#d91a24]"
              >
                <option value="PAN Card">PAN Card (Identity Verification)</option>
                <option value="Aadhaar / Govt ID">Aadhaar Card / Govt ID</option>
                <option value="Fitness Certification">Fitness Coaching Certification (ACE, ISSA, K11, etc.)</option>
                <option value="Yoga / Pilates Degree">Yoga Alliance / Pilates Diploma</option>
                <option value="CPR / First Aid">CPR / First Aid Certificate</option>
                <option value="Other Credential">Other Credential</option>
              </select>
            </div>

            {/* Document Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">Document Title / Certificate Name</label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Rahul Sharma PAN Card, ACE CPT Certificate"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-xs md:text-sm outline-none focus:border-[#d91a24]"
              />
            </div>
          </div>

          {/* Cloudinary File Upload Dropzone */}
          <div className="p-5 bg-gray-50/70 border-2 border-dashed border-gray-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Upload Document File (Cloudinary)</span>
                <span className="text-[11px] text-gray-400">PDF, JPG, PNG, or DOC up to 10MB</span>
              </div>

              <label className="inline-flex items-center justify-center gap-2 bg-[#d91a24] hover:bg-[#cc1616] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all">
                {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {uploadingFile ? "Uploading File..." : "Choose File"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="hidden"
                />
              </label>
            </div>

            {docUrl && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-800">
                <span className="truncate font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Uploaded: <span className="font-mono text-[11px]">{docUrl}</span>
                </span>
                <a 
                  href={docUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#d91a24] font-bold hover:underline shrink-0 flex items-center gap-1"
                >
                  Preview <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={submitting || !docUrl}
              className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-7 h-11 rounded-xl text-xs md:text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? "Submitting..." : "Submit Document for Review"}
            </Button>
          </div>
        </form>
      </div>

      {/* Submitted Documents Registry */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" /> Submitted Documents ({documents.length})
          </h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/60 rounded-2xl border border-gray-100">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">No verification documents submitted yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your PAN card and certifications above to get your verified badge.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, idx) => {
              const [title, url] = doc.includes(" | ") ? doc.split(" | ") : [doc, doc];
              const isCloudinary = url && url.startsWith("http");

              return (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold shrink-0">
                      {title.toLowerCase().includes("pan") ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-gray-900">{title}</h4>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        Uploaded & Active
                      </span>
                    </div>
                  </div>

                  {isCloudinary && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#d91a24]" />
                      View Document
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
