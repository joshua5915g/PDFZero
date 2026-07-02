"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Hash, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function AddPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [numberPosition, setNumberPosition] = useState("bottom-center"); // bottom-left, bottom-center, bottom-right, top-left, top-center, top-right
  const [startFrom, setStartFrom] = useState(1);
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

  const addNumbers = async () => {
    if (!file || !pageCount) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      setStatus("Drawing page numbers...");
      const pages = pdfDoc.getPages();
      const fontSize = 10;
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumText = `${index + startFrom} / ${pages.length + startFrom - 1}`;
        const textWidth = helveticaFont.widthOfTextAtSize(pageNumText, fontSize);
        
        let x = width / 2 - textWidth / 2; // default center
        let y = 30; // default bottom
        
        // Calculate coordinates based on selected position
        if (numberPosition === "bottom-left") {
          x = 40;
        } else if (numberPosition === "bottom-right") {
          x = width - textWidth - 40;
        } else if (numberPosition === "top-left") {
          x = 40;
          y = height - 40;
        } else if (numberPosition === "top-center") {
          x = width / 2 - textWidth / 2;
          y = height - 40;
        } else if (numberPosition === "top-right") {
          x = width - textWidth - 40;
          y = height - 40;
        }
        
        page.drawText(pageNumText, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.45, 0.45, 0.45),
        });
      });

      setStatus("Generating numbered PDF...");
      const numberedBytes = await pdfDoc.save();
      const blob = new Blob([numberedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error adding numbers: " + (err instanceof Error ? err.message : String(err)));
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
          <Hash className="size-6 text-[#4CAF50]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Add Page Numbers</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Automatically insert formatted page numbers at custom positions (headers or footers) of all pages.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to add page numbers"
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

            {/* Position Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                Number Position
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: "Top Left", val: "top-left" },
                  { label: "Top Center", val: "top-center" },
                  { label: "Top Right", val: "top-right" },
                  { label: "Bottom Left", val: "bottom-left" },
                  { label: "Bottom Center", val: "bottom-center" },
                  { label: "Bottom Right", val: "bottom-right" },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setNumberPosition(item.val)}
                    disabled={isProcessing}
                    className={`h-10 text-[11px] font-semibold rounded-lg border transition-all ${
                      numberPosition === item.val
                        ? "bg-[#6366F1] border-[#6366F1] text-white"
                        : "border-gray-300 dark:border-white/[0.08] text-[#2C2C2A] dark:text-[#F1F3F9] hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start From Config */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">
                Start Numbering From
              </label>
              <input 
                type="number" 
                min={1}
                value={startFrom}
                onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value, 10) || 1))}
                disabled={isProcessing}
                className="w-24 h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Execute Trigger */}
            {!isProcessing && !processedPdfUrl && (
              <button 
                onClick={addNumbers}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Add Page Numbers
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
                  <span className="text-xs font-bold">Successfully numbered PDF pages!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="numbered.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Number Again
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
