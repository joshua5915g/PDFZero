"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileCode, Printer, Download, Copy, Check, Eye } from "lucide-react";

export default function MarkdownToPdfPage() {
  const [markdown, setMarkdown] = useState(`# Project Roadmap 2026

## Executive Summary
This document provides a comprehensive overview of the **PDFZero** client-side tool ecosystem.

### Key Milestones
- **Q1 2026:** Launch 160+ browser-first utilities
- **Q2 2026:** Privacy-first offline document encryption
- **Q3 2026:** Global CDN distribution

### Implementation Checklist
1. Zero server file uploads
2. Full AES-256 local encryption
3. Responsive mobile and desktop layouts

> "Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra
`);

  const handlePrint = () => {
    window.print();
  };

  // Convert basic markdown to clean HTML for preview
  const parseMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-slate-950 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-purple-700">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 py-1 italic text-slate-600 my-4 bg-slate-50">$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-700">$1</li>')
      .replace(/\n$/gim, '<br />');

    return html;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 mb-2">
                <FileCode className="w-3.5 h-3.5" />
                PDF Tools
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Markdown to PDF Converter
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Render Markdown syntax into clean, formatted paginated PDF documents client-side.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-600/20"
            >
              <Printer className="w-4 h-4" /> Export / Print as PDF
            </button>
          </div>
        </div>

        {/* Dual Editor & Preview Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col space-y-3 print:hidden">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Markdown Source Code
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={22}
              className="w-full flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm leading-relaxed text-slate-200 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Printable Page Preview */}
          <div className="p-8 sm:p-12 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 min-h-[500px] font-sans leading-relaxed text-sm">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
