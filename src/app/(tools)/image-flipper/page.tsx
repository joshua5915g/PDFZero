"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FlipHorizontal, FlipVertical, RotateCw, Download, Upload, Sparkles } from "lucide-react";

export default function ImageFlipper() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
  };

  const processImage = () => {
    if (!previewUrl) return;
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const isRotated90or270 = rotation % 180 !== 0;
      canvas.width = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
      canvas.height = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      setOutputUrl(canvas.toDataURL(file?.type || "image/png"));
    };
  };

  useEffect(() => {
    if (previewUrl) {
      processImage();
    }
  }, [previewUrl, flipH, flipV, rotation]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Image Studio</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
          <Sparkles className="size-3" />
          Instant Orientation
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <FlipHorizontal className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Image Flipper & Mirror</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Mirror images horizontally, flip upside down vertically, and rotate in 90-degree increments.
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
            <h3 className="text-base font-bold text-white">Select or drop an image to flip</h3>
            <p className="text-xs text-slate-400">Instant mirroring and rotation</p>
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
          {/* Action Bar */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  flipH
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <FlipHorizontal className="size-4" />
                <span>Flip Horizontal</span>
              </button>

              <button
                onClick={() => setFlipV(!flipV)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  flipV
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <FlipVertical className="size-4" />
                <span>Flip Vertical</span>
              </button>

              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-800"
              >
                <RotateCw className="size-4" />
                <span>Rotate 90°</span>
              </button>
            </div>

            {outputUrl && (
              <a
                href={outputUrl}
                download={`flipped-${file.name}`}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
              >
                <Download className="size-4" />
                <span>Download Result</span>
              </a>
            )}
          </div>

          {/* Canvas Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
            {outputUrl && (
              <img
                src={outputUrl}
                alt="Flipped Preview"
                className="max-h-[450px] w-auto object-contain rounded-xl shadow-2xl border border-slate-800/80"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
