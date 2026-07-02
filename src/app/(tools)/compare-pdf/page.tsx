"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Columns, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";

export default function ComparePdf() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [diffResult, setDiffResult] = useState<{
    textA: string;
    textB: string;
    differencesFound: boolean;
    equal: boolean;
  } | null>(null);

  const handleFileASelected = (files: File[]) => {
    if (files.length > 0) {
      setFileA(files[0]);
      setDiffResult(null);
    }
  };

  const handleFileBSelected = (files: File[]) => {
    if (files.length > 0) {
      setFileB(files[0]);
      setDiffResult(null);
    }
  };

  const clearAll = () => {
    setFileA(null);
    setFileB(null);
    setDiffResult(null);
  };

  // Helper method to extract clean text from a PDF file using pdfjs-dist
  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    
    // Dynamically load pdfjs worker on the client side
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += `[Page ${i}]\n${pageText}\n\n`;
    }
    return fullText.trim();
  };

  const comparePdfs = async () => {
    if (!fileA || !fileB) return;
    setIsProcessing(true);
    setStatus("Extracting text from Document A...");

    try {
      const textA = await extractPdfText(fileA);
      
      setStatus("Extracting text from Document B...");
      const textB = await extractPdfText(fileB);

      setStatus("Comparing text lines...");
      const equal = textA === textB;
      
      setDiffResult({
        textA,
        textB,
        differencesFound: !equal,
        equal
      });
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error comparing PDFs: " + (err instanceof Error ? err.message : String(err)));
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <Columns className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Compare PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Compare and check structural text differences between two PDF documents side-by-side. 100% locally.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!diffResult ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document A Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                  Document A (Original)
                </label>
                {fileA ? (
                  <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 truncate">{fileA.name}</span>
                    <button onClick={() => setFileA(null)} className="text-xs text-red-500 hover:underline">Change</button>
                  </div>
                ) : (
                  <DropZone
                    accept={[".pdf"]}
                    label="Upload original PDF"
                    onFilesSelected={handleFileASelected}
                    maxFiles={1}
                  />
                )}
              </div>

              {/* Document B Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                  Document B (Modified)
                </label>
                {fileB ? (
                  <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 truncate">{fileB.name}</span>
                    <button onClick={() => setFileB(null)} className="text-xs text-red-500 hover:underline">Change</button>
                  </div>
                ) : (
                  <DropZone
                    accept={[".pdf"]}
                    label="Upload modified PDF"
                    onFilesSelected={handleFileBSelected}
                    maxFiles={1}
                  />
                )}
              </div>
            </div>

            {/* Compare Trigger */}
            {!isProcessing && (
              <button
                onClick={comparePdfs}
                disabled={!fileA || !fileB}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] disabled:opacity-50 transition-colors shadow-md text-sm"
              >
                Compare Documents
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
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <span className="text-xs font-bold text-[#2C2C2A] dark:text-[#F1F3F9] flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Comparison Complete
              </span>
              <button onClick={clearAll} className="text-xs text-[#E25B45] hover:underline font-semibold">
                Compare Other Files
              </button>
            </div>

            {/* Equality Alert */}
            {diffResult.equal ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-xs font-bold text-emerald-600">
                  The documents are identical. No text discrepancies found!
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-xs font-bold text-amber-600">
                  Text discrepancies detected between the two documents. Review side-by-side below.
                </p>
              </div>
            )}

            {/* Side-by-side text display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7E84A3] uppercase">Original Text (Doc A)</span>
                <pre className="p-4 bg-gray-50 dark:bg-black/25 text-[#2C2C2A] dark:text-[#F1F3F9] text-xs rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap font-mono border border-gray-200 dark:border-white/[0.08]">
                  {diffResult.textA || "[No Text Found]"}
                </pre>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7E84A3] uppercase">Modified Text (Doc B)</span>
                <pre className="p-4 bg-gray-50 dark:bg-black/25 text-[#2C2C2A] dark:text-[#F1F3F9] text-xs rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap font-mono border border-gray-200 dark:border-white/[0.08]">
                  {diffResult.textB || "[No Text Found]"}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
