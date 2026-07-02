"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, Trash2, FileText, Download, HelpCircle } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

export default function ImgToPdf() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  // Clean up object URLs when components unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleFilesSelected = (newFiles: File[]) => {
    const mapped = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === files.length - 1) return;

    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const generatePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setStatus("Initializing PDF Engine...");

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setStatus(`Embedding: ${item.file.name} (${i + 1}/${files.length})`);
        setProgress(Math.round(((i + 0.2) / files.length) * 100));

        // Read file to ArrayBuffer
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = (e) => reject(e);
          reader.readAsArrayBuffer(item.file);
        });

        // Detect PNG vs JPG
        let embeddedImage;
        const fileType = item.file.type.toLowerCase();
        if (fileType === "image/png") {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else if (fileType === "image/jpeg" || fileType === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else {
          throw new Error(`Unsupported image type: ${item.file.type}`);
        }

        // Dynamically add page matching the aspect ratio and size of the embedded image
        const { width, height } = embeddedImage.scale(1.0);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setStatus("Serializing PDF document...");
      const pdfBytes = await pdfDoc.save();

      setStatus("Preparing download payload...");
      const pdfBlob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfzero_export_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up PDF object URL
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      setStatus("Done!");
    } catch (err: any) {
      console.error(err);
      alert(`Error generating PDF: ${err.message}`);
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
              IMG-TO-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE WEB-ASM ENGINE
          </div>
        </div>



        {/* DropZone */}
        {files.length === 0 ? (
          <DropZone
            accept={["image/png", "image/jpeg", "image/jpg"]}
            label="Drag & Drop Images"
            description="PNG, JPG, or JPEG format supported."
            onFilesSelected={handleFilesSelected}
            maxFiles={30}
            maxSizeMB={20}
          />
        ) : (
          <div className="space-y-6">
            
            {/* File List Header Actions */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <span className="font-bold">{files.length} IMAGES LOADED</span>
              <button
                onClick={clearAll}
                disabled={isProcessing}
                className="px-3 py-1 border-2 border-black dark:border-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                CLEAR ALL
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-12 h-12 object-cover border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate text-black dark:text-white">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB | {item.file.type.split("/")[1].toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveFile(idx, "up")}
                      disabled={idx === 0 || isProcessing}
                      className="p-1 border border-black dark:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4 text-black dark:text-white" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, "down")}
                      disabled={idx === files.length - 1 || isProcessing}
                      className="p-1 border border-black dark:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4 text-black dark:text-white" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      disabled={isProcessing}
                      className="p-1 border border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-30"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick append zone */}
            <div className="border-2 border-dashed border-zinc-400 dark:border-zinc-600 p-2 text-center text-xs text-zinc-500 hover:border-black dark:hover:border-zinc-300 transition-colors relative cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesSelected(Array.from(e.target.files));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <span>+ APPEND MORE IMAGES</span>
            </div>

            {/* Progress Panel */}
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

            {/* Action Trigger */}
            <button
              onClick={generatePdf}
              disabled={isProcessing}
              className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              <FileText className="w-6 h-6" />
              <span>CONVERT {files.length} IMAGES TO PDF</span>
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
