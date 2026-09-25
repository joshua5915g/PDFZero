"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Sparkles } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";

export interface DesignStudioLayoutProps {
  title: string;
  description: string;
  iconName?: string;
  category?: string;
  controls: React.ReactNode;
  preview: React.ReactNode;
  cssCode: string;
  tailwindCode?: string;
  tips?: string[];
}

export default function DesignStudioLayout({
  title,
  description,
  iconName = "Palette",
  category = "Design & Web Fun",
  controls,
  preview,
  cssCode,
  tailwindCode,
  tips
}: DesignStudioLayoutProps) {
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const [codeTab, setCodeTab] = useState<"css" | "tailwind">("css");

  const handleCopy = async (code: string, isTailwind: boolean) => {
    try {
      await navigator.clipboard.writeText(code);
      if (isTailwind) {
        setCopiedTailwind(true);
        setTimeout(() => setCopiedTailwind(false), 2000);
      } else {
        setCopiedCSS(true);
        setTimeout(() => setCopiedCSS(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#af52de]/10 text-[#af52de] border border-[#af52de]/20">
          <Sparkles className="size-3" />
          Live CSS Generator
        </span>
      </div>

      {/* Apple Studio Tool Header Card */}
      <div className="bg-white/80 border border-black/[0.06] p-6 sm:p-7 rounded-3xl relative overflow-hidden backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#af52de] to-[#da8fff] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <DynamicIcon name={iconName} className="size-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">{title}</h1>
            <p className="text-sm text-[#6e6e73] max-w-3xl leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Controls & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white border border-black/[0.08] backdrop-blur-xl p-6 rounded-3xl space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] pb-2 border-b border-black/[0.06]">
            Customize Parameters
          </div>
          {controls}
        </div>

        {/* Live Preview & Code Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Canvas */}
          <div className="bg-[#f5f5f7] border border-black/[0.08] p-6 rounded-3xl min-h-[320px] flex items-center justify-center relative overflow-hidden shadow-inner">
            {preview}
          </div>

          {/* Generated Code Block */}
          <div className="bg-white border border-black/[0.08] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="px-5 py-3.5 bg-[#f5f5f7] border-b border-black/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeTab("css")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    codeTab === "css"
                      ? "bg-white text-[#1d1d1f] shadow-xs border border-black/[0.08]"
                      : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                >
                  Vanilla CSS
                </button>
                {tailwindCode && (
                  <button
                    onClick={() => setCodeTab("tailwind")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      codeTab === "tailwind"
                        ? "bg-white text-[#1d1d1f] shadow-xs border border-black/[0.08]"
                        : "text-[#6e6e73] hover:text-[#1d1d1f]"
                    }`}
                  >
                    Tailwind CSS
                  </button>
                )}
              </div>

              <button
                onClick={() => handleCopy(codeTab === "css" ? cssCode : (tailwindCode || cssCode), codeTab === "tailwind")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] border border-black/[0.08] rounded-xl text-xs font-semibold transition"
              >
                {(codeTab === "css" ? copiedCSS : copiedTailwind) ? (
                  <>
                    <Check className="size-3 text-[#34c759]" />
                    <span className="text-[#34c759]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-[#6e6e73]" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-5 text-xs font-mono text-[#1d1d1f] overflow-x-auto whitespace-pre-wrap bg-white">
              <code>{codeTab === "css" ? cssCode : (tailwindCode || cssCode)}</code>
            </pre>
          </div>
        </div>
      </div>

      {tips && tips.length > 0 && (
        <div className="bg-white/80 border border-black/[0.06] p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="text-xs font-semibold text-[#1d1d1f]">Design Tips</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#6e6e73]">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-[#af52de] font-bold">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
