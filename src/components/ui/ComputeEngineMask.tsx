"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, CheckCircle2 } from "lucide-react";

export interface ComputeEngineMaskProps {
  isComputing: boolean;
  progressPercent?: number; // 0 to 100
  taskPhase?: string;
  error?: string | null;
}

export default function ComputeEngineMask({
  isComputing,
  progressPercent = 45,
  taskPhase = "Executing client-side computation...",
  error = null
}: ComputeEngineMaskProps) {
  return (
    <AnimatePresence>
      {isComputing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 rounded-2xl bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 select-none"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#14151a] border border-[#24262f] flex items-center justify-center text-zinc-300 shadow-inner">
              <Cpu className="w-7 h-7 text-indigo-400 animate-pulse" />
            </div>

            {/* Indeterminate or determinate hardware spinner */}
            <svg className="absolute -inset-1.5 w-[68px] h-[68px] animate-spin" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#6366f1"
                strokeWidth="6"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * Math.min(100, Math.max(10, progressPercent))) / 100}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-1.5 max-w-xs">
            <div className="text-xs font-mono font-medium text-zinc-300 tracking-tight">
              Client Worker Thread: <span className="text-indigo-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono tracking-tight truncate">
              {taskPhase}
            </div>
          </div>

          <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: "10%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
