"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import { Field, Input, Select, Textarea } from "@/components/workspace/Field";
import { api } from "@/lib/api";

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
  "Rehabilitation",
];

const TRAINER_TYPES = [
  "Personal Trainer",
  "Floor Trainer",
  "Group Class Instructor",
  "Yoga Instructor",
  "Zumba Instructor",
  "Strength Coach",
  "Head Trainer",
  "Physiotherapist",
];

const EXPERIENCE = ["Fresher (under 1 year)", "1-3 Years", "3-5 Years", "5+ Years", "Any experience"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const HOURS = [
  "Morning shift",
  "Evening shift",
  "Split shift (morning + evening)",
  "Full day",
  "Flexible",
];

const STEPS = [
  { id: 1, name: "The role", short: "Role" },
  { id: 2, name: "Location & pay", short: "Pay" },
  { id: 3, name: "Details", short: "Details" },
];

type Form = {
  position: string;
  trainerType: string;
  specialization: string;
  experience: string;
  numberOfOpenings: string;
  branchName: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  workingHours: string;
  description: string;
  requirementsText: string;
  additionalInfo: string;
};

const EMPTY: Form = {
  position: "",
  trainerType: "Personal Trainer",
  specialization: "General Fitness",
  experience: "1-3 Years",
  numberOfOpenings: "1",
  branchName: "",
  location: "",
  salaryRange: "",
  employmentType: "Full-time",
  workingHours: "Full day",
  description: "",
  requirementsText: "",
  additionalInfo: "",
};

export default function PostVacancyPage() {
  const params = useParams();
  const router = useRouter();
  const gymSlug = (params?.gymSlug as string) || "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  const set = (key: keyof Form) => (e: React.ChangeEvent<any>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  /** Validates only the step being left, so nobody is shouted at early. */
  const validate = (which: number) => {
    const next: Partial<Record<keyof Form, string>> = {};
    if (which === 1) {
      if (!form.position.trim()) next.position = "Give the role a title.";
      if (!Number(form.numberOfOpenings) || Number(form.numberOfOpenings) < 1)
        next.numberOfOpenings = "At least one opening.";
    }
    if (which === 2) {
      if (!form.location.trim()) next.location = "Where is this role based?";
      if (!form.salaryRange.trim()) next.salaryRange = "Trainers need to know what you're paying.";
    }
    if (which === 3) {
      if (form.description.trim().length < 20)
        next.description = "A line or two about the job helps us find the right person.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(3)) return;

    setSubmitting(true);
    setSubmitError("");

    const res = await api(`/jobs`, {
      method: "POST",
      body: JSON.stringify({
        gymSlug,
        position: form.position.trim(),
        description: form.description.trim(),
        requirements: {
          experience: form.experience,
          specialization: form.specialization,
          trainerType: form.trainerType,
        },
        salaryRange: form.salaryRange.trim(),
        employmentType: form.employmentType,
        location: form.location.trim(),
        branchName: form.branchName.trim(),
        workingHours: form.workingHours,
        requirementsText: form.requirementsText.trim(),
        additionalInfo: form.additionalInfo.trim(),
        numberOfOpenings: Number(form.numberOfOpenings) || 1,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitError(res.error || "We couldn't post this vacancy. Please try again.");
    }
  };

  const progress = useMemo(() => ((step - 1) / (STEPS.length - 1)) * 100, [step]);

  /* ─────────────────── Submitted ─────────────────── */
  if (done) {
    return (
      <div className="max-w-xl mx-auto animate-in fade-in duration-300 pt-6 sm:pt-12">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-7 sm:p-10 text-center">
          <span className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </span>
          <h1 className="text-[24px] sm:text-[27px] font-extrabold text-gray-900 tracking-[-0.02em]">
            Vacancy submitted successfully
          </h1>
          <p className="text-[14px] text-gray-500 mt-3 leading-relaxed">
            Our FitWorks team will review your requirement and start finding suitable trainers for you.
          </p>

          <div className="mt-7 p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-200/80 text-left">
            <p className="text-[13px] font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d91a24]" /> What happens next
            </p>
            <ol className="space-y-2.5">
              {[
                "We review your requirement, usually within a working day.",
                "Our team searches the FitWorks network and speaks to suitable trainers.",
                "We share the profiles worth meeting and set up the introduction.",
              ].map((line, i) => (
                <li key={line} className="flex gap-3 text-[13px] text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-500 flex items-center justify-center shrink-0 mt-px">
                    {i + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 mt-7">
            <Button href={`/gym/${gymSlug}/vacancies`} block>
              View my vacancies
            </Button>
            <Button
              variant="secondary"
              block
              onClick={() => {
                setForm(EMPTY);
                setErrors({});
                setStep(1);
                setDone(false);
              }}
            >
              Post another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────── Form ─────────────────── */
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        back={{ href: `/gym/${gymSlug}/vacancies`, label: "My vacancies" }}
        title="Post a vacancy"
        description="Tell us what you're hiring for. Our team takes it from there."
      />

      {/* ── Step indicator ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s) => {
            const state = s.id < step ? "done" : s.id === step ? "current" : "todo";
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => s.id < step && setStep(s.id)}
                disabled={s.id > step}
                className={`flex items-center gap-2 text-left ${s.id < step ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0 transition-colors ${
                    state === "done"
                      ? "bg-emerald-500 text-white"
                      : state === "current"
                      ? "bg-[#d91a24] text-white"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                >
                  {state === "done" ? <Check className="w-3.5 h-3.5" /> : s.id}
                </span>
                <span
                  className={`text-[13px] font-bold hidden sm:inline ${
                    state === "todo" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {s.name}
                </span>
                <span
                  className={`text-[12px] font-bold sm:hidden ${
                    state === "todo" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {s.short}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-[#d91a24] rounded-full transition-all duration-400"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <Field
              label="Vacancy title"
              required
              htmlFor="position"
              error={errors.position}
              hint="What you'd call this job in your gym."
            >
              <Input
                id="position"
                value={form.position}
                onChange={set("position")}
                placeholder="e.g. Senior Personal Trainer"
                autoFocus
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Trainer type / role" htmlFor="trainerType">
                <Select id="trainerType" value={form.trainerType} onChange={set("trainerType")}>
                  {TRAINER_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Specialization" htmlFor="specialization">
                <Select id="specialization" value={form.specialization} onChange={set("specialization")}>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Experience required" htmlFor="experience">
                <Select id="experience" value={form.experience} onChange={set("experience")}>
                  {EXPERIENCE.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Number of openings"
                htmlFor="numberOfOpenings"
                required
                error={errors.numberOfOpenings}
              >
                <Input
                  id="numberOfOpenings"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={form.numberOfOpenings}
                  onChange={set("numberOfOpenings")}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <Field
              label="Location"
              required
              htmlFor="location"
              error={errors.location}
              hint="Area and city — trainers filter by how far they'd travel."
            >
              <Input
                id="location"
                value={form.location}
                onChange={set("location")}
                placeholder="e.g. Indiranagar, Bangalore"
                autoFocus
              />
            </Field>

            <Field
              label="Branch"
              htmlFor="branchName"
              hint="Only if you run more than one location."
            >
              <Input
                id="branchName"
                value={form.branchName}
                onChange={set("branchName")}
                placeholder="e.g. 100 Feet Road branch"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Salary range"
                required
                htmlFor="salaryRange"
                error={errors.salaryRange}
                hint="A range is fine."
              >
                <Input
                  id="salaryRange"
                  value={form.salaryRange}
                  onChange={set("salaryRange")}
                  placeholder="e.g. ₹25,000 - ₹35,000 / month"
                />
              </Field>

              <Field label="Job type" htmlFor="employmentType">
                <Select id="employmentType" value={form.employmentType} onChange={set("employmentType")}>
                  {JOB_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Working hours" htmlFor="workingHours" className="sm:col-span-2">
                <Select id="workingHours" value={form.workingHours} onChange={set("workingHours")}>
                  {HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <Field
              label="What the job involves"
              required
              htmlFor="description"
              error={errors.description}
              hint="Daily duties, class formats, how many clients — whatever helps us picture the role."
            >
              <Textarea
                id="description"
                rows={5}
                value={form.description}
                onChange={set("description")}
                placeholder="e.g. Running personal training sessions for 6-8 clients a day, plus two group classes a week…"
                autoFocus
              />
            </Field>

            <Field
              label="Requirements"
              htmlFor="requirementsText"
              hint="Certifications, languages, anything a candidate must have."
            >
              <Textarea
                id="requirementsText"
                rows={3}
                value={form.requirementsText}
                onChange={set("requirementsText")}
                placeholder="e.g. Certified trainer, comfortable speaking Kannada and English"
              />
            </Field>

            <Field
              label="Additional information"
              htmlFor="additionalInfo"
              hint="Incentives, accommodation, meals, anything else worth knowing."
            >
              <Textarea
                id="additionalInfo"
                rows={3}
                value={form.additionalInfo}
                onChange={set("additionalInfo")}
                placeholder="e.g. Performance incentives on personal training packages"
              />
            </Field>

            {submitError && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200/70">
                <AlertCircle className="w-4 h-4 text-[#d91a24] shrink-0 mt-0.5" />
                <p className="text-[13px] font-semibold text-[#d91a24]">{submitError}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center gap-2.5 mt-7 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={back}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <Link
              href={`/gym/${gymSlug}/vacancies`}
              className="inline-flex items-center justify-center h-11 px-4.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
          )}

          <div className="flex-1" />

          {step < 3 ? (
            <Button type="button" onClick={next}>
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" loading={submitting}>
              Post Vacancy
            </Button>
          )}
        </div>
      </form>

      <p className="text-[12px] text-gray-400 text-center mt-5 leading-relaxed">
        Your vacancy goes to the FitWorks team, not to a public job board.
      </p>
    </div>
  );
}
