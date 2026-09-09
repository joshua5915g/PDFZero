"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX, Download, Copy, Check, Sparkles } from "lucide-react";

export default function TypewriterPage() {
  const [text, setText] = useState("It was a dark and stormy night...\n\nThe keys clattered with mechanical satisfaction.");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontStyle, setFontStyle] = useState<"mono" | "serif" | "sans">("mono");
  const [copied, setCopied] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthetic mechanical typewriter click using Web Audio API
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      // random pitch jitter for realistic key variance
      osc.frequency.setValueAtTime(300 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Control" && e.key !== "Alt" && e.key !== "Shift") {
      playClickSound();
    }
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Design & Web Fun
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Typewriter Simulator
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              Distraction-free vintage writing room with procedural mechanical key audio clicks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                soundEnabled ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {soundEnabled ? "Mechanical Audio ON" : "Audio Muted"}
            </button>
            <button
              onClick={copyText}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="bg-[#f7f4ea] text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-amber-900/10 relative overflow-hidden min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-4 mb-4 text-xs font-mono text-slate-500">
            <div>WORDS: {wordCount} | CHARACTERS: {charCount}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setFontStyle("mono")}
                className={`px-2 py-0.5 rounded font-mono ${fontStyle === "mono" ? "bg-amber-200 text-slate-900 font-bold" : "text-slate-600"}`}
              >
                Courier
              </button>
              <button
                onClick={() => setFontStyle("serif")}
                className={`px-2 py-0.5 rounded font-serif ${fontStyle === "serif" ? "bg-amber-200 text-slate-900 font-bold" : "text-slate-600"}`}
              >
                Bookman
              </button>
              <button
                onClick={() => setFontStyle("sans")}
                className={`px-2 py-0.5 rounded font-sans ${fontStyle === "sans" ? "bg-amber-200 text-slate-900 font-bold" : "text-slate-600"}`}
              >
                Sans
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={16}
            placeholder="Type away on your vintage mechanical keyboard..."
            className={`w-full flex-1 bg-transparent border-0 resize-none text-base sm:text-lg leading-relaxed text-slate-900 focus:outline-none placeholder-slate-400 ${
              fontStyle === "mono" ? "font-mono" : fontStyle === "serif" ? "font-serif" : "font-sans"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
