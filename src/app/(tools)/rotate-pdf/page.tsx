"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import PdfPagePreviews from "@/components/ui/PdfPagePreviews";
import { PDFDocument, degrees } from "pdf-lib";

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({}); // 1-indexed page index mapped to rotation degree (0, 90, 180, 270)
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setRotatedPdfUrl(null);
      setPageRotations({});
      
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
    setRotatedPdfUrl(null);
    setPageCount(null);
    setPageRotations({});
  };

  const handlePageClick = (pageIndex: number) => {
    setPageRotations((prev) => {
      const current = prev[pageIndex] || 0;
      return {
        ...prev,
        [pageIndex]: (current + 90) % 360,
      };
    });
    setRotatedPdfUrl(null);
  };

  const rotatePdfDoc = async () => {
    if (!file || !pageCount) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      setStatus("Applying custom page rotations...");
      pages.forEach((page, index) => {
        const pageNum = index + 1;
        const additionalRotation = pageRotations[pageNum] || 0;
        
        if (additionalRotation > 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + additionalRotation) % 360));
        }
      });

      setStatus("Generating rotated PDF document...");
      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setRotatedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error rotating PDF: " + (err instanceof Error ? err.message : String(err)));
      setIsProcessing(false);
    }
  };

  const rotateAllPages = () => {
    if (!pageCount) return;
    const newRotations: Record<number, number> = {};
    for (let i = 1; i <= pageCount; i++) {
      const current = pageRotations[i] || 0;
      newRotations[i] = (current + 90) % 360;
    }
    setPageRotations(newRotations);
    setRotatedPdfUrl(null);
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
          <RotateCw className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Rotate PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Click individual pages to rotate them visually 90° clockwise, or rotate all pages together before saving.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to rotate pages"
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
              
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={rotateAllPages}
                  disabled={isProcessing}
                  className="text-xs text-[#6366F1] hover:underline font-semibold"
                >
                  Rotate All Pages
                </button>
                <button 
                  onClick={clearAll} 
                  className="text-xs text-[#E25B45] hover:underline font-semibold"
                  disabled={isProcessing}
                >
                  Change File
                </button>
              </div>
            </div>

            {/* Visual Page Previews Grid */}
            {!rotatedPdfUrl && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                  Click on page thumbnails to rotate
                </label>
                <PdfPagePreviews
                  file={file}
                  onPageClick={handlePageClick}
                  pageRotations={pageRotations}
                />
              </div>
            )}

            {/* Execute Trigger */}
            {!isProcessing && !rotatedPdfUrl && (
              <button 
                onClick={rotatePdfDoc}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Apply Rotations & Save
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

            {/* Rotation Result */}
            {rotatedPdfUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully rotated PDF pages!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={rotatedPdfUrl}
                    download="rotated.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Rotate Again
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
