"use client";

import "@ungap/with-resolvers";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileImage, HelpCircle } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import JSZip from "jszip";

export default function PdfToImg() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  const clearAll = () => {
    setFile(null);
  };

  const extractImages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setStatus("Loading PDF Engine...");

    try {
      // Dynamically import pdfjs-dist and worker to avoid SSR issues
      const pdfjs = await import("pdfjs-dist");

      // Dynamically import the worker module as required
      // @ts-ignore
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
      
      // Set the worker source using Webpack 5 URL resolution to ensure it runs correctly on the client
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      setStatus("Reading PDF file bytes...");
      const arrayBuffer = await file.arrayBuffer();

      setStatus("Loading PDF document...");
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const zip = new JSZip();

      for (let i = 1; i <= numPages; i++) {
        setStatus(`Rendering page ${i} of ${numPages}...`);
        setProgress(Math.round(((i - 0.5) / numPages) * 100));

        const page = await pdf.getPage(i);
        
        // Render at 2.0x scale for crisp high-quality images
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Create an off-screen canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not get 2D canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        // Convert canvas rendering to Blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) {
              resolve(b);
            } else {
              reject(new Error(`Failed to convert canvas to blob on page ${i}`));
            }
          }, "image/png");
        });

        // Add PNG blob to ZIP payload
        zip.file(`page-${i}.png`, blob);
        setProgress(Math.round((i / numPages) * 100));
      }

      setStatus("Packaging PNG images into ZIP archive...");
      const zipBlob = await zip.generateAsync({ type: "blob" });

      setStatus("Triggering download...");
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfzero_extracted_images_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      alert(`Error rendering PDF to images: ${err.message}`);
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
              PDF-TO-IMG
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE RENDERING ENGINE
          </div>
        </div>



        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".pdf", "application/pdf"]}
            label="Drag & Drop PDF File"
            description="Select a PDF to extract pages as images."
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

            {/* Progress panel */}
            {isProcessing && (
              <div className="border-4 border-black dark:border-white p-4 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>STATUS: {status}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-6 border-2 border-black dark:border-white overflow-hidden relative">
                  <div
                    className="bg-black dark:bg-white h-full transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Conversion Trigger */}
            <button
              onClick={extractImages}
              disabled={isProcessing}
              className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <FileImage className="w-6 h-6" />
              <span>EXTRACT IMAGES TO ZIP</span>
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
