"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";
import DropZone from "@/components/ui/DropZone";

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setError(null);
    }
  };

  const clearAll = () => {
    setFile(null);
    setError(null);
  };

  const convertDocx = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setStatus("Reading document bytes...");

    try {
      // Dynamically import mammoth and pdfmake to bypass SSR issues
      const mammoth = await import("mammoth");
      
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      
      // Get the correct modules
      const pdfMake = pdfMakeModule.default || pdfMakeModule;
      const pdfFonts = pdfFontsModule.default || pdfFontsModule;
      
      // Assign fonts to VFS
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

      const arrayBuffer = await file.arrayBuffer();

      setStatus("Parsing Document Structure...");
      let parsedResult;
      try {
        parsedResult = await mammoth.extractRawText({ arrayBuffer });
      } catch (mammothErr) {
        throw new Error("Client-side processing requires unencrypted, standard .docx files.");
      }

      const rawText = parsedResult.value;
      if (!rawText || rawText.trim().length === 0) {
        throw new Error("The DOCX document appears to be empty.");
      }

      setStatus("Compiling PDF payload...");
      // Split raw text into paragraphs
      const paragraphs = rawText
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const docDefinition = {
        content: paragraphs.map((p) => ({
          text: p,
          margin: [0, 0, 0, 10] as [number, number, number, number],
          fontSize: 11,
          lineHeight: 1.4,
        })),
        defaultStyle: {
          font: "Roboto",
        },
      };

      setStatus("Generating file download...");
      (pdfMake as any).createPdf(docDefinition).getBlob((blob: Blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `pdfzero_converted_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 2000);

        setStatus("Done!");
        setIsProcessing(false);
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process Word document.");
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
              WORD-TO-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE CONVERTER
          </div>
        </div>

        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".docx"]}
            label="Drag & Drop Word File"
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
                  {(file.size / 1024 / 1024).toFixed(2)} MB | Word Document (.docx)
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

            {/* Error Message Card */}
            {error && (
              <div className="p-4 border-2 border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-mono text-sm flex items-start space-x-2 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
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

            {/* Action Trigger */}
            <button
              onClick={convertDocx}
              disabled={isProcessing}
              className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <FileText className="w-6 h-6" />
              <span>CONVERT WORD TO PDF</span>
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
