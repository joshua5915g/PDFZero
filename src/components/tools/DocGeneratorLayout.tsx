"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";

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
          className="inline-flex items-center text-xs font-medium text-[#6e6e73] hover:text-[#0071e3] transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-black/20">/</span>
          <span className="text-[#1d1d1f] font-semibold">{category}</span>
        </Link>
      </div>

      {/* Tool Header Card */}
      <div className="bg-white/80 border border-black/[0.06] p-6 sm:p-7 rounded-3xl relative overflow-hidden backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff9500] to-[#ffb340] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <DynamicIcon name={iconName} className="size-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">{title}</h1>
              <p className="text-sm text-[#6e6e73] max-w-2xl leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onPrint && (
              <button
                onClick={onPrint}
                className="px-4 py-2.5 bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] rounded-xl text-xs font-semibold transition inline-flex items-center gap-2 border border-black/[0.08]"
              >
                <Printer className="size-4" />
                <span>Print</span>
              </button>
            )}
            <button
              onClick={onDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold rounded-xl text-xs transition shadow-md shadow-blue-500/20 inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
        <div className="lg:col-span-5 bg-white border border-black/[0.08] backdrop-blur-xl p-6 rounded-3xl space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] pb-2 border-b border-black/[0.06]">
            Document Details
          </div>
          {formControls}
        </div>

        {/* Paper Document Preview Canvas */}
        <div className="lg:col-span-7 bg-[#f5f5f7] border border-black/[0.08] rounded-3xl p-4 sm:p-8 flex justify-center overflow-x-auto shadow-inner">
          <div className="w-full max-w-[620px] bg-white text-[#1d1d1f] rounded-xl shadow-lg border border-black/[0.06] overflow-hidden p-6 sm:p-8 text-xs font-sans print:m-0 print:p-0">
            {previewNode}
          </div>
        </div>
      </div>

      {tips && tips.length > 0 && (
        <div className="bg-white/80 border border-black/[0.06] p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="text-xs font-semibold text-[#1d1d1f]">Document Tips</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#6e6e73]">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-[#34c759] font-bold">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
