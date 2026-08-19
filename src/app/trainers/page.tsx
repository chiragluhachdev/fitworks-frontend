"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star, ShieldCheck, Filter, Briefcase } from "lucide-react";
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
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // For MVP, if API fails or is not connected, fallback to dummy data
    const fetchTrainers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/trainers`);
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
        personal: { fullName: "Rahul Sharma", city: "Mumbai", profilePhoto: "" },
        professional: { professionalTitle: "Senior Yoga Instructor", yearsOfExperience: 5, specializations: ["Yoga", "Pilates"] },
        workPreferences: { expectedMonthlySalary: "₹25k - ₹35k" }
      },
      {
        _id: "2",
        slug: "priya-verma",
        personal: { fullName: "Priya Verma", city: "Delhi NCR", profilePhoto: "" },
        professional: { professionalTitle: "CrossFit Coach", yearsOfExperience: 3, specializations: ["CrossFit", "Strength"] },
        workPreferences: { expectedMonthlySalary: "₹20k - ₹30k" }
      },
      {
        _id: "3",
        slug: "amit-singh",
        personal: { fullName: "Amit Singh", city: "Bangalore", profilePhoto: "" },
        professional: { professionalTitle: "Personal Trainer", yearsOfExperience: 2, specializations: ["Weight Loss", "General Fitness"] },
        workPreferences: { expectedMonthlySalary: "₹15k - ₹25k" }
      }
    ]);
  };

  const filteredTrainers = trainers.filter(t => 
    t.personal.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.professional.professionalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.personal.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Find Verified <span className="text-[#d91a24]">Trainers</span></h1>
            <p className="text-gray-600 text-lg">Browse India's top fitness professionals and hire the perfect match for your gym.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-3">
            <div className="relative flex-1 md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, role or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#d91a24] focus:ring-2 focus:ring-[#d91a24]/10 transition-all shadow-sm"
              />
            </div>
            <Button variant="outline" className="px-4 py-3 h-auto rounded-xl border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </Button>
          </div>
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#d91a24] border-t-transparent rounded-full"></div></div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => (
              <div key={trainer._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400 overflow-hidden shrink-0">
                      {trainer.personal.profilePhoto ? (
                        <img src={trainer.personal.profilePhoto} alt={trainer.personal.fullName} className="w-full h-full object-cover" />
                      ) : (
                        trainer.personal.fullName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
                        {trainer.personal.fullName}
                        <ShieldCheck className="w-4 h-4 text-[#d91a24]" />
                      </h3>
                      <p className="text-sm font-medium text-[#d91a24]">{trainer.professional.professionalTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs font-bold text-amber-700 border border-amber-100">
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

                <div className="flex flex-wrap gap-2 mb-8">
                  {trainer.professional.specializations.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                      {spec}
                    </span>
                  ))}
                  {trainer.professional.specializations.length > 3 && (
                    <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                      +{trainer.professional.specializations.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link href={`/trainers/${trainer.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-semibold py-5">
                      View Profile
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-[#d91a24] hover:bg-[#cc1616] text-white font-semibold py-5">
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
