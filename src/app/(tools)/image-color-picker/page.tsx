"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Pipette, Copy, Check, Upload, Sparkles } from "lucide-react";

export default function ImageColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string; hsl: string }>({
    hex: "#6366F1",
    rgb: "rgb(99, 102, 241)",
    hsl: "hsl(239, 84%, 67%)"
  });
  const [paletteHistory, setPaletteHistory] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    const rgbStr = `rgb(${r}, ${g}, ${b})`;
    const hslStr = rgbToHsl(r, g, b);

    setPickedColor({ hex, rgb: rgbStr, hsl: hslStr });
    setPaletteHistory((prev) => Array.from(new Set([hex, ...prev])).slice(0, 10));
  };

  const handleCopy = async (val: string, field: string) => {
    await navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
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
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Image Studio</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
          <Sparkles className="size-3" />
          Pixel-Accurate Eyedropper
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Pipette className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Image Color Picker</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Upload any picture and click anywhere on the image to inspect and copy exact HEX, RGB, and HSL color values.
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
            <h3 className="text-base font-bold text-white">Select or drop an image</h3>
            <p className="text-xs text-slate-400">Click pixels to sample color swatches</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Canvas Viewport */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[400px]">
            <span className="text-xs text-slate-500 mb-2 font-medium">Click on any pixel to inspect color</span>
            <div className="relative overflow-auto max-h-[500px] w-full flex justify-center">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-w-full h-auto cursor-crosshair rounded-xl border border-slate-800 shadow-xl"
              />
            </div>
          </div>

          {/* Color Values Inspector */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="size-16 rounded-2xl shadow-xl border border-white/20 transition-colors"
                  style={{ backgroundColor: pickedColor.hex }}
                />
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Sampled Color</span>
                  <span className="text-xl font-black text-white font-mono">{pickedColor.hex}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 font-mono text-xs">
                {[
                  { label: "HEX", val: pickedColor.hex },
                  { label: "RGB", val: pickedColor.rgb },
                  { label: "HSL", val: pickedColor.hsl }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-sans font-bold">{item.label}</span>
                    <span className="text-slate-200">{item.val}</span>
                    <button
                      onClick={() => handleCopy(item.val, item.label)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {copiedField === item.label ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Palette History */}
            {paletteHistory.length > 0 && (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Sampled Swatches ({paletteHistory.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {paletteHistory.map((hex, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopy(hex, `hist-${i}`)}
                      title={`Copy ${hex}`}
                      className="size-9 rounded-xl border border-white/10 cursor-pointer shadow hover:scale-110 active:scale-95 transition"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
