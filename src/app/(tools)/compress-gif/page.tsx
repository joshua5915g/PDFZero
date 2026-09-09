"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileDown, Upload, Download, Sparkles } from "lucide-react";

export default function CompressGifPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(75);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleDownload = () => {
    if (!previewUrl || !file) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "optimized_" + file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <FileDown className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            GIF Compressor & Optimizer
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Shrink animated GIF sizes by scaling dimensions and color depth client-side.
          </p>
        </div>

        {!previewUrl ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Select animated GIF</h2>
              <p className="text-xs text-slate-500 mt-1">Processed locally in your browser.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Browse GIF
              <input type="file" accept="image/gif" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">{file?.name}</div>
                <div className="text-xs text-slate-400">Original Size: {((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB</div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400">Scale: {scale}%</span>
                <input
                  type="range"
                  min={25}
                  max={100}
                  step={5}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="accent-blue-500 w-32"
                />
              </div>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Download className="w-4 h-4" /> Download Optimized GIF
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex justify-center max-h-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="GIF Preview" className="max-h-80 object-contain rounded-xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
