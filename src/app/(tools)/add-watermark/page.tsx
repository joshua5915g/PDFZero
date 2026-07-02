"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Type, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export default function AddWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3); // 0.1 to 1.0
  const [fontSize, setFontSize] = useState(50);
  const [rotation, setRotation] = useState(-45); // -90 to 90
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setProcessedPdfUrl(null);
      
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
  };

  const applyWatermark = async () => {
    if (!file || !pageCount || !watermarkText) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      setStatus("Applying watermark text overlays...");
      const pages = pdfDoc.getPages();
      
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        
        // Calculate center positioning
        const x = width / 2;
        const y = height / 2;
        
        page.drawText(watermarkText, {
          x: x - (textWidth / 2) * Math.cos((rotation * Math.PI) / 180),
          y: y - (fontSize / 2) * Math.sin((rotation * Math.PI) / 180),
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.7, 0.1, 0.1), // Muted dark red watermark
          opacity: watermarkOpacity,
          rotate: degrees(rotation),
        });
      });

      setStatus("Generating watermarked PDF...");
      const watermarkedBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error adding watermark: " + (err instanceof Error ? err.message : String(err)));
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
          <Type className="size-6 text-[#4CAF50]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Add Watermark</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Stamp an overlay watermark text (such as "CONFIDENTIAL" or "DRAFT") diagonally across all PDF pages.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to add watermark to"
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
                  Watermark Text
                </label>
                <input 
                  type="text" 
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  disabled={isProcessing}
                  className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                    Font Size
                  </label>
                  <input 
                    type="number" 
                    min={10}
                    max={120}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 40)}
                    disabled={isProcessing}
                    className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                    Rotation Angle (Degrees)
                  </label>
                  <input 
                    type="number" 
                    min={-90}
                    max={90}
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value, 10) || 0)}
                    disabled={isProcessing}
                    className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300 flex justify-between">
                  <span>Opacity</span>
                  <span>{Math.round(watermarkOpacity * 100)}%</span>
                </label>
                <input 
                  type="range" 
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  disabled={isProcessing}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Execute Trigger */}
            {!isProcessing && !processedPdfUrl && (
              <button 
                onClick={applyWatermark}
                disabled={!watermarkText}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Apply Watermark
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
                  <span className="text-xs font-bold">Successfully watermarked PDF document!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="watermarked.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Watermark Again
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
