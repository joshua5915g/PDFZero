"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GitMerge, FileText, CheckCircle2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    setMergedPdfUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    
    // Swap
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  const clearAll = () => {
    setFiles([]);
    setMergedPdfUrl(null);
  };

  const mergeFiles = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setStatus("Reading PDF files...");

    try {
      const mergedDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setStatus(`Loading and copying pages from ${files[i].name}...`);
        const arrayBuffer = await files[i].arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      setStatus("Finalizing PDF structure...");
      const mergedPdfBytes = await mergedDoc.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error merging PDFs: " + (err instanceof Error ? err.message : String(err)));
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
          <GitMerge className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Merge PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Combine multiple PDF files into a single, cohesive document. Order them exactly as needed before merging.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {files.length === 0 ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF files here"
            description="Select multiple files to merge them together"
            onFilesSelected={handleFilesSelected}
            maxFiles={20}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#2C2C2A] dark:text-[#F1F3F9]">
                Uploaded Files ({files.length})
              </span>
              <button 
                onClick={clearAll} 
                className="text-xs text-[#E25B45] hover:underline font-semibold"
                disabled={isProcessing}
              >
                Clear All
              </button>
            </div>

            {/* List of Files */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1E2235]/40 border border-[#EBE5DA] dark:border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="size-4 text-[#7E84A3] shrink-0" />
                    <span className="text-xs font-semibold truncate text-[#2C2C2A] dark:text-[#F1F3F9]">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0 || isProcessing}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded disabled:opacity-30 text-[#2C2C2A] dark:text-zinc-300"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button 
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1 || isProcessing}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded disabled:opacity-30 text-[#2C2C2A] dark:text-zinc-300"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button 
                      onClick={() => removeFile(index)}
                      disabled={isProcessing}
                      className="p-1 hover:bg-red-50 text-red-500 rounded"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Files Trigger */}
            <div className="pt-2">
              <DropZone
                accept={[".pdf"]}
                label="Add more PDF files"
                description="Upload additional documents to merge"
                onFilesSelected={handleFilesSelected}
                maxFiles={10}
              />
            </div>

            {/* Execute Trigger */}
            {!isProcessing && !mergedPdfUrl && (
              <button 
                onClick={mergeFiles}
                disabled={files.length < 2}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] disabled:opacity-50 transition-colors shadow-md text-sm"
              >
                Merge PDFs
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

            {/* Merge Result */}
            {mergedPdfUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully merged documents!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={mergedPdfUrl}
                    download="merged.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download Merged PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Merge Again
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
