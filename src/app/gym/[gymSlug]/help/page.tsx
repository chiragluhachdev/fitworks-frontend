"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Mail, Phone, ChevronDown, Settings, Plus } from "lucide-react";
import PageHeader from "@/components/workspace/PageHeader";
import Button from "@/components/workspace/Button";
import Panel from "@/components/workspace/Panel";
import HiringSteps from "@/components/workspace/HiringSteps";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_DISPLAY,
  supportWhatsAppUrl,
} from "@/lib/whatsapp";

const FAQ = [
  {
    q: "Why don't I see trainers applying to my vacancy?",
    a: "Trainers don't apply to gyms on FitWorks. Once you post a requirement, our team searches the network, checks documents and speaks to each suitable trainer before putting them in front of you. You'll see them under Trainers as soon as they're ready.",
  },
  {
    q: "How long does it take to find someone?",
    a: "We review every new requirement within a working day. How quickly we find the right person depends on the role, the location and the salary — for most city roles we come back with profiles within a few days.",
  },
  {
    q: "Are the trainers verified?",
    a: "Yes. Every trainer we put forward has had their fitness certificates and a government ID checked by our team. We never share an unverified profile.",
  },
  {
    q: "Can I contact a trainer directly?",
    a: "Tell us you're interested and we'll set up the introduction. Keeping contact details with us is what protects trainers from cold outreach — and it's a large part of why good trainers stay on the platform.",
  },
  {
    q: "What does a FitWorks plan include?",
    a: "All three plans include exactly the same thing: unlimited vacancies, unlimited hiring requirements, trainer recommendations and hands-on hiring support from our team. Longer terms simply cost less per month.",
  },
  {
    q: "What happens when I fill a role?",
    a: "Let us know and we'll mark the vacancy as filled. You can reopen it or post a new one whenever you're hiring again — there's no limit on any plan.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer group"
      >
        <span className="text-[14px] font-bold text-gray-900 group-hover:text-[#d91a24] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-[13.5px] text-gray-600 leading-relaxed pb-4 -mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {a}
        </p>
      )}
    </div>
  );
}

export default function GymHelpPage() {
  const params = useParams();
  const gymSlug = (params?.gymSlug as string) || "";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Help & support"
        description="Our team is on WhatsApp Monday to Saturday, 9 AM to 8 PM."
      />

      {/* ── Reach us ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
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

      <HiringSteps className="mb-5" />

      <Panel title="Common questions" bodyClassName="py-1 sm:py-1">
        {FAQ.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </Panel>

      <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
        <Button href={`/gym/${gymSlug}/vacancies/new`} className="flex-1">
          <Plus className="w-4 h-4" /> Post a Vacancy
        </Button>
        <Button href={`/gym/${gymSlug}/settings`} variant="secondary" className="flex-1">
          <Settings className="w-4 h-4" /> Account settings
        </Button>
      </div>
    </div>
  );
}
