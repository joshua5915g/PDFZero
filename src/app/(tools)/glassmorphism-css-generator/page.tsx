"use client";

import React, { useState } from "react";
import DesignStudioLayout from "@/components/tools/DesignStudioLayout";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(0.25);
  const [borderOpacity, setBorderOpacity] = useState(0.15);
  const [borderRadius, setBorderRadius] = useState(24);
  const [saturation, setSaturation] = useState(150);

  const css = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px) saturate(${saturation}%);\n-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);\nborder: 1px solid rgba(255, 255, 255, ${borderOpacity});\nborder-radius: ${borderRadius}px;`;

  const tailwind = `bg-white/[${opacity}] backdrop-blur-[${blur}px] border border-white/[${borderOpacity}] rounded-[${borderRadius}px]`;

  return (
    <DesignStudioLayout
      title="Glassmorphism CSS Generator"
      description="Create modern frosted glass UI cards with real-time blur, specular border, opacity, and saturation controls."
      iconName="Sparkles"
      category="Design & Web Fun"
      cssCode={css}
      tailwindCode={tailwind}
      tips={[
        "Frosted glass looks best when placed over colorful or high-contrast backgrounds.",
        "Add a subtle 1px white border with 10-20% opacity to simulate realistic glass bevel reflection.",
        "Increased saturation (120-180%) enhances the vibrancy of elements shining through the glass."
      ]}
      controls={
        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Backdrop Blur: {blur}px</label>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Surface Opacity: {Math.round(opacity * 100)}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Border Highlight: {Math.round(borderOpacity * 100)}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Border Radius: {borderRadius}px</label>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              value={borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Color Saturation: {saturation}%</label>
            </div>
            <input
              type="range"
              min="100"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      }
      preview={
        <div className="w-full h-80 relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
          {/* Vibrant colorful blobs behind the card */}
          <div className="absolute -left-4 top-4 size-36 rounded-full bg-pink-500 blur-xl animate-pulse" />
          <div className="absolute right-6 bottom-6 size-44 rounded-full bg-cyan-400 blur-2xl" />
          <div className="absolute top-1/2 left-1/3 size-32 rounded-full bg-amber-400 blur-xl" />

          {/* Glass Card */}
          <div
            className="w-full max-w-sm p-6 shadow-2xl relative z-10 transition-all duration-200"
            style={{
              background: `rgba(255, 255, 255, ${opacity})`,
              backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
              WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
              border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
              borderRadius: `${borderRadius}px`
            }}
          >
            <div className="size-8 rounded-xl bg-white/30 mb-3 flex items-center justify-center text-white font-black text-xs">
              ✦
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">Frosted Glass UI</h4>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Glassmorphism brings depth and modern tactile layering to modern web interfaces.
            </p>
          </div>
        </div>
      }
    />
  );
}
