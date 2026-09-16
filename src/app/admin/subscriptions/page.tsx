"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  IndianRupee,
  TrendingUp,
  Users,
  CalendarClock,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Row {
  _id: string;
  slug: string;
  fullName: string;
  phone: string;
  city: string;
  verificationStatus: string;

  lastPaidAt: string | null;
  totalPaid: number;
  activation: {
    status: "inactive" | "active";
    isActive: boolean;
    activatedAt: string | null;
    totalPaid: number;
    paymentsMade: number;
  };
}

interface Summary {
  total: number;
  active: number;
  neverPaid: number;
  lifetimeRevenue: number;
  pipelineValue: number;
}

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const STATUS = {
  active: { label: "Paid ₹99", cls: "bg-emerald-50 text-emerald-700 border-emerald-200/70", Icon: CheckCircle2 },
  inactive: { label: "Never charged", cls: "bg-gray-100 text-gray-600 border-gray-200", Icon: Lock },
} as const;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Paid" },
  { id: "inactive", label: "Never charged" },
] as const;

export default function AdminSubscriptionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const token = localStorage.getItem("fitworks_token") || localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/admin/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setRows(json.data || []);
          setSummary(json.summary);
        } else {
          toast.error(json.message || "Could not load subscriptions");
        }
      } catch {
        toast.error("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const matchesFilter = filter === "all" || r.activation.status === filter;
        const term = q.trim().toLowerCase();
        const matchesSearch =
          !term ||
          r.fullName?.toLowerCase().includes(term) ||
          r.phone?.includes(term) ||
          r.city?.toLowerCase().includes(term);
        return matchesFilter && matchesSearch;
      }),
    [rows, filter, q]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading subscriptions…</p>
      </div>
    );
  }

  const tiles = [
    { label: "Trainers who paid", value: summary?.active ?? 0, Icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Never charged", value: summary?.neverPaid ?? 0, Icon: Lock, tone: "bg-gray-100 text-gray-600" },
    { label: "Trainers total", value: summary?.total ?? 0, Icon: Users, tone: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Payments</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            FitWorks is free for trainers now. This is the record of the ₹99 activations collected
            while trainers were charged.
          </p>
        </div>
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gray-900 text-white rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#d91a24] blur-[80px] opacity-40 pointer-events-none" />
          <div className="relative z-10">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              <IndianRupee className="w-3.5 h-3.5" /> Collected
            </p>
            <p className="flex items-baseline gap-0.5 text-3xl font-extrabold tracking-tight">
              <IndianRupee className="w-6 h-6 self-center" />
              {(summary?.lifetimeRevenue ?? 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 mt-1.5">
              From {summary?.active ?? 0} trainer{summary?.active === 1 ? "" : "s"} who paid
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Charging status
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-gray-900">Free</p>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Trainers are not charged; these are historical payments
          </p>
        </div>
      </div>

      {/* Status tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {tiles.map(({ label, value, Icon, tone }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${tone}`}>
              <Icon className="w-[18px] h-[18px]" />
            </span>
            <p className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 leading-none mb-1.5">{value}</p>
            <p className="text-[11px] sm:text-xs font-semibold text-gray-500 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, phone or city…"
            className="w-full h-11 pl-10 pr-4 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 h-11 sm:h-9 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                filter === f.id
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-200/80 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows — cards on mobile, table on desktop */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-800">No trainers match this view</p>
          <p className="text-xs text-gray-500 mt-1">Try a different filter or search term.</p>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="space-y-2.5 lg:hidden">
            {filtered.map((r) => {
              const s = STATUS[r.activation.status];
              return (
                <Link
                  key={r._id}
                  href={`/admin/trainers?id=${r._id}`}
                  className="block bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] active:scale-[0.99] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-sm shrink-0">
                      {r.fullName?.charAt(0)?.toUpperCase() || "T"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{r.fullName}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {r.phone} · {r.city || "—"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${s.cls}`}
                    >
                      <s.Icon className="w-3 h-3" />
                      {s.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Activated</p>
                      <p className="text-[11px] font-bold text-gray-800 mt-0.5">{fmt(r.activation.activatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Verified</p>
                      <p className="text-[11px] font-bold text-gray-800 mt-0.5 capitalize">{r.verificationStatus}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Paid</p>
                      <p className="text-[11px] font-bold text-gray-800 mt-0.5">₹{r.totalPaid}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    {["Trainer", "Payment", "Paid on", "Verification", "Access", "Total paid"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r) => {
                    const s = STATUS[r.activation.status];
                    return (
                      <tr key={r._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold text-xs shrink-0">
                              {r.fullName?.charAt(0)?.toUpperCase() || "T"}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{r.fullName}</p>
                              <p className="text-[11px] text-gray-500 truncate">
                                {r.phone} · {r.city || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${s.cls}`}
                          >
                            <s.Icon className="w-3.5 h-3.5" />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-gray-800 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarClock className="w-3.5 h-3.5 text-gray-400" />
                            {fmt(r.activation.activatedAt)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-gray-700 capitalize">
                          {r.verificationStatus}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                          Free
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-gray-900">₹{r.totalPaid}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
