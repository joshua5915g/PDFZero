"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crop } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function CropPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  
  // Crop margins in percentages
  const [topPercent, setTopPercent] = useState(10);
  const [bottomPercent, setBottomPercent] = useState(10);
  const [leftPercent, setLeftPercent] = useState(10);
  const [rightPercent, setRightPercent] = useState(10);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const clearAll = () => {
    setFile(null);
  };

  const cropPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(new Uint8Array(arrayBuffer));
      const pages = pdfDoc.getPages();

      setStatus("Recalculating page dimensions...");
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { x, y, width, height } = page.getMediaBox();

        // Calculate cropped boundary box dimensions
        const newX = x + (leftPercent / 100) * width;
        const newY = y + (bottomPercent / 100) * height;
        const newWidth = width - ((leftPercent + rightPercent) / 100) * width;
        const newHeight = height - ((topPercent + bottomPercent) / 100) * height;

        // Apply visual display box boundary slash
        page.setMediaBox(newX, newY, newWidth, newHeight);
      }

      setStatus("Saving cropped PDF...");
      const croppedBytes = await pdfDoc.save();

      setStatus("Triggering download...");
      const croppedBlob = new Blob([croppedBytes as any], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(croppedBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfzero_cropped_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      alert(`PDF Cropping failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
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
              CROP-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE CROP ENGINE
          </div>
        </div>

        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".pdf", "application/pdf"]}
            label="Drag & Drop PDF to Crop"
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            maxSizeMB={50}
          />
        ) : (
          <div className="space-y-6">
            
            {/* File info card */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="overflow-hidden">
                <span className="font-bold block text-sm truncate text-black dark:text-white">{file.name}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB | PDF Document
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

            {/* Crop Settings Card */}
            <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Top Margin Crop (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="49"
                    value={topPercent}
                    onChange={(e) => setTopPercent(Math.min(49, Math.max(0, Number(e.target.value))))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 font-bold focus:outline-none focus:border-red-500 rounded-none text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Bottom Margin Crop (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="49"
                    value={bottomPercent}
                    onChange={(e) => setBottomPercent(Math.min(49, Math.max(0, Number(e.target.value))))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 font-bold focus:outline-none focus:border-red-500 rounded-none text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Left Margin Crop (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="49"
                    value={leftPercent}
                    onChange={(e) => setLeftPercent(Math.min(49, Math.max(0, Number(e.target.value))))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 font-bold focus:outline-none focus:border-red-500 rounded-none text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Right Margin Crop (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="49"
                    value={rightPercent}
                    onChange={(e) => setRightPercent(Math.min(49, Math.max(0, Number(e.target.value))))}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 font-bold focus:outline-none focus:border-red-500 rounded-none text-black dark:text-white"
                  />
                </div>
              </div>

            </div>

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

            {/* Action Trigger */}
            <button
              onClick={cropPdf}
              disabled={isProcessing}
              className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <Crop className="w-6 h-6" />
              <span>APPLY CROP MARGINS</span>
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
