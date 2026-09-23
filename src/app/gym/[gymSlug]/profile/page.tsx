"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Building2,
  MapPin,
  Globe,
  User,
  Briefcase,
  Camera,
  ImageIcon,
  Loader2,
  Check,
  Settings,
  Dumbbell,
} from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import { Field, Input, Select, Textarea, ChipSelect } from "@/components/workspace/Field";
import { ProgressBar } from "@/components/workspace/Progress";
import { PageSkeleton, ErrorState } from "@/components/workspace/States";
import { api, apiBase } from "@/lib/api";

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

type Media = "gymLogo" | "coverImage";

export default function GymProfilePage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

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
  }, [load]);

  const setField = (key: string) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setNested = (parent: "address" | "hiringInformation" | "contactPerson", key: string) =>
    (e: React.ChangeEvent<any>) =>
      setForm((f) => ({ ...f, [parent]: { ...(f as any)[parent], [key]: e.target.value } }));

  /** Uploads go straight to Cloudinary through our own endpoint. */
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

  if (loading) return <PageSkeleton stats={0} rows={4} />;
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  const done = completion.percent >= 100;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Gym profile"
        description="This is what our team shows trainers when we put your role to them."
        actions={
          <Button
            href={`/gym/${gymSlug}/settings`}
            variant="ghost"
            size="sm"
            aria-label="Account settings"
          >
            <Settings className="w-4 h-4" /> Account
          </Button>
        }
      />

      {/* ── Completion ── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 mb-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-gray-900">
              {done ? "Your gym profile is complete" : `Your gym profile is ${completion.percent}% complete`}
            </p>
            <p className="text-[12.5px] text-gray-500 mt-0.5 leading-snug">
              {done
                ? "Everything a trainer wants to know is here."
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
        {/* ── Brand ── */}
        <Panel title="Logo & cover" description="A recognisable gym gets a faster yes from trainers.">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Logo */}
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

            {/* Cover */}
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

        {/* ── Basics ── */}
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

        {/* ── Facilities & focus ── */}
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

        {/* ── Location ── */}
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

        {/* ── Hiring contact ── */}
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

        {/* ── Hiring preferences ── */}
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
          <div className="flex items-center gap-3">
            <Button type="submit" loading={saving} size="lg" className="flex-1 md:flex-none">
              {!saving && <Check className="w-4 h-4" />} Save profile
            </Button>
            <Link
              href={`/gym/${gymSlug}/dashboard`}
              className="hidden md:inline-flex items-center h-12 px-5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
