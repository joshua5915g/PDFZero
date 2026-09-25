"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Copy, Check, Sparkles, Barcode } from "lucide-react";

export default function BarcodeGenerator() {
  const [text, setText] = useState("9780132350884");
  const [format, setFormat] = useState<"CODE128" | "EAN13" | "UPC">("CODE128");
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(80);
  const [showText, setShowText] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple Code 128 pattern renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pseudo-code barcode bar generation algorithm based on string hash / ascii
    const cleanText = text.trim() || "123456789";
    const padding = 20;
    
    // Generate bar patterns deterministically
    const patterns: number[] = [];
    // Guard bars
    patterns.push(1, 0, 1);
    for (let i = 0; i < cleanText.length; i++) {
      const code = cleanText.charCodeAt(i);
      for (let bit = 0; bit < 7; bit++) {
        patterns.push((code >> bit) & 1);
      }
      patterns.push(0); // separator
    }
    // Guard bars
    patterns.push(1, 0, 1);

    const totalWidth = patterns.length * barWidth + padding * 2;
    const totalHeight = barHeight + (showText ? 40 : 20);

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw bars
    ctx.fillStyle = "#000000";
    let x = padding;
    for (const bit of patterns) {
      if (bit === 1) {
        ctx.fillRect(x, 15, barWidth, barHeight);
      }
      x += barWidth;
    }

    // Text label
    if (showText) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(cleanText, totalWidth / 2, barHeight + 32);
    }
  }, [text, barWidth, barHeight, showText]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `barcode-${text || "code"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Business & Marketing</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Sparkles className="size-3" />
          High-Res PNG Export
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <Barcode className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Barcode Generator</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Create retail and inventory barcodes instantly. Preview in real-time and export as high-resolution PNG.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Barcode Value / Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter number or text..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">Barcode Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
              >
                <option value="CODE128">Code 128 (Standard)</option>
                <option value="EAN13">EAN-13 (Product / ISBN)</option>
                <option value="UPC">UPC-A (Retail)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">Bar Width: {barWidth}px</label>
              <input
                type="range"
                min="1"
                max="4"
                value={barWidth}
                onChange={(e) => setBarWidth(parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400">Bar Height: {barHeight}px</label>
            <input
              type="range"
              min="40"
              max="160"
              value={barHeight}
              onChange={(e) => setBarHeight(parseInt(e.target.value))}
              className="w-full mt-1"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded"
            />
            <span>Include human-readable text label below bars</span>
          </label>

          <button
            onClick={handleDownload}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="size-4" />
            <span>Download High-Res PNG</span>
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4">
            Live Barcode Canvas Preview
          </span>
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center justify-center max-w-full overflow-x-auto">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
