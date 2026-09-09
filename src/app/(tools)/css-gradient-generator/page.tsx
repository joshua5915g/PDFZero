"use client";

import React, { useState } from "react";
import DesignStudioLayout from "@/components/tools/DesignStudioLayout";
import { Shuffle } from "lucide-react";

export default function CssGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState("#6366F1");
  const [color2, setColor2] = useState("#EC4899");
  const [stop1, setStop1] = useState(0);
  const [stop2, setStop2] = useState(100);

  let css = "";
  let tailwind = "";

  if (type === "linear") {
    css = `background: linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
    tailwind = `bg-gradient-to-r from-[${color1}] to-[${color2}]`;
  } else if (type === "radial") {
    css = `background: radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
    tailwind = `bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[${color1}] to-[${color2}]`;
  } else {
    css = `background: conic-gradient(from ${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
    tailwind = `bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-[${color1}] to-[${color2}]`;
  }

  const randomize = () => {
    const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColor1(randomHex());
    setColor2(randomHex());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <DesignStudioLayout
      title="CSS Gradient Generator"
      description="Create beautiful linear, radial, and conic CSS gradients with real-time preview and one-click CSS and Tailwind copy."
      iconName="Palette"
      category="Design & Web Fun"
      cssCode={css}
      tailwindCode={tailwind}
      tips={[
        "Linear gradients create sleek diagonal transitions, ideal for buttons and cards.",
        "Radial gradients create soft focus center highlights for hero backgrounds.",
        "Copy either pure Vanilla CSS syntax or Tailwind CSS arbitrary value classes."
      ]}
      controls={
        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Gradient Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["linear", "radial", "conic"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition ${
                    type === t ? "bg-pink-500/20 text-pink-300 border border-pink-500/40" : "bg-slate-950 text-slate-400 border border-slate-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {type !== "radial" && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-400">Angle: {angle}°</label>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Color 1: {color1}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Color 2: {color2}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={randomize}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            <Shuffle className="size-4" />
            <span>Randomize Palette</span>
          </button>
        </div>
      }
      preview={
        <div
          className="w-full h-64 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center"
          style={{
            background:
              type === "linear"
                ? `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`
                : type === "radial"
                ? `radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%)`
                : `conic-gradient(from ${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`
          }}
        >
          <div className="px-5 py-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-xs font-bold shadow-lg border border-white/20">
            Gradient Live Canvas
          </div>
        </div>
      }
    />
  );
}
