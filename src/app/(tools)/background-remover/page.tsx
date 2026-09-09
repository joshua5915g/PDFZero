"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Scissors, Upload, Download, Sparkles, RefreshCw } from "lucide-react";

export default function BackgroundRemoverPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState<number>(30);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    removeBg(url, tolerance);
  };

  const removeBg = (src: string, tol: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample corner pixel as background color
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );

        if (dist < tol * 3) {
          data[i + 3] = 0; // set transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedUrl(canvas.toDataURL("image/png"));
      setIsProcessing(false);
    };
    img.src = src;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Scissors className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Background Remover (100% Client-Side)
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Isolate subjects and erase backgrounds into transparent PNGs with no server uploads.
          </p>
        </div>

        {!imageSrc ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload image for background removal</h2>
              <p className="text-xs text-slate-500 mt-1">Works best with solid or distinct backgrounds.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Browse Image
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Sensitivity: {tolerance}%
                </span>
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={tolerance}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTolerance(val);
                    if (imageSrc) removeBg(imageSrc, val);
                  }}
                  className="accent-blue-500 w-32"
                />
              </div>

              {processedUrl && (
                <a
                  href={processedUrl}
                  download="transparent_subject.png"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Download className="w-4 h-4" /> Download Transparent PNG
                </a>
              )}
            </div>

            {/* Checkerboard Preview */}
            <div className="p-8 rounded-3xl bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-slate-950 border-4 border-slate-800/80 shadow-2xl flex items-center justify-center min-h-[400px]">
              {processedUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={processedUrl}
                  alt="Transparent Cutout"
                  className="max-h-[500px] object-contain drop-shadow-2xl"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
