import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact FitWorks — Get in Touch",
  description:
    "Have questions or need support with trainer hiring? Contact the FitWorks team for assistance, partner onboarding, and general inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact FitWorks — Get in Touch | FitWorks",
    description:
      "Get in touch with the FitWorks team for support, gym onboarding, and partnership inquiries.",
    url: "https://fitworks.in/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#d91a24] uppercase tracking-widest bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-block">
            Support & Partnerships
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            We&apos;re here to help you <span className="text-[#d91a24]">grow</span>.
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Whether you are a gym seeking elite trainers or a fitness coach looking for your next career move, our team is ready to assist.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Email Us</h3>
            <p className="text-xs text-gray-500">For general support and partnerships:</p>
            <a href="mailto:support@fitworks.in" className="text-sm font-bold text-[#d91a24] hover:underline">
              support@fitworks.in
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Partner &amp; Support Helpline</h3>
            <p className="text-xs text-gray-500">Call or WhatsApp (Monday – Saturday, 9 AM – 8 PM):</p>
            <div className="flex flex-col items-center gap-1.5">
              <a href="tel:+918130200285" className="text-sm font-bold text-[#d91a24] hover:underline">
                +91 8130200285
              </a>
              <a 
                href="https://wa.me/918130200285" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                Chat on WhatsApp ↗
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d91a24] flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Headquarters</h3>
            <p className="text-xs text-gray-500">Operating across India:</p>
            <span className="text-xs font-bold text-gray-800">
              Mumbai • Delhi NCR • Bengaluru
            </span>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Ready to start hiring or get discovered?
            </h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-xl">
              Create your account in 2 minutes. Gyms can post vacancies instantly, and trainers can verify credentials.
            </p>
          </div>
          <Link href="/auth">
            <Button className="bg-[#d91a24] hover:bg-[#cc1616] text-white px-6 h-12 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}