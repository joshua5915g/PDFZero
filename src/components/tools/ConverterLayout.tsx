"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download, RotateCcw, ArrowRightLeft, Sparkles } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0071e3] to-[#42a5f5] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <DynamicIcon name={iconName} className="size-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">{title}</h1>
            <p className="text-sm text-[#6e6e73] max-w-3xl leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      {actionControls && (
        <div className="bg-white/80 border border-black/[0.06] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {actionControls}
        </div>
      )}

      {/* Dual-Pane Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Column */}
        <div className="flex flex-col bg-white border border-black/[0.08] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="px-5 py-3.5 bg-[#f5f5f7] border-b border-black/[0.06] flex items-center justify-between text-xs font-semibold text-[#1d1d1f]">
            <span>{inputLabel}</span>
            <div className="flex items-center gap-2">
              <span className="text-[#86868b] font-normal">{inputValue.length} chars</span>
              {onSwap && (
                <button
                  onClick={onSwap}
                  title="Swap Input and Output"
                  className="p-1 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.05] rounded-lg transition"
                >
                  <ArrowRightLeft className="size-3.5" />
                </button>
              )}
              {onClear && (
                <button
                  onClick={onClear}
                  title="Clear Input"
                  className="p-1 text-[#6e6e73] hover:text-[#ff3b30] hover:bg-black/[0.05] rounded-lg transition"
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
            className="flex-1 w-full min-h-[280px] p-5 bg-transparent text-[#1d1d1f] text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 placeholder-[#86868b]"
            spellCheck={false}
          />
        </div>

        {/* Output Column */}
        <div className="flex flex-col bg-white border border-black/[0.08] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="px-5 py-3.5 bg-[#f5f5f7] border-b border-black/[0.06] flex items-center justify-between text-xs font-semibold text-[#1d1d1f]">
            <span>{outputLabel}</span>
            <div className="flex items-center gap-2">
              <span className="text-[#86868b] font-normal">{outputValue.length} chars</span>
              <button
                onClick={handleCopy}
                disabled={!outputValue}
                className="inline-flex items-center gap-1 px-3 py-1 bg-black/[0.04] hover:bg-black/[0.08] disabled:opacity-40 text-[#1d1d1f] rounded-full text-xs font-medium transition cursor-pointer"
              >
                {copied ? <Check className="size-3 text-[#34c759]" /> : <Copy className="size-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputValue}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white rounded-full text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Download className="size-3" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            {errorMessage ? (
              <div className="p-5 text-xs font-mono text-[#d70015] bg-[#ff3b30]/10 h-full border border-[#ff3b30]/20 rounded-b-3xl">
                ⚠️ Error: {errorMessage}
              </div>
            ) : (
              <textarea
                value={outputValue}
                readOnly
                placeholder="Output will appear automatically..."
                className="w-full h-full min-h-[280px] p-5 bg-transparent text-[#1d1d1f] text-sm font-mono resize-y focus:outline-none placeholder-[#86868b]"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>

      {additionalPanels}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <div className="bg-white/80 border border-black/[0.06] p-5 sm:p-6 rounded-3xl space-y-2.5 shadow-xs">
          <div className="text-xs font-semibold text-[#1d1d1f]">Quick Tips & Features</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#6e6e73]">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2">
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
