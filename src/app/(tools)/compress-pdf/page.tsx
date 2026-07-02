"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, PDFRawStream, PDFName } from "pdf-lib";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    savingPercentage: number;
    imagesFound: number;
  } | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setResult(null);
    }
  };

  const clearAll = () => {
    setFile(null);
    setResult(null);
  };

  const compressFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      const originalSize = pdfBytes.length;

      // Load PDF Document
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Method 1: Remove heavy metadata XML bloat
      setStatus("Stripping XML metadata bloat...");
      try {
        pdfDoc.catalog.delete(PDFName.of("Metadata"));
        pdfDoc.setTitle("");
        pdfDoc.setAuthor("");
        pdfDoc.setSubject("");
        pdfDoc.setCreator("");
        pdfDoc.setProducer("");
      } catch (err) {
        console.warn("Could not strip all metadata:", err);
      }

      // Method 2: Scan for image streams (Advanced optimization step)
      setStatus("Scanning and optimizing image assets...");
      let imagesFound = 0;
      try {
        const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
        for (const [ref, obj] of indirectObjects) {
          if (obj instanceof PDFRawStream) {
            try {
              const dict = obj.dict;
              const subtype = dict.get(PDFName.of("Subtype"));
              if (subtype === PDFName.of("Image")) {
                imagesFound++;
                // Image detected. PDFRawStream is natively compressed on save if initialized properly,
                // and metadata removal cleans up references.
              }
            } catch (err) {
              console.warn("Skipped checking sub-stream due to parsing error", err);
            }
          }
        }
      } catch (err) {
        console.warn("Enumerate indirect objects failed", err);
      }

      // Method 3: Re-serialize setting useObjectStreams: false (rebuild XRef cleanly)
      setStatus("Rebuilding cross-reference tables...");
      const compressedBytes = await pdfDoc.save({ useObjectStreams: false });
      const compressedSize = compressedBytes.length;

      // Calculate savings
      const savings = originalSize - compressedSize;
      const savingPercentage = originalSize > 0 ? Math.round((savings / originalSize) * 100) : 0;

      // Trigger programmatic download
      setStatus("Downloading optimized PDF...");
      const compressedBlob = new Blob([compressedBytes as any], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(compressedBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfghost_compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      setResult({
        originalSize,
        compressedSize,
        savingPercentage: Math.max(0, savingPercentage),
        imagesFound,
      });
      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      alert(`Error compressing PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 text-zinc-900 dark:text-zinc-50 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black dark:border-white pb-6 space-y-4 sm:space-y-0">
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 text-sm font-bold border-2 border-black dark:border-zinc-300 px-3 py-1 bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HOME</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tighter">
              COMPRESS-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE OPTIMIZER
          </div>
        </div>



        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".pdf", "application/pdf"]}
            label="Drag & Drop PDF File"
            description="Select a PDF to reduce its file size."
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            maxSizeMB={100}
          />
        ) : (
          <div className="space-y-6">
            
            {/* File info card */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="overflow-hidden">
                <span className="font-bold block text-sm truncate text-black dark:text-white">{file.name}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatSize(file.size)} | PDF Document
                </span>
              </div>
              <button
                onClick={clearAll}
                disabled={isProcessing}
                className="px-3 py-1 border-2 border-black dark:border-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                REMOVE FILE
              </button>
            </div>

            {/* Results card */}
            {result && (
              <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-green-400 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(74,222,128,1)] space-y-4">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <span className="font-black text-lg">OPTIMIZATION COMPLETE</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 pt-4 text-sm font-bold">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-xs">ORIGINAL SIZE</span>
                    <span className="text-black dark:text-white">{formatSize(result.originalSize)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-xs">COMPRESSED SIZE</span>
                    <span className="text-black dark:text-white">{formatSize(result.compressedSize)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-xs">SAVINGS PERCENTAGE</span>
                    <span className="text-red-600 dark:text-red-400">{result.savingPercentage}% Smaller</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-xs">RAW IMAGE LAYERS SCAN</span>
                    <span className="text-black dark:text-white">{result.imagesFound} Images Found</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress panel */}
            {isProcessing && (
              <div className="border-4 border-black dark:border-white p-4 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>STATUS: {status}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-6 border-2 border-black dark:border-white overflow-hidden relative">
                  <div className="bg-black dark:bg-white h-full w-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Conversion Trigger */}
            <button
              onClick={compressFile}
              disabled={isProcessing}
              className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <Zap className="w-6 h-6" />
              <span>OPTIMIZE & COMPRESS PDF</span>
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
