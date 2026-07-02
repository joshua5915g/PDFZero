"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, FileText, CheckCircle2, Sparkles } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, PDFName, rgb } from "pdf-lib";

export default function RedactPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  // Manual Coordinates
  const [pageInput, setPageInput] = useState("1");
  const [xPercent, setXPercent] = useState(10);
  const [yPercent, setYPercent] = useState(80);
  const [widthPercent, setWidthPercent] = useState(80);
  const [heightPercent, setHeightPercent] = useState(10);

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

  // Run Regex coordinate-matching auto-redaction
  const runAutoRedact = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Load PDFJS to scan text coordinates
      setStatus("Scanning text coordinates for sensitive data (Emails & Phones)...");
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;

      let redactionsApplied = 0;

      // Regex expressions
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Scanning page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pdfLibPage = pages[i - 1];

        textContent.items.forEach((item: any) => {
          const text = item.str;
          const hasEmail = emailRegex.test(text);
          const hasPhone = phoneRegex.test(text);

          if (hasEmail || hasPhone) {
            // Extract coordinates from transform matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
            const transform = item.transform;
            const x = transform[4];
            const y = transform[5];
            
            // Estimate text dimensions
            const fontSize = Math.abs(transform[0] || transform[3] || 10);
            const rectWidth = (item.width || text.length * (fontSize * 0.5));
            const rectHeight = (item.height || fontSize * 1.2);

            // Draw solid black rectangle block over PII coordinate bounds
            pdfLibPage.drawRectangle({
              x: x - 2,
              y: y - 2,
              width: rectWidth + 4,
              height: rectHeight + 4,
              color: rgb(0, 0, 0),
            });
            redactionsApplied++;
          }
        });
      }

      setStatus(`Scrubbing metadata catalog headers (${redactionsApplied} blocks redacted)...`);
      try {
        pdfDoc.catalog.delete(PDFName.of("Metadata"));
        pdfDoc.setTitle("");
        pdfDoc.setAuthor("");
        pdfDoc.setSubject("");
        pdfDoc.setCreator("");
        pdfDoc.setProducer("");
      } catch (metaErr) {
        console.warn("Failed to strip metadata catalog during auto-redaction", metaErr);
      }

      setStatus("Generating output PDF...");
      const savedBytes = await pdfDoc.save();
      const blob = new Blob([savedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error applying auto-redaction: " + (err instanceof Error ? err.message : String(err)));
      setIsProcessing(false);
    }
  };

  const applyManualRedaction = async () => {
    if (!file || !pageCount) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      setStatus("Drawing black redaction blocks...");
      const drawBlock = (idx: number) => {
        const page = pages[idx];
        const { width, height } = page.getSize();
        
        const x = (xPercent / 100) * width;
        const y = (yPercent / 100) * height;
        const rectWidth = (widthPercent / 100) * width;
        const rectHeight = (heightPercent / 100) * height;

        page.drawRectangle({
          x,
          y,
          width: rectWidth,
          height: rectHeight,
          color: rgb(0, 0, 0),
        });
      };

      if (pageInput.toLowerCase() === "all") {
        for (let i = 0; i < pages.length; i++) {
          drawBlock(i);
        }
      } else {
        const pageNum = parseInt(pageInput, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > pages.length) {
          throw new Error(`Invalid page number. Document has only ${pages.length} pages.`);
        }
        drawBlock(pageNum - 1);
      }

      setStatus("Generating redacted PDF...");
      const savedBytes = await pdfDoc.save();
      const blob = new Blob([savedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error applying redaction: " + (err instanceof Error ? err.message : String(err)));
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
          <ShieldAlert className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Redact PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Black out sensitive info. Choose manual coordinate drawing or use Smart Auto-Redact to automatically mask emails and phone numbers.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a file to mask credentials"
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

            {/* Redaction Controls */}
            {!processedPdfUrl && !isProcessing && (
              <div className="space-y-6">
                
                {/* Auto Redact Callout */}
                <div className="p-4 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#818CF8]">
                    <Sparkles className="size-4" />
                    Smart Auto-Redaction
                  </div>
                  <p className="text-[11px] text-[#7E84A3] leading-relaxed">
                    Instantly scan document text coordinates to automatically blackout sensitive personal data (Emails & Phone Numbers).
                  </p>
                  <button
                    onClick={runAutoRedact}
                    className="w-full h-9 bg-[#6366F1] hover:bg-[#5558DD] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    Run Auto-Redaction
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/[0.06]"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">or edit manually</span>
                  <div className="flex-grow border-t border-white/[0.06]"></div>
                </div>

                {/* Manual Coordinate Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">Target Page</label>
                      <input 
                        type="text" 
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        placeholder="e.g. 1, 3, or all"
                        className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">Height (%)</label>
                      <input 
                        type="number" 
                        value={heightPercent}
                        onChange={(e) => setHeightPercent(parseInt(e.target.value, 10) || 0)}
                        className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">X Start (%)</label>
                      <input 
                        type="number" 
                        value={xPercent}
                        onChange={(e) => setXPercent(parseInt(e.target.value, 10) || 0)}
                        className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">Y Start (%)</label>
                      <input 
                        type="number" 
                        value={yPercent}
                        onChange={(e) => setYPercent(parseInt(e.target.value, 10) || 0)}
                        className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300">Width (%)</label>
                      <input 
                        type="number" 
                        value={widthPercent}
                        onChange={(e) => setWidthPercent(parseInt(e.target.value, 10) || 0)}
                        className="w-full h-10 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={applyManualRedaction}
                    className="w-full h-11 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-900 transition-colors shadow text-xs"
                  >
                    Apply Manual Block
                  </button>
                </div>

              </div>
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
                  <span className="text-xs font-bold">Successfully applied redaction masking!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="redacted.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download Redacted PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Redact Again
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
