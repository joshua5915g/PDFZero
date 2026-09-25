"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Minimize2, Download, Upload, Sparkles, CheckCircle } from "lucide-react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(75);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const compressImage = () => {
    if (!previewUrl || !file) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Determine output mime
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      const q = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const compUrl = URL.createObjectURL(blob);
            setCompressedUrl(compUrl);
          }
          setIsProcessing(false);
        },
        mime,
        q
      );
    };
  };

  useEffect(() => {
    if (previewUrl) {
      compressImage();
    }
  }, [previewUrl, quality]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const percentSaved = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Image Studio</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
          <Sparkles className="size-3" />
          Client-Side In-Memory
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Minimize2 className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Image Compressor</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Shrink JPG, PNG, and WebP images client-side without quality degradation or server uploads.
            </p>
          </div>
        </div>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-900/30 rounded-3xl p-12 text-center transition flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
            <Upload className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Select or drop an image to compress</h3>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WebP up to 50MB</p>
          </div>
          <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-blue-500/20">
            Browse Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls & Comparison Cards */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Compression Quality: {quality}%</span>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-64 block"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-xs">
                  <span className="text-slate-500 block">Original: {formatBytes(originalSize)}</span>
                  <span className="text-white font-bold block">Compressed: {formatBytes(compressedSize)}</span>
                </div>

                {percentSaved > 0 && (
                  <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded-xl text-xs flex items-center gap-1">
                    <CheckCircle className="size-3.5" /> -{percentSaved}% Saved
                  </span>
                )}

                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`compressed-${file.name}`}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
                  >
                    <Download className="size-4" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Side by side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Original Image</span>
              {previewUrl && (
                <div className="max-h-[360px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/60 p-2">
                  <img src={previewUrl} alt="Original" className="max-h-[340px] w-auto object-contain rounded-lg" />
                </div>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Compressed Result</span>
              {compressedUrl && (
                <div className="max-h-[360px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/60 p-2">
                  <img src={compressedUrl} alt="Compressed" className="max-h-[340px] w-auto object-contain rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
