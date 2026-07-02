"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [annotationText, setAnnotationText] = useState("");
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(50);
  const [targetPage, setTargetPage] = useState(1);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setProcessedPdfUrl(null);
      setTargetPage(1);
      
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
    setProcessedPdfUrl(null);
    setPageCount(null);
    setAnnotationText("");
  };

  const applyEdits = async () => {
    if (!file || !pageCount || !annotationText) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      setStatus("Embedding custom text annotations...");
      const pages = pdfDoc.getPages();
      const pageIndex = Math.max(1, Math.min(targetPage, pageCount)) - 1;
      const targetPageObj = pages[pageIndex];
      
      // Draw annotation on specified page at specific coordinate inputs
      targetPageObj.drawText(annotationText, {
        x: xPosition,
        y: yPosition,
        size: 14,
        font: helveticaFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      setStatus("Generating output PDF document...");
      const editedBytes = await pdfDoc.save();
      const blob = new Blob([editedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error applying edits: " + (err instanceof Error ? err.message : String(err)));
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
          <Edit3 className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Edit PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Place custom text annotations at specific coordinate points onto any page of your PDF document.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to edit/annotate"
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

            {/* Config Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                  Text Annotation
                </label>
                <input 
                  type="text" 
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  placeholder="Type annotation text to draw..."
                  disabled={isProcessing}
                  className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                    Target Page
                  </label>
                  <input 
                    type="number" 
                    min={1}
                    max={pageCount || 1}
                    value={targetPage}
                    onChange={(e) => setTargetPage(Math.max(1, Math.min(pageCount || 1, parseInt(e.target.value, 10) || 1)))}
                    disabled={isProcessing}
                    className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                    X Position (Points)
                  </label>
                  <input 
                    type="number" 
                    value={xPosition}
                    onChange={(e) => setXPosition(parseInt(e.target.value, 10) || 0)}
                    disabled={isProcessing}
                    className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                    Y Position (Points)
                  </label>
                  <input 
                    type="number" 
                    value={yPosition}
                    onChange={(e) => setYPosition(parseInt(e.target.value, 10) || 0)}
                    disabled={isProcessing}
                    className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>
            </div>

            {/* Execute Trigger */}
            {!isProcessing && !processedPdfUrl && (
              <button 
                onClick={applyEdits}
                disabled={!annotationText}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Apply Text Annotation
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

            {/* Result Box */}
            {processedPdfUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully applied edits to PDF!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="edited.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Edit Again
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
