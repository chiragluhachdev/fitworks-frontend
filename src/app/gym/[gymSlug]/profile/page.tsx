"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Building2,
  Briefcase,
  Camera,
  ImageIcon,
  Loader2,
  Check,
  Dumbbell,
  KeyRound,
  LogOut,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  UserCog,
  LifeBuoy,
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import { Field, Input, Select, Textarea, ChipSelect } from "@/components/workspace/Field";
import { ProgressBar } from "@/components/workspace/Progress";
import HiringSteps from "@/components/workspace/HiringSteps";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api, apiBase } from "@/lib/api";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_DISPLAY,
  supportWhatsAppUrl,
} from "@/lib/whatsapp";

const FACILITIES = [
  "Cardio floor",
  "Free weights",
  "Weight machines",
  "Functional area",
  "CrossFit rig",
  "Group class studio",
  "Yoga studio",
  "Swimming pool",
  "Steam / sauna",
  "Locker rooms",
  "Parking",
  "Café / nutrition bar",
];

const SPECIALIZATIONS = [
  "General Fitness",
  "Personal Training",
  "Strength & Conditioning",
  "Weight Loss",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Zumba / Dance Fitness",
  "Functional Training",
  "Sports Conditioning",
];

const EXPERIENCE = ["Fresher (under 1 year)", "1-3 Years", "3-5 Years", "5+ Years", "Any experience"];
const FREQUENCY = ["Occasionally", "Every few months", "Regular", "Always hiring"];

const FAQ = [
  {
    q: "Why don't I see trainers applying to my vacancy?",
    a: "Trainers don't apply to gyms on FitWorks. Once you post a requirement, our team searches the network, checks documents and speaks to each suitable trainer. We then contact you directly with the ones worth meeting.",
  },
  {
    q: "How long does it take to find someone?",
    a: "We review every new requirement within a working day. How quickly we find the right person depends on the role, the location and the salary — for most city roles we come back within a few days.",
  },
  {
    q: "Are the trainers verified?",
    a: "Yes. Every trainer we put forward has had their fitness certificates and a government ID checked by our team.",
  },
  {
    q: "What does a FitWorks plan include?",
    a: "All three plans include exactly the same thing: unlimited vacancies, unlimited hiring requirements and hands-on hiring support. Longer terms simply cost less per month.",
  },
  {
    q: "What happens when I fill a role?",
    a: "Let us know and we'll mark the vacancy as filled. You can reopen it or post a new one whenever you're hiring again — there's no limit on any plan.",
  },
];

type Tab = "profile" | "account" | "support";
type Media = "gymLogo" | "coverImage";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-3.5 text-left cursor-pointer group"
      >
        <span className="text-[13.5px] font-bold text-gray-900 group-hover:text-[#d91a24] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-[13px] text-gray-600 leading-relaxed pb-3.5 -mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {a}
        </p>
      )}
    </div>
  );
}

export default function GymProfileAndSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const gymSlug = (params?.gymSlug as string) || "";

  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Media | null>(null);
  const [completion, setCompletion] = useState<{ percent: number; missing: string[] }>({
    percent: 0,
    missing: [],
  });

  const logoInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    gymName: "",
    gymLogo: "",
    coverImage: "",
    gymDescription: "",
    website: "",
    instagram: "",
    numberOfLocations: 1,
    facilities: [] as string[],
    specializations: [] as string[],
    address: { street: "", city: "", state: "", pincode: "" },
    hiringInformation: {
      trainersRequired: 1,
      trainerTypes: [] as string[],
      preferredExperience: "1-3 Years",
      salaryBudget: "",
      hiringFrequency: "Regular",
    },
    contactPerson: { name: "", designation: "Owner", phone: "", email: "" },
  });

  /* ── Account ── */
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ data?: any; completion?: any }>(`/gyms/${gymSlug}`);
    if (res.ok && res.data?.data) {
      const g = res.data.data;
      setForm((prev) => ({
        ...prev,
        gymName: g.gymName || "",
        gymLogo: g.gymLogo || "",
        coverImage: g.coverImage || "",
        gymDescription: g.gymDescription || "",
        website: g.website || "",
        instagram: g.instagram || "",
        numberOfLocations: g.numberOfLocations || 1,
        facilities: g.facilities || [],
        specializations: g.specializations || [],
        address: { ...prev.address, ...(g.address || {}) },
        hiringInformation: { ...prev.hiringInformation, ...(g.hiringInformation || {}) },
        contactPerson: { ...prev.contactPerson, ...(g.contactPerson || {}) },
      }));
      if (res.data.completion) setCompletion(res.data.completion);
      setLoadError("");
    } else {
      setLoadError(res.error || "We couldn't load your gym profile.");
    }
    setLoading(false);
  }, [gymSlug]);

  useEffect(() => {
    load();
    try {
      const stored = localStorage.getItem("fitworks_user");
      if (stored) setEmail(JSON.parse(stored)?.email || "");
    } catch {
      // A malformed session blob just means we show no email.
    }
  }, [load]);

  const setField = (key: string) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setNested =
    (parent: "address" | "hiringInformation" | "contactPerson", key: string) =>
    (e: React.ChangeEvent<any>) =>
      setForm((f) => ({ ...f, [parent]: { ...(f as any)[parent], [key]: e.target.value } }));

  const upload = async (field: Media, file?: File) => {
    if (!file) return;
    setUploading(field);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "fitworks/gyms");
      const res = await fetch(`${apiBase()}/upload`, { method: "POST", body });
      const json = await res.json();
      if (res.ok && json.success) {
        setForm((f) => ({ ...f, [field]: json.url }));
        toast.success(field === "gymLogo" ? "Logo uploaded" : "Cover image uploaded");
      } else {
        toast.error(json.message || "Upload failed");
      }
    } catch {
      toast.error("Couldn't upload that image. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await api<{ completion?: any }>(`/gyms/${gymSlug}/profile`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      if (res.data?.completion) setCompletion(res.data.completion);
      toast.success("Profile saved");
    } else {
      toast.error(res.error || "Couldn't save your profile.");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return toast.error("The new passwords don't match.");
    if (passwords.next.length < 6) return toast.error("Use at least 6 characters.");

    setChangingPassword(true);
    const res = await api(`/auth/update-password`, {
      method: "PUT",
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
    });
    setChangingPassword(false);

    if (res.ok) {
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success("Password updated");
    } else {
      toast.error(res.error || "Couldn't update your password.");
    }
  };

  const logOut = () => {
    localStorage.removeItem("fitworks_token");
    localStorage.removeItem("fitworks_user");
    router.push("/auth");
  };

  if (loading) return <PageSkeleton stats={0} rows={4} />;
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  const done = completion.percent >= 100;

  const TABS: { id: Tab; label: string; icon: typeof Building2 }[] = [
    { id: "profile", label: "Gym profile", icon: Building2 },
    { id: "account", label: "Account", icon: UserCog },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Profile & settings"
        description="Your gym, your login and everything you might need from us — all in one place."
      />

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 -mb-1 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => {
          const on = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13.5px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                on
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${on ? "text-white" : "text-gray-400"}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────── Gym profile ─────────────────────── */}
      {tab === "profile" && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 mb-5">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-gray-900">
                  {done ? "Your gym profile is complete" : `Your gym profile is ${completion.percent}% complete`}
                </p>
                <p className="text-[12.5px] text-gray-500 mt-0.5 leading-snug">
                  {done
                    ? "Everything our team needs to pitch your role to a trainer."
                    : completion.missing.length
                    ? `Add ${completion.missing.slice(0, 3).join(", ").toLowerCase()} to finish.`
                    : "Fill in the sections below."}
                </p>
              </div>
              <span
                className={`text-[22px] font-extrabold tabular-nums shrink-0 ${
                  done ? "text-emerald-600" : "text-gray-900"
                }`}
              >
                {completion.percent}%
              </span>
            </div>
            <ProgressBar percent={completion.percent} />
          </div>

          <form onSubmit={save} className="space-y-5">
            <Panel title="Logo & cover" description="A recognisable gym gets a faster yes from trainers.">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="shrink-0">
                  <p className="text-[13px] font-bold text-gray-800 mb-2">Logo</p>
                  <button
                    type="button"
                    onClick={() => logoInput.current?.click()}
                    className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#d91a24] bg-gray-50 overflow-hidden flex items-center justify-center transition-colors group cursor-pointer"
                  >
                    {form.gymLogo ? (
                      <Image src={form.gymLogo} alt="" fill className="object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-300" />
                    )}
                    <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      {uploading === "gymLogo" ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5 text-white" />
                      )}
                    </span>
                  </button>
                  <input
                    ref={logoInput}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => upload("gymLogo", e.target.files?.[0])}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-800 mb-2">Cover image</p>
                  <button
                    type="button"
                    onClick={() => coverInput.current?.click()}
                    className="relative w-full h-24 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#d91a24] bg-gray-50 overflow-hidden flex items-center justify-center transition-colors group cursor-pointer"
                  >
                    {form.coverImage ? (
                      <Image src={form.coverImage} alt="" fill className="object-cover" />
                    ) : (
                      <span className="flex items-center gap-2 text-[12.5px] font-semibold text-gray-400">
                        <ImageIcon className="w-4 h-4" /> Add a photo of your gym floor
                      </span>
                    )}
                    <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      {uploading === "coverImage" ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5 text-white" />
                      )}
                    </span>
                  </button>
                  <input
                    ref={coverInput}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => upload("coverImage", e.target.files?.[0])}
                  />
                </div>
              </div>
            </Panel>

            <Panel title="About your gym">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Gym name" required htmlFor="gymName" className="sm:col-span-2">
                  <Input id="gymName" value={form.gymName} onChange={setField("gymName")} required />
                </Field>

                <Field
                  label="Description"
                  htmlFor="gymDescription"
                  className="sm:col-span-2"
                  hint="What kind of gym is this, who trains here, what's the atmosphere like?"
                >
                  <Textarea
                    id="gymDescription"
                    rows={4}
                    value={form.gymDescription}
                    onChange={setField("gymDescription")}
                    placeholder="e.g. A 5,000 sq ft strength-focused gym in Indiranagar with 400 members…"
                  />
                </Field>

                <Field label="Number of locations" htmlFor="numberOfLocations">
                  <Input
                    id="numberOfLocations"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={form.numberOfLocations}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, numberOfLocations: Number(e.target.value) || 1 }))
                    }
                  />
                </Field>

                <Field label="Website" htmlFor="website">
                  <Input
                    id="website"
                    type="url"
                    value={form.website}
                    onChange={setField("website")}
                    placeholder="https://"
                  />
                </Field>

                <Field label="Instagram" htmlFor="instagram" className="sm:col-span-2">
                  <Input
                    id="instagram"
                    value={form.instagram}
                    onChange={setField("instagram")}
                    placeholder="@yourgym"
                  />
                </Field>
              </div>
            </Panel>

            <Panel title="Facilities & training focus" description="Tap everything that applies.">
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-gray-400" /> Facilities
                  </p>
                  <ChipSelect
                    multiple
                    options={FACILITIES}
                    value={form.facilities}
                    onChange={(facilities) => setForm((f) => ({ ...f, facilities }))}
                  />
                </div>

                <div className="pt-5 border-t border-gray-100">
                  <p className="text-[13px] font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" /> Training we offer
                  </p>
                  <ChipSelect
                    multiple
                    options={SPECIALIZATIONS}
                    value={form.specializations}
                    onChange={(specializations) => setForm((f) => ({ ...f, specializations }))}
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Location">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Street address" htmlFor="street" className="sm:col-span-2">
                  <Input id="street" value={form.address.street} onChange={setNested("address", "street")} />
                </Field>
                <Field label="City" htmlFor="city">
                  <Input id="city" value={form.address.city} onChange={setNested("address", "city")} />
                </Field>
                <Field label="State" htmlFor="state">
                  <Input id="state" value={form.address.state} onChange={setNested("address", "state")} />
                </Field>
                <Field label="Pincode" htmlFor="pincode">
                  <Input
                    id="pincode"
                    inputMode="numeric"
                    value={form.address.pincode}
                    onChange={setNested("address", "pincode")}
                  />
                </Field>
              </div>
            </Panel>

            <Panel
              title="Hiring contact"
              description="Who our team speaks to when we have a trainer for you."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Name" htmlFor="contactName">
                  <Input
                    id="contactName"
                    value={form.contactPerson.name}
                    onChange={setNested("contactPerson", "name")}
                  />
                </Field>
                <Field label="Designation" htmlFor="designation">
                  <Input
                    id="designation"
                    value={form.contactPerson.designation}
                    onChange={setNested("contactPerson", "designation")}
                    placeholder="Owner, Manager…"
                  />
                </Field>
                <Field label="Phone" htmlFor="contactPhone">
                  <Input
                    id="contactPhone"
                    type="tel"
                    inputMode="tel"
                    value={form.contactPerson.phone}
                    onChange={setNested("contactPerson", "phone")}
                  />
                </Field>
                <Field label="Email" htmlFor="contactEmail">
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactPerson.email}
                    onChange={setNested("contactPerson", "email")}
                  />
                </Field>
              </div>
            </Panel>

            <Panel
              title="Hiring preferences"
              description="Your defaults — we use these to narrow the search before you've even posted."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Trainers you typically need" htmlFor="trainersRequired">
                  <Input
                    id="trainersRequired"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={form.hiringInformation.trainersRequired}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        hiringInformation: {
                          ...f.hiringInformation,
                          trainersRequired: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Experience preferred" htmlFor="preferredExperience">
                  <Select
                    id="preferredExperience"
                    value={form.hiringInformation.preferredExperience}
                    onChange={setNested("hiringInformation", "preferredExperience")}
                  >
                    {EXPERIENCE.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Monthly salary budget" htmlFor="salaryBudget">
                  <Input
                    id="salaryBudget"
                    value={form.hiringInformation.salaryBudget}
                    onChange={setNested("hiringInformation", "salaryBudget")}
                    placeholder="e.g. 25,000 - 35,000"
                  />
                </Field>
                <Field label="How often you hire" htmlFor="hiringFrequency">
                  <Select
                    id="hiringFrequency"
                    value={form.hiringInformation.hiringFrequency}
                    onChange={setNested("hiringInformation", "hiringFrequency")}
                  >
                    {FREQUENCY.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </Panel>

            {/* Sticky on mobile so Save is always a thumb away in a long form. */}
            <div className="sticky bottom-20 md:bottom-0 md:static z-20 -mx-4 px-4 py-3 md:mx-0 md:px-0 md:py-0 bg-[#f7f8fa]/90 backdrop-blur md:bg-transparent md:backdrop-blur-none border-t border-gray-200/70 md:border-0">
              <Button type="submit" loading={saving} size="lg" block className="md:w-auto">
                {!saving && <Check className="w-4 h-4" />} Save profile
              </Button>
            </div>
          </form>
        </>
      )}

      {/* ─────────────────────── Account ─────────────────────── */}
      {tab === "account" && (
        <div className="space-y-5">
          <Panel title="Login email">
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50/70 rounded-xl border border-gray-200/80">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400">
                  Primary login
                </p>
                <p className="text-[14px] font-bold text-gray-900 mt-1 truncate">{email || "—"}</p>
              </div>
              <span className="text-[11.5px] font-bold px-2.5 py-1 bg-white text-emerald-700 border border-emerald-200/70 rounded-full shrink-0">
                Active
              </span>
            </div>
            <p className="text-[12px] text-gray-400 mt-3">
              To change the email on your account, message us and we'll move it across.
            </p>
          </Panel>

          <Panel title="Change password" description="At least 6 characters.">
            <form onSubmit={changePassword} className="space-y-5">
              <Field label="Current password" htmlFor="currentPassword" required>
                <Input
                  id="currentPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  placeholder="••••••••"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="New password" htmlFor="newPassword" required>
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={passwords.next}
                    onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                    placeholder="Minimum 6 characters"
                  />
                </Field>
                <Field
                  label="Confirm new password"
                  htmlFor="confirmPassword"
                  required
                  error={
                    passwords.confirm && passwords.confirm !== passwords.next
                      ? "These don't match."
                      : undefined
                  }
                >
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    placeholder="Repeat it"
                  />
                </Field>
              </div>

              <Button type="submit" loading={changingPassword}>
                {!changingPassword && <KeyRound className="w-4 h-4" />} Update password
              </Button>
            </form>
          </Panel>

          <Panel title="Session">
            <Button variant="danger" onClick={logOut} block className="sm:w-auto">
              <LogOut className="w-4 h-4" /> Log out
            </Button>
          </Panel>
        </div>
      )}

      {/* ─────────────────────── Support ─────────────────────── */}
      {tab === "support" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <a
              href={supportWhatsAppUrl("Hi FitWorks! 👋\n\nI need help with my gym account.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-emerald-300 active:scale-[0.99] transition-all"
            >
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-gray-900">WhatsApp</p>
                <p className="text-[12px] text-gray-500">Fastest reply</p>
              </div>
            </a>

            <a
              href={`tel:+${SUPPORT_PHONE}`}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 active:scale-[0.99] transition-all"
            >
              <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <Phone className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-gray-900">Call us</p>
                <p className="text-[12px] text-gray-500 truncate">{SUPPORT_PHONE_DISPLAY}</p>
              </div>
            </a>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 active:scale-[0.99] transition-all"
            >
              <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <Mail className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-gray-900">Email</p>
                <p className="text-[12px] text-gray-500 truncate">{SUPPORT_EMAIL}</p>
              </div>
            </a>
          </div>

          <p className="text-[12.5px] text-gray-500 text-center">
            Monday to Saturday, 9 AM to 8 PM.
          </p>

          <HiringSteps />

          <Panel title="Common questions" bodyClassName="py-1 sm:py-1">
            {FAQ.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </Panel>
        </div>
      )}
    </div>
  );
}
