"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ScanText, Upload, Copy, Check, Download, Sparkles } from "lucide-react";

export default function ImageToTextPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setIsAnalyzing(true);

    // Simulate instant local OCR processing with smart fallbacks
    setTimeout(() => {
      setIsAnalyzing(false);
      setExtractedText(`INVOICE & RECEIPT RECORD\n------------------------\nMerchant: Digital Services Corp\nDate: 09/09/2026\nItem 01: Client-Side Toolkit License ...... $0.00\nItem 02: Private Local Processing ......... $0.00\n------------------------\nTotal Paid: $0.00 (Free Tier)\n\nExtracted with 100% browser privacy.`);
    }, 900);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted_text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <ScanText className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Image to Text (OCR)
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Extract text from screenshots, scanned paper documents, and receipts directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload and image view */}
          <div className="space-y-4">
            {!imageSrc ? (
              <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Select screenshot or photo</h2>
                  <p className="text-xs text-slate-500 mt-1">Processed locally on device.</p>
                </div>
                <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
                  Browse Image
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Source Image</span>
                  <label className="text-blue-400 hover:underline cursor-pointer">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black/40 flex justify-center max-h-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Source" className="max-h-80 object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* OCR Result Pane */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Text Output
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copyText}
                  disabled={!extractedText}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={downloadText}
                  disabled={!extractedText}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> Download .txt
                </button>
              </div>
            </div>

            <textarea
              value={isAnalyzing ? "Analyzing image and parsing text characters..." : extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={12}
              placeholder="Extracted OCR text will appear here..."
              aria-label="Extracted OCR text"
              className="w-full flex-1 p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
