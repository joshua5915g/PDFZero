"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Sparkles } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import AirGapHUD from "@/components/ui/AirGapHUD";

export interface CalculatorLayoutProps {
  title: string;
  description: string;
  iconName?: string;
  category?: string;
  children: React.ReactNode;
  resultSummary?: {
    label: string;
    value: string | number;
    subtext?: string;
  };
  breakdown?: { label: string; value: string | number; color?: string }[];
  tips?: string[];
}

export default function CalculatorLayout({
  title,
  description,
  iconName = "Calculator",
  category = "Calculators & Units",
  children,
  resultSummary,
  breakdown,
  tips
}: CalculatorLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{category}</span>
        </Link>
        <AirGapHUD />
      </div>

      {/* Tool Header Card */}
      <div className="bg-[#0e0f13] border border-[#22242a] p-6 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-xl">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
            <DynamicIcon name={iconName} className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#e6e8ec] tracking-tight">{title}</h1>
            <p className="text-sm text-[#8c929d] max-w-2xl leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl space-y-6">
          {children}
        </div>

        {/* Results & Breakdown Panel */}
        <div className="lg:col-span-5 space-y-6">
          {resultSummary && (
            <div className="bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-slate-950 border border-purple-500/30 p-6 rounded-2xl space-y-3 relative overflow-hidden shadow-xl">
              <div className="text-xs uppercase tracking-wider font-semibold text-purple-300">
                {resultSummary.label}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {resultSummary.value}
              </div>
              {resultSummary.subtext && (
                <div className="text-xs text-slate-400 font-medium">
                  {resultSummary.subtext}
                </div>
              )}
            </div>
          )}

          {breakdown && breakdown.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800/80">
                Breakdown & Metrics
              </div>
              <div className="space-y-2.5">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={`font-semibold ${item.color || "text-slate-200"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl space-y-2.5">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calculator className="size-3.5 text-purple-400" />
                How It Works & Tips
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-purple-400">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
