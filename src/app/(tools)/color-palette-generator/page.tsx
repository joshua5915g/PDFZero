"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Palette, Lock, Unlock, RefreshCw, Copy, Check } from "lucide-react";

interface PaletteColor {
  hex: string;
  locked: boolean;
}

export default function ColorPaletteGeneratorPage() {
  const [colors, setColors] = useState<PaletteColor[]>([
    { hex: "#2b2d42", locked: false },
    { hex: "#8d99ae", locked: false },
    { hex: "#edf2f4", locked: false },
    { hex: "#ef233c", locked: false },
    { hex: "#d90429", locked: false }
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const randomHex = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  const generate = () => {
    setColors(colors.map((c) => (c.locked ? c : { ...c, hex: randomHex() })));
  };

  const toggleLock = (idx: number) => {
    const next = [...colors];
    next[idx].locked = !next[idx].locked;
    setColors(next);
  };

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex.toUpperCase());
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  // Keyboard shortcut: Spacebar to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3">
              <Palette className="w-3.5 h-3.5" />
              Design & Web Fun
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Color Palette Generator
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Generate curated color schemes. Press <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-white">Space</kbd> or click Generate to shuffle!
            </p>
          </div>

          <button
            onClick={generate}
            className="px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-pink-600/20"
          >
            <RefreshCw className="w-4 h-4" /> Generate Palette
          </button>
        </div>

        {/* 5 Full Color Swatch Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-5 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[420px]">
          {colors.map((c, i) => (
            <div
              key={i}
              style={{ backgroundColor: c.hex }}
              className="flex flex-col justify-between p-6 transition-colors duration-300 min-h-[200px]"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => toggleLock(i)}
                  className="p-2.5 rounded-xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-colors"
                  title={c.locked ? "Color Locked" : "Click to Lock Color"}
                >
                  {c.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 opacity-70" />}
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => copyColor(c.hex)}
                  className="w-full py-2 px-3 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-mono font-bold text-sm flex items-center justify-between gap-1 transition-all"
                >
                  <span>{c.hex.toUpperCase()}</span>
                  {copiedHex === c.hex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
