"use client";

import { Star, MapPin, BadgeCheck, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import type { Trainer } from "@/data/trainers";

export default function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-red-100 transition-all duration-300 cursor-pointer group w-full"
    >
      {/* Image — dominant element */}
      <div className="relative w-full h-[220px] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 bg-gray-50">
          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
            <User className="w-12 h-12 text-gray-400" strokeWidth={2.5} />
          </div>
        </div>
        {/* Verified badge */}
        {trainer.verified && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-[10px] font-semibold text-[#c5121c]">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </div>
        )}
        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[#c5121c] transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Rating */}
        <div className="flex items-start justify-between mb-1.5">
          <h4 className="text-base font-bold text-gray-900">{trainer.name}</h4>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-gray-900">{trainer.rating}</span>
            <span className="text-xs text-gray-400">({trainer.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-sm text-gray-500 mb-2.5">{trainer.title}</p>

        {/* Location + Experience */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin className="w-3 h-3" />
          <span>{trainer.location}</span>
          <span className="mx-0.5">·</span>
          <span>{trainer.experience}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-base font-bold text-gray-900">{trainer.compensation}</span>
          <span className="text-xs font-semibold text-[#c5121c] group-hover:underline">
            View Profile →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
