"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobVacancy {
  _id: string;
  position: string;
  description: string;
  requirements: {
    experience: string;
    specialization: string;
  };
  salaryRange: string;
  employmentType: string;
  location: string;
  numberOfOpenings: number;
  status: "open" | "closed";
  createdAt: string;
}

export default function GymVacanciesListPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "powerfit-studio";

  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/jobs/gym/slug/${gymSlug}`);
      const json = await res.json();
      if (json.success) {
        setVacancies(json.data || []);
      }
    } catch (err) {
      console.error("Fetch Gym Vacancies Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [gymSlug]);

  const toggleStatus = async (jobId: string, currentStatus: "open" | "closed") => {
    setActionLoading(jobId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;
      const nextStatus = currentStatus === "open" ? "closed" : "open";

      const res = await fetch(`${apiUrl}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const json = await res.json();
      if (json.success) {
        setVacancies(prev => prev.map(v => v._id === jobId ? { ...v, status: nextStatus } : v));
      }
    } catch (err) {
      console.error("Toggle Job Status Error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to remove this job vacancy?")) return;
    setActionLoading(jobId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("fitworks_token") : null;

      const res = await fetch(`${apiUrl}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        setVacancies(prev => prev.filter(v => v._id !== jobId));
      }
    } catch (err) {
      console.error("Delete Job Error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">My Posted Vacancies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your open positions, edit details, or post new vacancies.</p>
        </div>
        <Link href={`/gym/${gymSlug}/vacancies/new`}>
          <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-5 h-11 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Post New Vacancy
          </Button>
        </Link>
      </div>

      {/* Vacancies List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        </div>
      ) : vacancies.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No vacancies posted yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto mb-6">Create your first job listing to receive applications from verified trainers.</p>
          <Link href={`/gym/${gymSlug}/vacancies/new`}>
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white rounded-xl font-bold px-6">
              <Plus className="w-4 h-4 mr-1.5" /> Post a Vacancy
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vacancies.map((vac) => (
            <div key={vac._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2 ${
                      vac.status === "open" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      {vac.status === "open" ? "● Active Hiring" : "● Closed"}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{vac.position}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-100 rounded-lg">
                    {vac.employmentType}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {vac.description}
                </p>

                <div className="space-y-2 text-xs text-gray-500 font-medium mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{vac.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{vac.salaryRange}</span>
                    <span>• {vac.requirements?.experience} exp required</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={actionLoading === vac._id}
                  onClick={() => toggleStatus(vac._id, vac.status)}
                  className="rounded-xl text-xs font-semibold border-gray-200"
                >
                  {vac.status === "open" ? "Close Vacancy" : "Reopen Vacancy"}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === vac._id}
                  onClick={() => handleDelete(vac._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
