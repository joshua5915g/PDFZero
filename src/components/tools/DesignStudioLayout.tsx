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
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-pink-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{category}</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-300 border border-pink-500/20">
          <Sparkles className="size-3" />
          Live CSS Generator
        </span>
      </div>

      {/* Tool Header Card */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-inner">
            <DynamicIcon name={iconName} className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Controls & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl space-y-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Customize Parameters
          </div>
          {controls}
        </div>

        {/* Live Preview & Code Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Canvas */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl min-h-[320px] flex items-center justify-center relative overflow-hidden">
            {preview}
          </div>

          {/* Generated Code Block */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeTab("css")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    codeTab === "css"
                      ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Vanilla CSS
                </button>
                {tailwindCode && (
                  <button
                    onClick={() => setCodeTab("tailwind")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      codeTab === "tailwind"
                        ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Tailwind CSS
                  </button>
                )}
              </div>

              <button
                onClick={() => handleCopy(codeTab === "css" ? cssCode : (tailwindCode || cssCode), codeTab === "tailwind")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
              >
                {(codeTab === "css" ? copiedCSS : copiedTailwind) ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-pink-200 overflow-x-auto whitespace-pre-wrap bg-slate-950/40">
              <code>{codeTab === "css" ? cssCode : (tailwindCode || cssCode)}</code>
            </pre>
          </div>
        </div>
      </div>

      {tips && tips.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-300">Design Tips</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-pink-400">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
