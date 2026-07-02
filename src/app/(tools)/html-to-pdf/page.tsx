"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Code } from "lucide-react";

export default function HtmlToPdf() {
  const [htmlCode, setHtmlCode] = useState(
    `<div style="padding: 40px; background: linear-gradient(135deg, #ff0055, #00ffcc); color: black; font-family: sans-serif; text-align: center; border: 10px solid black; box-shadow: 10px 10px 0px 0px rgba(0,0,0,1);">
  <h1 style="font-size: 42px; font-weight: 900; margin-bottom: 20px;">PDFGhost HTML EXPORT</h1>
  <p style="font-size: 18px; font-weight: bold; font-family: monospace;">This DOM segment was rasterized and compiled entirely client-side.</p>
</div>`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const convertHtml = async () => {
    if (!previewRef.current) return;
    setIsProcessing(true);
    setStatus("Rasterizing DOM element...");

    try {
      // Dynamically import libraries to prevent SSR bundle issues
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = previewRef.current;

      // Render the DOM element into an HTML5 Canvas using html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // 2.0x scale for crisp text resolution
        useCORS: true,
        backgroundColor: null, // preserve transparency if any
      });

      setStatus("Compiling PDF page layout...");
      const imgData = canvas.toDataURL("image/png");

      // Initialize jsPDF with dimensions matching the canvas exactly
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2], // adjust scale factor
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);

      setStatus("Triggering download...");
      pdf.save(`pdfghost_html_export_${Date.now()}.pdf`);

      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      alert(`HTML conversion failed: ${err.message}`);
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
              HTML-TO-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE DOM RASTER
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Inputs Section */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 flex flex-col">
            <label className="block text-xs font-black uppercase text-black dark:text-white">
              Raw HTML Code Input
            </label>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              rows={12}
              disabled={isProcessing}
              className="w-full flex-grow bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 p-3 text-sm font-mono focus:outline-none text-black dark:text-white rounded-none resize-y"
            />
          </div>

          {/* Render Preview Section */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
            <label className="block text-xs font-black uppercase text-black dark:text-white">
              Render Preview
            </label>
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-950 overflow-auto max-h-[300px]">
              <div 
                ref={previewRef} 
                className="inline-block min-w-full"
                dangerouslySetInnerHTML={{ __html: htmlCode }} 
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
          onClick={convertHtml}
          disabled={isProcessing || !htmlCode}
          className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          <Code className="w-6 h-6" />
          <span>CONVERT HTML TO PDF</span>
        </button>

      </div>
    </main>
  );
}
