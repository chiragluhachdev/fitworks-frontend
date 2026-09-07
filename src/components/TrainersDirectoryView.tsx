"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Star, ShieldCheck, Filter, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Trainer {
  _id: string;
  slug: string;
  personal: {
    fullName: string;
    city: string;
    profilePhoto: string;
  };
  professional: {
    professionalTitle: string;
    yearsOfExperience: number;
    specializations: string[];
  };
  workPreferences: {
    expectedMonthlySalary: string;
  };
  verificationStatus?: string;
  payment?: {
    isPaid?: boolean;
    status?: string;
  };
}

export default function TrainersDirectoryView() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/trainers`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setTrainers(json.data);
        } else {
          loadDummyData();
        }
      } catch (error) {
        loadDummyData();
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const loadDummyData = () => {
    setTrainers([
      {
        _id: "1",
        slug: "rahul-sharma",
        personal: { 
          fullName: "Rahul Sharma", 
          city: "Mumbai", 
          profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" 
        },
        professional: { professionalTitle: "Senior Yoga Instructor", yearsOfExperience: 5, specializations: ["Yoga", "Pilates"] },
        workPreferences: { expectedMonthlySalary: "₹25k - ₹35k" }
      },
      {
        _id: "2",
        slug: "priya-verma",
        personal: { 
          fullName: "Priya Verma", 
          city: "Delhi NCR", 
          profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" 
        },
        professional: { professionalTitle: "CrossFit Coach", yearsOfExperience: 3, specializations: ["CrossFit", "Strength"] },
        workPreferences: { expectedMonthlySalary: "₹20k - ₹30k" }
      },
      {
        _id: "3",
        slug: "amit-singh",
        personal: { 
          fullName: "Amit Singh", 
          city: "Bangalore", 
          profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" 
        },
        professional: { professionalTitle: "Personal Trainer", yearsOfExperience: 2, specializations: ["Weight Loss", "General Fitness"] },
        workPreferences: { expectedMonthlySalary: "₹15k - ₹25k" }
      }
    ]);
  };

  const filteredTrainers = trainers.filter(t => 
    t.personal.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.professional.professionalTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.personal.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Find Verified <span className="text-[#d91a24]">Fitness Trainers</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Browse India&apos;s verified fitness professionals and hire the perfect coaches for your gym.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex gap-3">
            <div className="relative flex-1 md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, role or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 transition-all shadow-xs text-sm"
              />
            </div>
            <Link href="/auth">
              <Button variant="outline" className="px-4 py-3 h-auto rounded-xl border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </Link>
          </div>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#d91a24] border-t-transparent rounded-full" />
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-1">No trainers found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => (
              <div key={trainer._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400 overflow-hidden shrink-0 relative">
                      {trainer.personal.profilePhoto ? (
                        <Image 
                          src={trainer.personal.profilePhoto} 
                          alt={trainer.personal.fullName} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <span className="text-xl font-extrabold text-[#d91a24]">{trainer.personal.fullName?.charAt(0) || "T"}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
                        {trainer.personal.fullName}
                        {(trainer.payment?.isPaid || trainer.verificationStatus === "verified") ? (
                          <span title="Verified Trainer" className="inline-flex items-center text-emerald-600">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-gray-300" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs font-semibold text-[#d91a24]">{trainer.professional.professionalTitle}</p>
                        {(trainer.payment?.isPaid || trainer.verificationStatus === "verified") && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200/60">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold text-amber-700 border border-amber-100">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <span>{trainer.personal.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                    </div>
                    <span>{trainer.professional.yearsOfExperience} Years Experience</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {trainer.professional.specializations?.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/auth" className="flex-1">
                    <Button variant="outline" className="w-full border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-semibold py-4 text-xs">
                      View Profile
                    </Button>
                  </Link>
                  <Link href="/auth" className="flex-1">
                    <Button className="w-full bg-[#d91a24] hover:bg-[#cc1616] text-white font-semibold py-4 text-xs">
                      Connect
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
