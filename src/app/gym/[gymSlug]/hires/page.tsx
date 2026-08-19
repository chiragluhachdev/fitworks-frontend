"use client";

import { UserCheck, Star, MapPin, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GymHiresPage({ params }: { params: { gymSlug: string } }) {
  // Dummy Data for MVP
  const hires = [
    {
      _id: "1",
      trainerId: {
        personal: { fullName: "Rahul Sharma", city: "Mumbai" },
        professional: { professionalTitle: "Senior Yoga Instructor", yearsOfExperience: 5 }
      },
      jobId: { position: "Senior Yoga Instructor", employmentType: "Full-time" },
      status: "hired",
      hiredDate: "2023-10-15"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Active Hires</h1>
        <p className="text-gray-500 text-sm">Manage the trainers you have successfully hired through FitWorks.</p>
      </div>

      {hires.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No active hires yet</h3>
          <p className="text-sm text-gray-500">Hire trainers from your job applications to see them here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {hires.map((item) => (
              <div key={item._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">
                    {item.trainerId.personal.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.trainerId.personal.fullName}</h3>
                    <p className="text-sm font-medium text-[#d91a24] mb-2">{item.jobId.position} • {item.jobId.employmentType}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.trainerId.personal.city}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {item.trainerId.professional.yearsOfExperience} Years Exp</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Hired: {new Date(item.hiredDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="outline" className="border-gray-200">Message</Button>
                  <Button variant="outline" className="border-gray-200 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Leave Review
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
