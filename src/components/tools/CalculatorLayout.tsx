"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";

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
          className="inline-flex items-center text-xs font-medium text-[#6e6e73] hover:text-[#0071e3] transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-black/20">/</span>
          <span className="text-[#1d1d1f] font-semibold">{category}</span>
        </Link>
      </div>

      {/* Apple Studio Tool Header Card */}
      <div className="bg-white/80 border border-black/[0.06] p-6 sm:p-7 rounded-3xl relative overflow-hidden backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#34c759] to-[#30d158] text-white flex items-center justify-center shadow-md shadow-green-500/20 shrink-0">
            <DynamicIcon name={iconName} className="size-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">{title}</h1>
            <p className="text-sm text-[#6e6e73] max-w-2xl leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-7 bg-white border border-black/[0.08] backdrop-blur-xl p-6 sm:p-7 rounded-3xl space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {children}
        </div>

        {/* Results & Breakdown Panel */}
        <div className="lg:col-span-5 space-y-6">
          {resultSummary && (
            <div className="bg-gradient-to-br from-[#0071e3]/5 via-white to-white border border-[#0071e3]/20 p-6 rounded-3xl space-y-3 relative overflow-hidden shadow-[0_8px_30px_rgba(0,113,227,0.06)]">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#0071e3]">
                {resultSummary.label}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
                {resultSummary.value}
              </div>
              {resultSummary.subtext && (
                <div className="text-xs text-[#6e6e73] font-medium">
                  {resultSummary.subtext}
                </div>
              )}
            </div>
          )}

          {breakdown && breakdown.length > 0 && (
            <div className="bg-white border border-black/[0.08] p-6 rounded-3xl space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] pb-2 border-b border-black/[0.06]">
                Breakdown & Metrics
              </div>
              <div className="space-y-2.5">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-[#6e6e73]">{item.label}</span>
                    <span className={`font-semibold ${item.color || "text-[#1d1d1f]"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div className="bg-white/80 border border-black/[0.06] p-5 rounded-2xl space-y-2.5 shadow-xs">
              <div className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <Calculator className="size-3.5 text-[#0071e3]" />
                How It Works & Tips
              </div>
              <ul className="text-xs text-[#6e6e73] space-y-1.5 leading-relaxed">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#34c759] font-bold">✓</span>
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
