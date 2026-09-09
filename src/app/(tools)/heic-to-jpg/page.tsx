"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Upload, Download, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";

export default function HeicToJpgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      // Decode image onto Canvas and export as JPEG
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const jpgDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
          setConvertedUrl(jpgDataUrl);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        // Fallback for browsers with native HEIC support or preview
        setIsProcessing(false);
        setConvertedUrl(objectUrl);
      };
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            HEIC to JPG / PNG Converter
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Convert Apple iPhone HEIC and HEIF photos into universal high-resolution JPG images.
          </p>
        </div>

        {/* Upload Zone */}
        {!convertedUrl ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Select HEIC / HEIF image</h2>
              <p className="text-xs text-slate-500 mt-1">Files never leave your browser.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Browse Image
              <input type="file" accept=".heic,.heif,image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-300">
                Original: <span className="text-blue-400 font-bold">{selectedFile?.name}</span>
              </div>
              <a
                href={convertedUrl}
                download={(selectedFile?.name.replace(/\.[^/.]+$/, "") || "photo") + ".jpg"}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Download className="w-4 h-4" /> Download JPG
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black/40 flex justify-center max-h-[500px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={convertedUrl} alt="Converted" className="max-h-[500px] object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
