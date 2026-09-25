"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Palette, Copy, Check, Sparkles } from "lucide-react";

export default function ColorCodeConverter() {
  const [hex, setHex] = useState("#6366F1");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Conversions
  const hexToRgb = (h: string) => {
    const clean = h.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(hex);

  // RGB to HSL
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const { h, s, l } = rgbToHsl(r, g, b);

  // RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const cmyk = rgbToCmyk(r, g, b);

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, 1)` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: "CMYK", value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: "CSS Variable", value: `--color: ${hex.toLowerCase()};` }
  ];

  const handleCopy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Converters & Dev</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <Sparkles className="size-3" />
          Multi-Model Color Engine
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Palette className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Color Code Converter</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Convert color codes between HEX, RGB, HSL, CMYK, and CSS formats with live visual color previews.
            </p>
          </div>
        </div>
      </div>

      {/* Input & Swatch Preview */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="size-32 rounded-3xl shadow-2xl border-2 border-white/20 transition-all shrink-0 hover:scale-105"
            style={{ backgroundColor: hex }}
          />

          <div className="space-y-3 w-full">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select or Enter Color (HEX)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="size-12 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800 font-mono text-xs">
          {formats.map((fmt) => (
            <div
              key={fmt.label}
              className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between group hover:border-slate-700 transition"
            >
              <div>
                <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider block">
                  {fmt.label}
                </span>
                <span className="text-sm font-semibold text-slate-200">{fmt.value}</span>
              </div>
              <button
                onClick={() => handleCopy(fmt.value, fmt.label)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
              >
                {copiedKey === fmt.label ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
