"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Download, Upload, Sparkles, CheckCircle } from "lucide-react";

export default function FormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/webp");
  const [quality, setQuality] = useState(85);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    transcode(url, targetFormat, quality, selectedFile);
  };

  const transcode = (url: string, format: string, q: number, sourceFile?: File | null) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill white background if converting transparent to JPEG
      if (format === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedSize(blob.size);
            const resUrl = URL.createObjectURL(blob);
            setConvertedUrl(resUrl);
          }
        },
        format,
        q / 100
      );
    };
  };

  const handleFormatChange = (fmt: "image/jpeg" | "image/png" | "image/webp") => {
    setTargetFormat(fmt);
    if (previewUrl) {
      transcode(previewUrl, fmt, quality, file);
    }
  };

  const getExtension = () => {
    switch (targetFormat) {
      case "image/jpeg": return "jpg";
      case "image/png": return "png";
      case "image/webp": return "webp";
    }
  };

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
          WebP • JPG • PNG Transcoding
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <RefreshCw className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Image Format Converter</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Convert between WebP, PNG, JPG, and AVIF image formats client-side without data loss.
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
            <h3 className="text-base font-bold text-white">Select or drop an image to convert</h3>
            <p className="text-xs text-slate-400">Convert WebP, PNG, JPG, and more</p>
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
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">Convert to:</span>
                <div className="flex gap-2">
                  {[
                    { id: "image/webp", label: "WebP" },
                    { id: "image/png", label: "PNG" },
                    { id: "image/jpeg", label: "JPG" }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => handleFormatChange(fmt.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        targetFormat === fmt.id
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : "bg-slate-950 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {convertedUrl && (
                <a
                  href={convertedUrl}
                  download={`${file.name.replace(/\.[^/.]+$/, "")}.${getExtension()}`}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <Download className="size-4" />
                  <span>Download as .{getExtension().toUpperCase()}</span>
                </a>
              )}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[350px]">
            {convertedUrl && (
              <img
                src={convertedUrl}
                alt="Converted Preview"
                className="max-h-[400px] w-auto object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
