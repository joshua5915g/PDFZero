"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Copy, Check, RefreshCw } from "lucide-react";

interface MeshPoint {
  color: string;
  x: number;
  y: number;
  size: number;
}

const PRESETS: { name: string; points: MeshPoint[] }[] = [
  {
    name: "Cosmic Violet",
    points: [
      { color: "#7928ca", x: 20, y: 30, size: 70 },
      { color: "#ff0080", x: 80, y: 20, size: 60 },
      { color: "#0070f3", x: 70, y: 80, size: 65 },
      { color: "#00dfd8", x: 15, y: 85, size: 55 }
    ]
  },
  {
    name: "Sunset Cyber",
    points: [
      { color: "#ff4b1f", x: 25, y: 25, size: 75 },
      { color: "#ff9068", x: 85, y: 30, size: 65 },
      { color: "#833ab4", x: 30, y: 80, size: 70 },
      { color: "#fd1d1d", x: 75, y: 85, size: 60 }
    ]
  },
  {
    name: "Emerald Aurora",
    points: [
      { color: "#059669", x: 20, y: 20, size: 70 },
      { color: "#10b981", x: 80, y: 30, size: 60 },
      { color: "#06b6d4", x: 70, y: 75, size: 65 },
      { color: "#3b82f6", x: 15, y: 80, size: 60 }
    ]
  }
];

export default function MeshGradientGenerator() {
  const [points, setPoints] = useState<MeshPoint[]>(PRESETS[0].points);
  const [copied, setCopied] = useState(false);

  // Generate CSS radial-gradient mesh
  const cssBackground = points
    .map(
      (p) =>
        `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`
    )
    .join(", ");

  const cssCode = `background-color: #0f172a;\nbackground-image: \n  ${points
    .map((p) => `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
    .join(",\n  ")};`;

  const copyCss = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => {
    const randomHex = () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    setPoints([
      { color: randomHex(), x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50), size: 65 },
      { color: randomHex(), x: Math.floor(Math.random() * 50) + 50, y: Math.floor(Math.random() * 50), size: 65 },
      { color: randomHex(), x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50) + 50, size: 65 },
      { color: randomHex(), x: Math.floor(Math.random() * 50) + 50, y: Math.floor(Math.random() * 50) + 50, size: 65 }
    ]);
  };

  const updatePoint = (idx: number, field: keyof MeshPoint, val: any) => {
    const copy = [...points];
    copy[idx] = { ...copy[idx], [field]: val };
    setPoints(copy);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Design & Web Fun
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Mesh Gradient Generator
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Craft trendy, multi-colored fluid CSS mesh gradients for hero banners and card backdrops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Presets & Shuffle</span>
                <button
                  onClick={randomize}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-pink-600/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Randomize Colors
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPoints(p.points)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-pink-500 text-xs text-slate-300 font-semibold transition-all"
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Color points editor */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Gradient Nodes (4 Points)</div>
                {points.map((pt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                    <input
                      type="color"
                      value={pt.color}
                      onChange={(e) => updatePoint(i, "color", e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">X: {pt.x}%</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={pt.x}
                          onChange={(e) => updatePoint(i, "x", Number(e.target.value))}
                          className="w-full accent-pink-500"
                        />
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Y: {pt.y}%</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={pt.y}
                          onChange={(e) => updatePoint(i, "y", Number(e.target.value))}
                          className="w-full accent-pink-500"
                        />
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Spread: {pt.size}%</span>
                        <input
                          type="range"
                          min={20}
                          max={90}
                          value={pt.size}
                          onChange={(e) => updatePoint(i, "size", Number(e.target.value))}
                          className="w-full accent-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Output */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Code</span>
                <button
                  onClick={copyCss}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-pink-600/20"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied CSS!" : "Copy CSS"}
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={cssCode}
                aria-label="Generated CSS Code"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div
              style={{
                backgroundColor: "#0f172a",
                backgroundImage: cssBackground
              }}
              className="w-full aspect-square rounded-3xl border-4 border-slate-800/80 shadow-2xl flex items-center justify-center p-8 transition-all duration-300"
            >
              <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-center max-w-sm space-y-2">
                <h3 className="text-xl font-bold text-white">Interactive Preview</h3>
                <p className="text-xs text-slate-300">
                  Pure client-side CSS. No external image assets or heavy canvas renders required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
