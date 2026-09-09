"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer, Sparkles } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import AirGapHUD from "@/components/ui/AirGapHUD";

export interface DocGeneratorLayoutProps {
  title: string;
  description: string;
  iconName?: string;
  category?: string;
  formControls: React.ReactNode;
  previewNode: React.ReactNode;
  onDownloadPdf: () => void;
  onPrint?: () => void;
  isGenerating?: boolean;
  tips?: string[];
}

export default function DocGeneratorLayout({
  title,
  description,
  iconName = "FileSpreadsheet",
  category = "Business & Marketing",
  formControls,
  previewNode,
  onDownloadPdf,
  onPrint,
  isGenerating = false,
  tips
}: DocGeneratorLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors gap-2 group"
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
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
              <DynamicIcon name={iconName} className="size-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#e6e8ec] tracking-tight">{title}</h1>
              <p className="text-sm text-[#8c929d] max-w-2xl leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onPrint && (
              <button
                onClick={onPrint}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition inline-flex items-center gap-2 border border-slate-700"
              >
                <Printer className="size-4" />
                <span>Print</span>
              </button>
            )}
            <button
              onClick={onDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Download className="size-4" />
              <span>{isGenerating ? "Rendering..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Form vs Paper Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl space-y-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Document Details
          </div>
          {formControls}
        </div>

        {/* Paper Document Preview Canvas */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-8 flex justify-center overflow-x-auto shadow-2xl">
          <div className="w-full max-w-[620px] bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden p-6 sm:p-8 text-xs font-sans print:m-0 print:p-0">
            {previewNode}
          </div>
        </div>
      </div>

      {tips && tips.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-300">Document Tips</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
