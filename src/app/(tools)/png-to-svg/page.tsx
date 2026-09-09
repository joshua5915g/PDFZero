"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Upload, Download, Copy, Check } from "lucide-react";

export default function PngToSvgPage() {
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(128);
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 200;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Generate vector rect paths for dark pixels
        let paths = "";
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            const brightness = (r + g + b) / 3;

            if (a > 128 && brightness < threshold) {
              paths += `<rect x="${x}" y="${y}" width="1" height="1" fill="#3b82f6" />`;
            }
          }
        }

        const generatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width * 2}" height="${canvas.height * 2}">\n${paths}\n</svg>`;
        setSvgOutput(generatedSvg);
        setIsProcessing(false);
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copySvg = async () => {
    if (!svgOutput) return;
    await navigator.clipboard.writeText(svgOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (fileName ? fileName.replace(/\.[^/.]+$/, "") : "vector") + ".svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <Sparkles className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            PNG to SVG Vectorizer
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Vectorize raster PNG and JPG images into scalable XML vector SVG paths directly in the browser.
          </p>
        </div>

        {!svgOutput ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Select PNG / JPG Logo or Icon</h2>
              <p className="text-xs text-slate-500 mt-1">High-contrast graphics produce best vectorization results.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Browse Image
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vector SVG Markup</span>
                <div className="flex gap-2">
                  <button
                    onClick={copySvg}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy SVG"}
                  </button>
                  <button
                    onClick={downloadSvg}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 shadow-lg shadow-blue-600/20"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .svg
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={12}
                value={svgOutput}
                aria-label="Generated SVG Output"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div
                className="max-w-full max-h-80"
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
