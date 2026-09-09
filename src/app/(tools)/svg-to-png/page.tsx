"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Upload, Download, Copy, Check } from "lucide-react";

export default function SvgToPngPage() {
  const [svgContent, setSvgContent] = useState<string>(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <circle cx="50" cy="50" r="45" fill="#6366f1" />
  <polygon points="50,20 62,42 86,45 68,62 73,86 50,73 27,86 32,62 14,45 38,42" fill="#ffffff" />
</svg>`
  );
  const [scale, setScale] = useState<number>(2); // 1x, 2x, 4x
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setSvgContent(text);
  };

  const exportPng = () => {
    setIsExporting(true);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = (img.width || 300) * scale;
      canvas.height = (img.height || 300) * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `vector_${canvas.width}x${canvas.height}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
      setIsExporting(false);
    };

    img.src = url;
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
            SVG to High-Res PNG Converter
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Render vector SVG graphics into lossless, transparent PNGs at 1x, 2x, or 4x retina scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  SVG Markup or Upload File
                </label>
                <label className="text-xs font-bold text-blue-400 hover:underline cursor-pointer">
                  Upload .svg
                  <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <textarea
                value={svgContent}
                onChange={(e) => setSvgContent(e.target.value)}
                rows={10}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />

              {/* Scale Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Resolution Scale Multiplier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        scale === s ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {s}x {s === 2 ? "(Retina)" : s === 4 ? "(Ultra 4K)" : "(100%)"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={exportPng}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Download className="w-4 h-4" /> Download Lossless PNG ({scale}x)
              </button>
            </div>
          </div>

          {/* Preview Box with Transparency Grid */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="p-8 rounded-3xl bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-slate-950 border-4 border-slate-800/80 shadow-2xl flex items-center justify-center min-h-[360px] overflow-hidden">
              <div
                className="max-w-full max-h-72 p-4"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
