"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize2, Download, Upload, Lock, Unlock, Sparkles } from "lucide-react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
    };
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspect && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const applyScale = (pct: number) => {
    if (originalDimensions.width > 0) {
      setTargetWidth(Math.round((originalDimensions.width * pct) / 100));
      setTargetHeight(Math.round((originalDimensions.height * pct) / 100));
    }
  };

  const renderResized = () => {
    if (!previewUrl || targetWidth <= 0 || targetHeight <= 0) return;
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      setResizedUrl(canvas.toDataURL(file?.type || "image/png"));
    };
  };

  useEffect(() => {
    if (previewUrl && targetWidth > 0 && targetHeight > 0) {
      renderResized();
    }
  }, [previewUrl, targetWidth, targetHeight]);

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
          Aspect-Ratio Locking
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Maximize2 className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Image Resizer</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Resize image pixel dimensions and aspect ratios instantly in your browser with high-quality bicubic resampling.
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
            <h3 className="text-base font-bold text-white">Select or drop an image to resize</h3>
            <p className="text-xs text-slate-400">Maintains exact pixel proportions</p>
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
          {/* Controls */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-28 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                  />
                </div>

                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  title={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  className={`mt-5 p-2.5 rounded-xl border transition ${
                    lockAspect
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  {lockAspect ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                </button>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-28 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Quick scale presets */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {[25, 50, 75, 100, 150].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => applyScale(pct)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {resizedUrl && (
                <a
                  href={resizedUrl}
                  download={`resized-${targetWidth}x${targetHeight}-${file.name}`}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <Download className="size-4" />
                  <span>Download Resized</span>
                </a>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[350px]">
            <span className="text-xs text-slate-500 mb-3">
              Target Dimensions: {targetWidth} × {targetHeight} px
            </span>
            {resizedUrl && (
              <img
                src={resizedUrl}
                alt="Resized Preview"
                className="max-h-[400px] w-auto object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
