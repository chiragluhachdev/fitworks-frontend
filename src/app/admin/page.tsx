"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, ArrowRight } from "lucide-react";
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user?.role === "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Welcome, Admin");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.message || "Invalid credentials or unauthorized");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-neutral-800 p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-neutral-400 mt-2 text-center text-sm">
            Enter your secure credentials to access the FitWorks management dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Admin Email</label>
            <input
              type="email"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="admin@fitworks.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Secure Password</label>
            <input
              type="password"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-70 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
