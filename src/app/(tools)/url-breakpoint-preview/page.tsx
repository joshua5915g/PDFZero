"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Tablet, Monitor, RotateCcw, ExternalLink, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: "phone" | "tablet" | "desktop";
}

const PRESETS: DevicePreset[] = [
  { name: "iPhone SE", width: 375, height: 667, icon: "phone" },
  { name: "iPhone 14/15 Pro", width: 393, height: 852, icon: "phone" },
  { name: "iPad Mini", width: 768, height: 1024, icon: "tablet" },
  { name: "iPad Pro", width: 1024, height: 1366, icon: "tablet" },
  { name: "Laptop (HD)", width: 1280, height: 800, icon: "desktop" },
  { name: "Desktop (FHD)", width: 1440, height: 900, icon: "desktop" }
];

export default function UrlBreakpointPreviewPage() {
  const [url, setUrl] = useState<string>("https://example.com");
  const [currentWidth, setCurrentWidth] = useState<number>(393);
  const [currentHeight, setCurrentHeight] = useState<number>(852);
  const [scale, setScale] = useState<number>(0.85);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);

  const displayW = isRotated ? currentHeight : currentWidth;
  const displayH = isRotated ? currentWidth : currentHeight;

  const handlePreset = (p: DevicePreset) => {
    setCurrentWidth(p.width);
    setCurrentHeight(p.height);
    setIsRotated(false);
  };

  const reloadIframe = () => setIframeKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 flex flex-col">
      <div className="max-w-6xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            Converters & Dev
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Responsive Breakpoint Previewer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Test websites across live mobile, tablet, and desktop viewports simultaneously.
          </p>
        </div>

        {/* Control Header */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[280px]">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              onClick={reloadIframe}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Reload Frame"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Open Target in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Preset Buttons & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESETS.map((p) => {
                const active = currentWidth === p.width && currentHeight === p.height && !isRotated;
                return (
                  <button
                    key={p.name}
                    onClick={() => handlePreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      active
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
                    }`}
                  >
                    {p.icon === "phone" && <Smartphone className="w-3 h-3" />}
                    {p.icon === "tablet" && <Tablet className="w-3 h-3" />}
                    {p.icon === "desktop" && <Monitor className="w-3 h-3" />}
                    {p.name} ({p.width}px)
                  </button>
                );
              })}
            </div>

            {/* Rotation & Zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotated(!isRotated)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1"
                title="Rotate Orientation"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {isRotated ? "Landscape" : "Portrait"}
              </button>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                  className="p-1 hover:text-white text-slate-400"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="font-mono text-slate-300 w-10 text-center">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale((s) => Math.min(1.2, Number((s + 0.1).toFixed(2))))}
                  className="p-1 hover:text-white text-slate-400"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Viewport Dimensions Bar */}
        <div className="text-center text-xs font-mono text-slate-400">
          Simulated Resolution: <span className="text-emerald-400 font-bold">{displayW}px</span> × <span className="text-emerald-400 font-bold">{displayH}px</span> (Scale: {Math.round(scale * 100)}%)
        </div>

        {/* Simulated Browser Device Mockup */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-4 bg-slate-950/60 rounded-3xl border border-slate-900">
          <div
            style={{
              width: `${displayW}px`,
              height: `${displayH}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top center"
            }}
            className="rounded-2xl border-4 border-slate-700/80 shadow-2xl bg-white overflow-hidden flex flex-col transition-all duration-200"
          >
            {/* Mock browser header */}
            <div className="bg-slate-900 px-3 py-2 flex items-center gap-2 border-b border-slate-800 select-none">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 bg-slate-950 rounded-md px-2 py-0.5 text-[11px] text-slate-400 font-mono truncate text-center">
                {url}
              </div>
            </div>
            <iframe
              key={iframeKey}
              src={url}
              title="Responsive Breakpoint Preview"
              className="w-full flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
