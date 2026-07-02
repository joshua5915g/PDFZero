"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import PdfPagePreviews from "@/components/ui/PdfPagePreviews";
import { PDFDocument } from "pdf-lib";

export default function RemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // 1-indexed page numbers to remove
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setProcessedPdfUrl(null);
      setSelectedPages([]);
      
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
    setSelectedPages([]);
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) => 
      prev.includes(pageNum) 
        ? prev.filter((p) => p !== pageNum) 
        : [...prev, pageNum]
    );
    setProcessedPdfUrl(null);
  };

  const removeSelectedPages = async () => {
    if (!file || !pageCount || selectedPages.length === 0) return;
    
    if (selectedPages.length === pageCount) {
      alert("You cannot remove all pages from the PDF document. At least one page must remain.");
      return;
    }

    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setStatus("Removing selected pages...");
      // Sort in descending order to avoid shift issues during deletion
      const pagesToRemove = [...selectedPages].sort((a, b) => b - a);
      
      for (const pageIndex of pagesToRemove) {
        // pdf-lib page removal is 0-indexed, our selection is 1-indexed
        pdfDoc.removePage(pageIndex - 1);
      }

      setStatus("Generating modified PDF document...");
      const savedBytes = await pdfDoc.save();
      const blob = new Blob([savedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error removing pages: " + (err instanceof Error ? err.message : String(err)));
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <Trash2 className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Remove Pages</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Click on page thumbnails to select them, and delete unwanted pages from your document.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to remove pages from"
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

            {/* Visual Page Previews Selector */}
            {pageCount && !processedPdfUrl && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                  Select Pages to Remove
                </label>
                <PdfPagePreviews
                  file={file}
                  onPageClick={togglePageSelection}
                  selectedPages={selectedPages}
                />
              </div>
            )}

            {/* Execute Trigger */}
            {!isProcessing && !processedPdfUrl && (
              <button 
                onClick={removeSelectedPages}
                disabled={selectedPages.length === 0}
                className="w-full h-11 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors shadow-md text-sm"
              >
                Remove Selected Pages ({selectedPages.length})
              </button>
            )}

            {isProcessing && (
              <div className="space-y-2 py-2">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 animate-pulse w-full" />
                </div>
                <p className="text-center text-xs text-gray-500 font-semibold">{status}</p>
              </div>
            )}

            {/* Result Box */}
            {processedPdfUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully removed selected pages!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="pages_removed.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Remove More Pages
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
