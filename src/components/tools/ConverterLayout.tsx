"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download, RotateCcw, ArrowRightLeft, Sparkles } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import AirGapHUD from "@/components/ui/AirGapHUD";

export interface ConverterLayoutProps {
  title: string;
  description: string;
  iconName?: string;
  category?: string;
  inputLabel?: string;
  outputLabel?: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (val: string) => void;
  onClear?: () => void;
  onSwap?: () => void;
  downloadFilename?: string;
  downloadMime?: string;
  actionControls?: React.ReactNode;
  additionalPanels?: React.ReactNode;
  tips?: string[];
  errorMessage?: string | null;
}

export default function ConverterLayout({
  title,
  description,
  iconName = "RefreshCw",
  category = "Converters & Dev",
  inputLabel = "Input",
  outputLabel = "Output",
  inputValue,
  outputValue,
  onInputChange,
  onClear,
  onSwap,
  downloadFilename = "output.txt",
  downloadMime = "text/plain",
  actionControls,
  additionalPanels,
  tips,
  errorMessage
}: ConverterLayoutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!outputValue) return;
    try {
      await navigator.clipboard.writeText(outputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!outputValue) return;
    const blob = new Blob([outputValue], { type: downloadMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors gap-2 group"
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
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <DynamicIcon name={iconName} className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#e6e8ec] tracking-tight">{title}</h1>
            <p className="text-sm text-[#8c929d] max-w-3xl leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Action Controls Bar (options, flags, toggles) */}
      {actionControls && (
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          {actionControls}
        </div>
      )}

      {/* Dual-Pane Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Column */}
        <div className="flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{inputLabel}</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{inputValue.length} chars</span>
              {onSwap && (
                <button
                  onClick={onSwap}
                  title="Swap Input and Output"
                  className="p-1 hover:text-emerald-400 hover:bg-slate-800 rounded transition"
                >
                  <ArrowRightLeft className="size-3.5" />
                </button>
              )}
              {onClear && (
                <button
                  onClick={onClear}
                  title="Clear Input"
                  className="p-1 hover:text-red-400 hover:bg-slate-800 rounded transition"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              )}
            </div>
          </div>
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type or paste content here..."
            className="flex-1 w-full min-h-[280px] p-4 bg-transparent text-slate-200 text-sm font-mono resize-y focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            spellCheck={false}
          />
        </div>

        {/* Output Column */}
        <div className="flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{outputLabel}</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{outputValue.length} chars</span>
              <button
                onClick={handleCopy}
                disabled={!outputValue}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded text-xs transition"
              >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputValue}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded text-xs transition"
              >
                <Download className="size-3" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            {errorMessage ? (
              <div className="p-4 text-xs font-mono text-red-400 bg-red-950/20 h-full border border-red-900/30 rounded-b-2xl">
                ⚠️ Error: {errorMessage}
              </div>
            ) : (
              <textarea
                value={outputValue}
                readOnly
                placeholder="Output will appear automatically..."
                className="w-full h-full min-h-[280px] p-4 bg-transparent text-slate-200 text-sm font-mono resize-y focus:outline-none"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>

      {additionalPanels}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-300">Quick Tips & Features</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
