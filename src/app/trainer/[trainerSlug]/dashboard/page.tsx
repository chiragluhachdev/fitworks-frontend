"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Briefcase, 
  UserPlus, 
  Eye,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Search,
  ShieldCheck,
  Loader2
} from "lucide-react";
import CashfreePaymentModal from "@/components/CashfreePaymentModal";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function TrainerDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const trainerSlug = (params?.trainerSlug as string) || "rahul-sharma";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = localStorage.getItem("fitworks_token");
      const res = await fetch(`${apiUrl}/trainers/${trainerSlug}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Fetch Trainer Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Check if returning from Cashfree payment
    const orderId = searchParams.get("order_id");
    const paymentStatus = searchParams.get("payment_status");

    if (orderId && paymentStatus === "success") {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      fetch(`${apiUrl}/payments/verify-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, trainerSlug }),
      })
        .then((r) => r.json())
        .then((vData) => {
          if (vData.isPaid) {
            toast.success("Payment verified! Your profile badge is now verified.");
            fetchDashboard();
          }
        });
    }
  }, [trainerSlug, searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading trainer dashboard...</p>
      </div>
    );
  }

  const { trainer, stats, applications = [], connections = [], recommendedJobs = [] } = data || {};
  const isPaid = trainer?.payment?.isPaid;

  const statCards = [
    { title: "Profile Views", value: stats?.profileViews || 48, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Applications", value: stats?.activeApplications || applications.length, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "New Invitations", value: stats?.newConnections || connections.filter((c: any) => c.status === "pending").length, icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
    { title: "Verified Badge", value: isPaid ? "Active" : "Unpaid (₹99)", icon: ShieldCheck, color: isPaid ? "text-emerald-600" : "text-[#d91a24]", bg: isPaid ? "bg-emerald-50" : "bg-red-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* ₹99 Verified Badge Activation Banner if not paid */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-red-600 to-[#b8141d] rounded-3xl p-5 md:p-6 text-white shadow-lg shadow-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  Activate Verified Trainer Badge (₹99 One-Time)
                </h3>
                <span className="text-[10px] font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full uppercase">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-white/85 mt-0.5">
                Stand out on the public directory, get highlighted to partner gyms (HOPE &amp; ANYDAY), and unlock priority applications.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowPaymentModal(true)}
            className="bg-white hover:bg-gray-100 text-[#d91a24] font-extrabold text-xs px-6 py-5 rounded-xl shrink-0 shadow-sm cursor-pointer"
          >
            Activate Badge (₹99)
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Hello, {trainer?.personal?.fullName || "Trainer"}!
            </h1>
            {isPaid ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                Standard Profile
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Here is a live summary of your applications and incoming connection requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/trainer/${trainerSlug}/jobs`}>
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white h-11 px-5 text-sm font-semibold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Search className="w-4 h-4" /> Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Payment Modal */}
      <CashfreePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        trainerSlug={trainerSlug}
        trainerName={trainer?.personal?.fullName}
        trainerEmail={trainer?.userId?.email}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchDashboard();
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 capitalize">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Jobs & Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Open Vacancies */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recommended Jobs</h2>
                <p className="text-xs text-gray-500">Vacancies matching your skills</p>
              </div>
              <Link href={`/trainer/${trainerSlug}/jobs`} className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No open vacancies at the moment.</p>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job: any) => (
                  <div key={job._id} className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {job.gymId?.gymLogo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 relative shrink-0 shadow-2xs">
                          <Image src={job.gymId.gymLogo} alt="Logo" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-bold text-sm shrink-0">
                          {job.gymId?.gymName?.charAt(0) || "G"}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{job.position}</h4>
                        <p className="text-xs text-gray-500">{job.gymId?.gymName || "Partner Gym"} • {job.location}</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">{job.salaryRange}</p>
                      </div>
                    </div>
                    <Link href={`/trainer/${trainerSlug}/jobs`}>
                      <Button size="sm" className="bg-[#d91a24] hover:bg-[#cc1616] text-white text-xs font-bold rounded-xl h-8 px-3">
                        Apply
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Incoming Connection Requests */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Gym Invitations</h2>
                <p className="text-xs text-gray-500">Direct connection requests from gyms</p>
              </div>
              <Link href={`/trainer/${trainerSlug}/connections`} className="text-xs font-bold text-[#d91a24] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {connections.length === 0 ? (
              <div className="p-8 text-center bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                <UserPlus className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">No connection requests yet</p>
                <p className="text-xs text-gray-500 mt-1">When partner gyms discover your profile, their interview invitations will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.slice(0, 3).map((conn: any) => (
                  <div key={conn._id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {conn.gymId?.gymLogo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 relative shrink-0 shadow-2xs">
                          <Image src={conn.gymId.gymLogo} alt="Logo" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0">
                          {conn.gymId?.gymName?.charAt(0) || "G"}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{conn.gymId?.gymName || "Gym Partner"}</h4>
                        <p className="text-xs text-gray-500">{conn.gymId?.address?.city || "India"}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize bg-blue-50 text-blue-700 border border-blue-100">
                      {conn.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
