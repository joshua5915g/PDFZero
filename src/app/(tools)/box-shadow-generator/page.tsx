"use client";

import React, { useState } from "react";
import DesignStudioLayout from "@/components/tools/DesignStudioLayout";

export default function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(20);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [opacity, setOpacity] = useState(0.3);
  const [inset, setInset] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000");

  // Hex to RGBA
  const hexToRgb = (hex: string) => {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
  };

  const rgbaColor = `rgba(${hexToRgb(shadowColor)}, ${opacity})`;
  const shadowValue = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgbaColor}`;
  const css = `box-shadow: ${shadowValue};`;
  const tailwind = `shadow-[${shadowValue.replace(/\s+/g, "_")}]`;

  return (
    <DesignStudioLayout
      title="CSS Box Shadow Generator"
      description="Design multi-directional elevation, soft ambient drop shadows, and inset depths with live CSS export."
      iconName="Layers"
      category="Design & Web Fun"
      cssCode={css}
      tailwindCode={tailwind}
      tips={[
        "Negative spread (e.g. -5px) creates crisp, realistic diffused shadows without muddy edges.",
        "Use low opacity (0.1 to 0.3) for modern subtle floating card elevations.",
        "Enable Inset to create pressed, sunken, or inner cavity effects."
      ]}
      controls={
        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Horizontal Offset (X): {x}px</label>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={x}
              onChange={(e) => setX(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Vertical Offset (Y): {y}px</label>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={y}
              onChange={(e) => setY(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Blur Radius: {blur}px</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-400">Spread Radius: {spread}px</label>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              value={spread}
              onChange={(e) => setSpread(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Shadow Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-400">Opacity: {Math.round(opacity * 100)}%</label>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={inset}
              onChange={(e) => setInset(e.target.checked)}
              className="rounded"
            />
            <span>Inset Inner Shadow</span>
          </label>
        </div>
      }
      preview={
        <div className="w-full h-80 flex items-center justify-center bg-slate-900 rounded-2xl p-8">
          <div
            className="size-44 bg-slate-800 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700/60 transition-all duration-200"
            style={{
              boxShadow: shadowValue
            }}
          >
            Floating Element
          </div>
        </div>
      }
    />
  );
}
