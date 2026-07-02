"use client";

import "@ungap/with-resolvers";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import dynamic from "next/dynamic";
import { PDFDocument } from "pdf-lib";

import SignatureCanvas from "react-signature-canvas";

export default function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<any>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setPdfDimensions(null);
      setIsSigned(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setPdfDimensions(null);
    setIsSigned(false);
  };

  const clearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setIsSigned(false);
    }
  };

  // Render the PDF first page onto the background canvas
  useEffect(() => {
    if (!file || pdfDimensions) return;

    const renderPdfPreview = async () => {
      setIsProcessing(true);
      setStatus("Loading PDF document...");
      try {
        const pdfjs = await import("pdfjs-dist");
        // @ts-ignore
        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Render at a standard scale that fits standard screens (e.g. scale 1.0 or 1.25)
        const viewport = page.getViewport({ scale: 1.25 });
        setPdfDimensions({ width: viewport.width, height: viewport.height });

        // We must wait for the canvas element to mount after we set the dimensions
        setTimeout(async () => {
          const canvas = pdfCanvasRef.current;
          if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              await page.render({
                canvasContext: context,
                viewport: viewport,
                canvas: canvas,
              }).promise;
            }
          }
        }, 100);
      } catch (err: any) {
        console.error(err);
        alert(`Failed to render PDF preview: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    };

    renderPdfPreview();
  }, [file, pdfDimensions]);

  const applySignature = async () => {
    if (!file || !sigCanvasRef.current) return;
    if (sigCanvasRef.current.isEmpty()) {
      alert("Please draw your signature first.");
      return;
    }

    setIsProcessing(true);
    setStatus("Compiling signed PDF document...");

    try {
      // Get the full size drawing canvas (preserves relative coordinate positions)
      const canvas = sigCanvasRef.current.getCanvas();
      const dataUrl = canvas.toDataURL("image/png");

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(new Uint8Array(arrayBuffer));
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Convert PNG base64 signature to bytes
      const sigImageBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
      const signatureImage = await pdfDoc.embedPng(sigImageBytes);

      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      // Draw the transparent signature image exactly overlaying the first page
      firstPage.drawImage(signatureImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });

      setStatus("Saving signed document...");
      const signedBytes = await pdfDoc.save();

      setStatus("Triggering download...");
      const signedBlob = new Blob([signedBytes as any], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(signedBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfghost_signed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      setIsSigned(true);
      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      alert(`Failed to apply signature: ${err.message}`);
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
              SIGN-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE E-SIGN
          </div>
        </div>

        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".pdf", "application/pdf"]}
            label="Drag & Drop PDF to E-Sign"
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            maxSizeMB={50}
          />
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            
            {/* File info card */}
            <div className="w-full flex justify-between items-center bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
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

            {/* Signature Draw Overlay Board */}
            {pdfDimensions && (
              <div 
                style={{ width: pdfDimensions.width, height: pdfDimensions.height }} 
                className="relative bg-white border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden"
              >
                {/* Background PDF Canvas */}
                <canvas ref={pdfCanvasRef} className="absolute inset-0 pointer-events-none" />
                
                {/* Overlay Signature Pad */}
                <SignatureCanvas
                  ref={sigCanvasRef}
                  onBegin={() => setIsSigned(true)}
                  canvasProps={{
                    width: pdfDimensions.width,
                    height: pdfDimensions.height,
                    className: "absolute inset-0 cursor-crosshair bg-transparent"
                  }}
                />
              </div>
            )}

            {/* Progress panel */}
            {isProcessing && (
              <div className="w-full border-4 border-black dark:border-white p-4 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>STATUS: {status}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-6 border-2 border-black dark:border-white overflow-hidden relative">
                  <div className="bg-black dark:bg-white h-full w-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Signature Controls */}
            {pdfDimensions && (
              <div className="w-full grid grid-cols-2 gap-4">
                <button
                  onClick={clearSignature}
                  disabled={isProcessing || !isSigned}
                  className="py-3 border-4 border-black dark:border-zinc-300 bg-white dark:bg-zinc-900 text-black dark:text-white font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>CLEAR SIGNATURE</span>
                </button>

                <button
                  onClick={applySignature}
                  disabled={isProcessing || !isSigned}
                  className="py-3 border-4 border-black dark:border-zinc-300 bg-black text-white dark:bg-white dark:text-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>APPLY SIGNATURE</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
