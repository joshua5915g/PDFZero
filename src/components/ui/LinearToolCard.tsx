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
  const badgeStyles = {
    Popular: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    New: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Pro: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  };

  return (
    <Link href={url} className="block group focus:outline-none h-full">
      <motion.div
        whileHover={{ y: -2, scale: 1.012 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative h-full rounded-2xl bg-[#0e0f12] border border-[#202227] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:border-[#35373f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-colors duration-200 flex flex-col justify-between overflow-hidden"
      >
        {/* Optical Ambient Highlight on Hover */}
        <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(350px_at_50%_0%,rgba(255,255,255,0.05),transparent_80%)]" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#17181d] border border-[#25272e] text-zinc-300 group-hover:text-zinc-100 group-hover:border-zinc-600/50 transition-colors shadow-inner">
              <DynamicIcon name={iconName} className="w-5 h-5" />
            </div>
            {badge && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border ${
                  badgeStyles[badge] || "bg-zinc-800 text-zinc-300 border-zinc-700"
                }`}
              >
                {badge}
              </span>
            )}
          </div>

          <div>
            {/* Calibrated Non-Glare Primary Typography */}
            <h3 className="text-sm font-semibold tracking-tight text-[#e2e4e9] group-hover:text-white transition-colors">
              {title}
            </h3>
            {/* Calibrated 4.8:1 Contrast Secondary Typography */}
            <p className="text-xs text-[#8c929d] mt-1.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-[#1a1b20] flex items-center justify-between text-[11px] font-mono text-[#5e636e] group-hover:text-[#9ea3ae] transition-colors relative z-10">
          <span className="uppercase tracking-wider">{category}</span>
          <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-zinc-300 font-sans font-medium">
            Launch →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
