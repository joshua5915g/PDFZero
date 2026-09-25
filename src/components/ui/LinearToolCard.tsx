"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DynamicIcon from "@/components/ui/DynamicIcon";

export interface LinearToolCardProps {
  title: string;
  description: string;
  url: string;
  iconName: string;
  badge?: "Popular" | "New" | "AI" | "Pro";
  category: string;
}

export default function LinearToolCard({
  title,
  description,
  url,
  iconName,
  badge,
  category
}: LinearToolCardProps) {
  // Category-specific Apple app squircle gradients
  const getIconTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("pdf")) return "from-[#ff3b30] to-[#ff9500] text-white shadow-sm shadow-orange-500/20";
    if (c.includes("image")) return "from-[#af52de] to-[#5856d6] text-white shadow-sm shadow-purple-500/20";
    if (c.includes("dev") || c.includes("converter")) return "from-[#0071e3] to-[#42a5f5] text-white shadow-sm shadow-blue-500/20";
    if (c.includes("calc")) return "from-[#34c759] to-[#30d158] text-white shadow-sm shadow-green-500/20";
    if (c.includes("business") || c.includes("marketing")) return "from-[#ff9500] to-[#ffcc00] text-white shadow-sm shadow-amber-500/20";
    return "from-[#ff2d55] to-[#ff375f] text-white shadow-sm shadow-pink-500/20";
  };

  const badgeStyles = {
    Popular: "bg-[#0071e3]/10 text-[#0071e3] border-[#0071e3]/20",
    New: "bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20",
    AI: "bg-[#af52de]/10 text-[#af52de] border-[#af52de]/20",
    Pro: "bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/20"
  };

  return (
    <Link 
      href={url} 
      className="block group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbfbfd] transition-all h-full"
    >
      <motion.div
        whileHover={{ y: -3, scale: 1.012 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 160px" }}
        className="relative h-full rounded-2xl bg-white border border-black/[0.06] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-black/[0.12] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between overflow-hidden"
      >
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            {/* Apple macOS / iOS App Squircle */}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getIconTheme(category)} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
              <DynamicIcon name={iconName} className="w-5 h-5" />
            </div>
            
            {badge && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
                  badgeStyles[badge] || "bg-black/[0.04] text-[#52525b] border-black/[0.08]"
                }`}
              >
                {badge}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
              {title}
            </h3>
            <p className="text-xs text-[#52525b] mt-1.5 line-clamp-2 leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#71717a] group-hover:text-[#1d1d1f] transition-colors relative z-10 font-medium">
          <span className="capitalize tracking-tight text-[#71717a] text-[11px]">{category}</span>
          <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-[#0071e3] font-semibold flex items-center gap-1">
            Open →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
