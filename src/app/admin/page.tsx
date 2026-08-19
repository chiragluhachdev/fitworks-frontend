"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, ArrowRight, Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user?.role === "admin") {
        localStorage.setItem("fitworks_token", data.token);
        localStorage.setItem("fitworks_user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Welcome, Administrator");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.message || "Invalid admin credentials");
      }
    } catch (error) {
      toast.error("Failed to connect to authentication server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f9fafb] text-gray-900 font-sans p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="inline-block">
          <Image src="/images/logo.png" alt="FitWorks" width={120} height={32} className="object-contain" />
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Website
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-3xl border border-gray-200/90 p-8 shadow-xl shadow-gray-200/50">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-50 text-[#d91a24] border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#d91a24] bg-red-50 px-2.5 py-1 rounded-full border border-red-200/60 mb-2">
              Staff & Administration
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in with your master credentials to manage the FitWorks marketplace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24] transition-all"
                  placeholder="admin@fitworks.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d91a24]/20 focus:border-[#d91a24] transition-all"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d91a24] hover:bg-[#b8151e] text-white font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 shadow-md shadow-red-500/20 transition-all disabled:opacity-70 mt-6 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Access Admin Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-bit encrypted authentication session
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-md mx-auto text-center text-xs text-gray-400">
        FitWorks India Marketplace • Admin Portal
      </div>
    </div>
  );
}
