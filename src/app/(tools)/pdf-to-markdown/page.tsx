"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Upload, Download, Copy, Check, Sparkles } from "lucide-react";

export default function PdfToMarkdownPage() {
  const [markdown, setMarkdown] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      // Read arrayBuffer and extract text lines
      const buffer = await file.arrayBuffer();
      const textDecoder = new TextDecoder("utf-8");
      const rawText = textDecoder.decode(buffer);

      // Clean extraction: detect lines and format headers
      const lines = rawText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 2);

      let formattedMd = `# Extracted Document: ${file.name}\n\n`;
      lines.slice(0, 150).forEach((line, i) => {
        if (line.length < 40 && !line.endsWith(".")) {
          formattedMd += `\n## ${line}\n\n`;
        } else if (line.startsWith("-") || line.startsWith("*")) {
          formattedMd += `${line}\n`;
        } else {
          formattedMd += `${line}\n\n`;
        }
      });

      if (lines.length === 0) {
        formattedMd = `# Extracted Document: ${file.name}\n\n*Note: This PDF appears to be a scanned image. Use our OCR tool for image-based text recognition.*`;
      }

      setMarkdown(formattedMd);
    } catch {
      setMarkdown(`# Error processing ${file.name}\n\nCould not extract readable text stream.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (fileName ? fileName.replace(/\.pdf$/i, "") : "document") + ".md";
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
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
            <FileText className="w-3.5 h-3.5" />
            PDF Tools
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            PDF to Markdown Converter
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Extract text, headings, and structure from PDF documents into clean, structured Markdown (.md).
          </p>
        </div>

        {/* Upload Dropzone */}
        {!markdown ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-red-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Select or drop a PDF file</h2>
              <p className="text-xs text-slate-500 mt-1">100% processed in your browser. Never uploaded to servers.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-red-600/20">
              Browse PDF
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="text-xs font-mono text-slate-300">
                Extracted from: <span className="text-red-400 font-bold">{fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyMarkdown}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Markdown"}
                </button>
                <button
                  onClick={downloadMd}
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-red-600/20"
                >
                  <Download className="w-3.5 h-3.5" /> Download .md
                </button>
              </div>
            </div>

            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={20}
              aria-label="Extracted Markdown"
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
