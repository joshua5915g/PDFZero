"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scissors, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageRange, setPageRange] = useState("");
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setSplitPdfUrl(null);
      
      // Load pages to show total count
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPageCount(doc.getPageCount());
      } catch (err) {
        console.error("Error reading page count:", err);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setSplitPdfUrl(null);
    setPageCount(null);
    setPageRange("");
  };

  const parseRanges = (rangeStr: string, totalPages: number): number[] => {
    const indices: number[] = [];
    const parts = rangeStr.replace(/\s+/g, "").split(",");
    
    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        
        if (!isNaN(start) && !isNaN(end)) {
          // pdf-lib is 0-indexed, inputs are 1-indexed
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(totalPages, Math.max(start, end));
          for (let i = min; i <= max; i++) {
            indices.push(i - 1);
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          indices.push(pageNum - 1);
        }
      }
    }
    // Return unique sorted page indices
    return Array.from(new Set(indices)).sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!file || !pageRange || !pageCount) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      
      setStatus("Parsing requested page ranges...");
      const targetIndices = parseRanges(pageRange, pageCount);
      
      if (targetIndices.length === 0) {
        throw new Error("No valid page numbers found in specified range.");
      }

      setStatus("Extracting and copying pages...");
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(doc, targetIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      setStatus("Generating split PDF...");
      const splitBytes = await newDoc.save();
      const blob = new Blob([splitBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setSplitPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error splitting PDF: " + (err instanceof Error ? err.message : String(err)));
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <Scissors className="size-6 text-[#2B87EB]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Split PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Extract specific pages or page ranges from a PDF document to create a new, separate PDF.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to extract pages from"
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2 truncate">
                <FileText className="size-4 text-[#7E84A3] shrink-0" />
                <span className="text-xs font-bold truncate text-[#2C2C2A] dark:text-[#F1F3F9]">
                  {file.name}
                </span>
                {pageCount && (
                  <span className="text-[10px] text-gray-500 font-semibold">
                    ({pageCount} pages)
                  </span>
                )}
              </div>
              <button 
                onClick={clearAll} 
                className="text-xs text-[#E25B45] hover:underline font-semibold"
                disabled={isProcessing}
              >
                Change File
              </button>
            </div>

            {/* Split Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                Specify Pages to Extract
              </label>
              <input 
                type="text" 
                placeholder="e.g. 1-3, 5, 8-10" 
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                disabled={isProcessing}
                className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#6366F1]"
              />
              <p className="text-[10px] text-gray-400">
                Use commas to separate pages and hyphens for page ranges. E.g. "1-5, 8, 11-15".
              </p>
            </div>

            {/* Execute Trigger */}
            {!isProcessing && !splitPdfUrl && (
              <button 
                onClick={splitPdf}
                disabled={!pageRange}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] disabled:opacity-50 transition-colors shadow-md text-sm"
              >
                Extract Pages
              </button>
            )}

            {isProcessing && (
              <div className="space-y-2 py-2">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6366F1] animate-pulse w-full" />
                </div>
                <p className="text-center text-xs text-gray-500 font-semibold">{status}</p>
              </div>
            )}

            {/* Split Result */}
            {splitPdfUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully extracted specified pages!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={splitPdfUrl}
                    download="extracted.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Split Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
