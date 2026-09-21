"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  ClipboardList,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  Trash2,
  Mail,
  MapPin,
  ExternalLink,
  CalendarDays,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { buildLeadWhatsAppUrl } from "@/lib/whatsapp";

interface Lead {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  formName?: string;
  campaignName?: string;
  platform?: string;
  submittedAt?: string;
  createdAt?: string;
  status: "new" | "contacted" | "registered" | "not_interested";
  registeredTrainer?: { slug: string; verificationStatus: string } | null;
  /** Every column from the uploaded file, so nothing from the form is hidden. */
  raw?: Record<string, string>;
}

interface Summary {
  total: number;
  registered: number;
  new: number;
  contacted: number;
}

const STATUS = {
  new: { label: "New", cls: "bg-blue-50 text-blue-700 border-blue-200/70", Icon: ClipboardList },
  contacted: { label: "Contacted", cls: "bg-amber-50 text-amber-700 border-amber-200/70", Icon: Clock },
  registered: { label: "Registered", cls: "bg-emerald-50 text-emerald-700 border-emerald-200/70", Icon: UserCheck },
  not_interested: { label: "Not interested", cls: "bg-gray-100 text-gray-600 border-gray-200", Icon: XCircle },
} as const;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "not_interested", label: "Not interested" },
] as const;

const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const fmtLong = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

/** When the lead actually arrived; falls back to when we imported it. */
const leadDate = (l: { submittedAt?: string; createdAt?: string }) => l.submittedAt || l.createdAt;

/** Local YYYY-MM-DD, so a date input matches what the admin sees on screen. */
const toInputDate = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const DATE_PRESETS = [
  { id: "all", label: "All time", days: 0 },
  { id: "today", label: "Today", days: 1 },
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "30", label: "Last 30 days", days: 30 },
] as const;

/** WhatsApp's glyph — lucide has no brand icons. */
function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23z" />
    </svg>
  );
}

/**
 * Leads from Meta instant forms. These people are not trainers yet — they left
 * a number on an Instagram or Facebook ad. The job of this screen is to get
 * them onto the platform, so the WhatsApp message is the main action.
 */
export default function AdminInstantFormsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [preset, setPreset] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  const auth = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("fitworks_token") || ""}`,
  });

  const load = async () => {
    try {
      const res = await fetch(`${api}/admin/instant-leads`, { headers: auth() });
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
        setSummary(json.summary || null);
      } else {
        toast.error(json.message || "Couldn't load leads");
      }
    } catch {
      toast.error("Network error loading leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Deferred so the first paint isn't blocked by a state update inside the
    // effect; the loading spinner covers the gap.
    const id = setTimeout(load, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: string, status: Lead["status"]) => {
    setBusyId(id);
    try {
      const res = await fetch(`${api}/admin/instant-leads/${id}`, {
        method: "PATCH",
        headers: auth(),
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
      } else toast.error(json.message || "Couldn't update");
    } catch {
      toast.error("Network error");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`${api}/admin/instant-leads/${id}`, { method: "DELETE", headers: auth() });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.filter((l) => l._id !== id));
        toast.success("Lead removed");
      } else toast.error(json.message || "Couldn't remove");
    } catch {
      toast.error("Network error");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    // Inclusive of both ends: "to" covers the whole of that day.
    const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toTs = to ? new Date(`${to}T23:59:59.999`).getTime() : null;

    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;

      const when = leadDate(l);
      if (fromTs || toTs) {
        if (!when) return false;
        const ts = new Date(when).getTime();
        if (fromTs && ts < fromTs) return false;
        if (toTs && ts > toTs) return false;
      }

      if (!q) return true;
      // Search every detail we hold, including the original form columns.
      const haystack = [
        l.fullName,
        l.phone,
        l.email,
        l.city,
        l.formName,
        l.campaignName,
        l.platform,
        l.status,
        ...Object.values(l.raw || {}),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, filter, search, from, to]);

  const applyPreset = (id: string, days: number) => {
    setPreset(id);
    if (!days) {
      setFrom("");
      setTo("");
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    setFrom(toInputDate(start));
    setTo(toInputDate(end));
  };

  const clearDates = () => {
    setPreset("all");
    setFrom("");
    setTo("");
  };
  const datesActive = Boolean(from || to);

  const tiles = [
    { label: "Total leads", value: summary?.total ?? 0, Icon: ClipboardList, tone: "bg-blue-50 text-blue-600" },
    { label: "Not contacted", value: summary?.new ?? 0, Icon: Clock, tone: "bg-amber-50 text-amber-600" },
    { label: "Contacted", value: summary?.contacted ?? 0, Icon: CheckCircle2, tone: "bg-gray-100 text-gray-600" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Instant Forms</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          People who left their details on a Meta ad form. They don&apos;t have a FitWorks account yet —
          message them to get them registered.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {tiles.map(({ label, value, Icon, tone }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
          >
            <span className={`w-9 h-9 rounded-xl ${tone} flex items-center justify-center mb-2.5`}>
              <Icon className="w-4 h-4" />
            </span>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any detail — name, phone, email, city, form, campaign…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {FILTERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                filter === t.id ? "bg-[#d91a24] text-white shadow-xs" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dates — presets for the common cases, exact range when needed */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
          <CalendarDays className="w-3.5 h-3.5" /> Submitted
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {DATE_PRESETS.map((d) => (
            <button
              key={d.id}
              onClick={() => applyPreset(d.id, d.days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                preset === d.id && (d.id === "all" ? !datesActive : true)
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:ml-auto">
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => { setFrom(e.target.value); setPreset("custom"); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#d91a24]"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => { setTo(e.target.value); setPreset("custom"); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#d91a24]"
          />
          {datesActive && (
            <button
              onClick={clearDates}
              title="Clear dates"
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {(datesActive || search || filter !== "all") && (
        <p className="text-xs font-semibold text-gray-500 -mt-1">
          Showing {filtered.length} of {leads.length} lead{leads.length === 1 ? "" : "s"}
          {datesActive && (
            <>
              {" "}
              · {from ? fmt(`${from}T00:00:00`) : "the beginning"} to {to ? fmt(`${to}T00:00:00`) : "today"}
            </>
          )}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col h-64 items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-[#d91a24] animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Loading leads…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">
            {leads.length === 0 ? "No leads imported yet" : "No leads match this filter"}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            {leads.length === 0
              ? "Send the Meta leads export (CSV) over and it'll be imported into this screen."
              : "Try a different search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((lead) => {
            const s = STATUS[lead.status];
            const wa = buildLeadWhatsAppUrl(lead);
            return (
              <div
                key={lead._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgb(0,0,0,0.04)] p-4 flex flex-col lg:flex-row lg:items-center gap-3 flex-wrap"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-10 h-10 rounded-xl bg-red-50 text-[#d91a24] border border-red-100 flex items-center justify-center font-black text-sm shrink-0">
                    {lead.fullName?.charAt(0)?.toUpperCase() || "L"}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{lead.fullName}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.cls}`}
                      >
                        <s.Icon className="w-3 h-3" />
                        {s.label}
                      </span>
                      {lead.registeredTrainer && (
                        <Link
                          href="/admin/trainers"
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100"
                        >
                          <UserCheck className="w-3 h-3" /> On FitWorks
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      +91 {lead.phone}
                      {lead.city && (
                        <>
                          {" · "}
                          <MapPin className="w-3 h-3 inline-block -mt-0.5 text-gray-400" /> {lead.city}
                        </>
                      )}
                      {lead.email && (
                        <>
                          {" · "}
                          <Mail className="w-3 h-3 inline-block -mt-0.5 text-gray-400" /> {lead.email}
                        </>
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {fmt(lead.submittedAt)}
                      {lead.formName ? ` · ${lead.formName}` : ""}
                      {lead.platform ? ` · ${lead.platform}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {wa ? (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => lead.status === "new" && setStatus(lead._id, "contacted")}
                      className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C3E] border border-[#25D366]/30 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-colors"
                    >
                      <WhatsAppIcon />
                      {lead.registeredTrainer ? "Message" : "Invite to join"}
                    </a>
                  ) : (
                    <span className="bg-gray-100 text-gray-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                      No valid number
                    </span>
                  )}

                  <select
                    value={lead.status}
                    disabled={busyId === lead._id}
                    onChange={(e) => setStatus(lead._id, e.target.value as Lead["status"])}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none focus:border-[#d91a24] disabled:opacity-60"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="not_interested">Not interested</option>
                  </select>

                  <button
                    onClick={() => setOpenId(openId === lead._id ? null : lead._id)}
                    title="Show every detail from the form"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    Details
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${openId === lead._id ? "rotate-180" : ""}`}
                    />
                  </button>

                  <button
                    onClick={() => remove(lead._id)}
                    disabled={busyId === lead._id}
                    title="Remove this lead"
                    className="bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {openId === lead._id && (
                  <div className="w-full mt-1 pt-3 border-t border-gray-100">
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {[
                        ["Submitted", fmtLong(lead.submittedAt)],
                        ["Imported", fmtLong(lead.createdAt)],
                        ["Phone", `+91 ${lead.phone}`],
                        ["Email", lead.email || "—"],
                        ["City", lead.city || "—"],
                        ["Form", lead.formName || "—"],
                        ["Campaign", lead.campaignName || "—"],
                        ["Platform", lead.platform || "—"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-2 min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400 w-24 shrink-0 pt-0.5">
                            {k}
                          </dt>
                          <dd className="text-xs font-semibold text-gray-800 min-w-0 break-words">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    {lead.raw && Object.keys(lead.raw).length > 0 && (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-4 mb-1.5">
                          Everything from the form
                        </p>
                        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          {Object.entries(lead.raw).map(([k, v]) => (
                            <div key={k} className="flex gap-2 min-w-0">
                              <dt className="text-[10px] font-semibold text-gray-400 w-32 shrink-0 truncate pt-0.5" title={k}>
                                {k}
                              </dt>
                              <dd className="text-[11px] text-gray-700 min-w-0 break-words">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
