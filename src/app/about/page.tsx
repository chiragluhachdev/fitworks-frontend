import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About FitWorks — Our Mission & Story",
  description:
    "Learn about FitWorks, India's premier fitness hiring marketplace dedicated to elevating career opportunities for fitness professionals and gyms.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About FitWorks — Our Mission & Story | FitWorks",
    description:
      "FitWorks is India's premier network connecting top-tier fitness professionals with world-class gyms, studios, and private clients.",
    url: "https://fitworks.in/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* About Section */}
        <div id="about" className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-gray-600">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            About FitWorks
          </h1>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              FitWorks is India&apos;s premier network connecting top-tier fitness professionals with world-class gyms, studios, and private clients. 
            </p>
            <p>
              Our mission is to streamline the hiring process in the fitness industry. We believe that every gym deserves access to verified, highly-skilled trainers, and every trainer deserves a platform that champions their expertise and accelerates their career growth.
            </p>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div id="privacy" className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-gray-600 scroll-mt-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
            Privacy Policy
          </h2>
          <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              At <span className="font-bold text-gray-900">FitWorks</span>, your privacy is our priority. We are committed to protecting the personal information of our gyms, trainers, and users.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">Information We Collect</h3>
            <p>
              When you register, we collect information such as your name, email address, phone number, and professional certifications. We also securely process payment details when applicable.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">How We Use Your Data</h3>
            <p>
              We use your data solely to provide, maintain, and improve our matchmaking services. Your profile information is shared with verified gyms to facilitate hiring. We will never sell your personal data to third parties.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">Data Security</h3>
            <p>
              We implement advanced encryption and security protocols to ensure your data remains safe and confidential against unauthorized access.
            </p>
            <p className="pt-4 text-xs text-gray-400">
              Last updated: August 2026. For privacy concerns, please contact privacy@fitworks.in.
            </p>
          </div>
        </div>

        {/* Terms of Service Section */}
        <div id="terms" className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-gray-600 scroll-mt-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
            Terms of Service
          </h2>
          <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              Welcome to <span className="font-bold text-gray-900">FitWorks</span>. By accessing or using our platform, you agree to be bound by these terms.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">1. Account Responsibilities</h3>
            <p>
              You must provide accurate and verifiable information during registration. Gyms are responsible for their hiring decisions, and trainers are responsible for the services they provide. FitWorks acts exclusively as a marketplace connecting the two parties.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">2. Code of Conduct</h3>
            <p>
              All users must maintain professional communication and respect platform guidelines. Spamming, fraudulent profiles, or abusive language will result in immediate account termination.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">3. Fees and Payments</h3>
            <p>
              Any platform fees, subscription models, or commission structures will be clearly communicated prior to usage. FitWorks is not liable for external payment disputes between trainers and gyms.
            </p>
            <p className="pt-4 text-xs text-gray-400">
              Last updated: August 2026. If you have questions regarding these terms, please contact legal@fitworks.in.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}