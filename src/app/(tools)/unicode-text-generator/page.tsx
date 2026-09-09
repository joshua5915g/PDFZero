"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wand2, Copy, Check, Sparkles } from "lucide-react";

export default function UnicodeTextGenerator() {
  const [text, setText] = useState("Fancy Social Font");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Character mapping transformations
  const transform = (input: string, baseA: number, basea: number, base0?: number) => {
    return input.split("").map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(baseA + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(basea + (code - 97));
      if (base0 && code >= 48 && code <= 57) return String.fromCodePoint(base0 + (code - 48));
      return c;
    }).join("");
  };

  const fonts = [
    { name: "Bold Sans", text: transform(text, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
    { name: "Italic Serif", text: transform(text, 0x1d434, 0x1d44e) },
    { name: "Bold Italic", text: transform(text, 0x1d63c, 0x1d656) },
    { name: "Double-Struck / Blackboard", text: transform(text, 0x1d538, 0x1d552, 0x1d7d8) },
    { name: "Fraktur / Gothic", text: transform(text, 0x1d504, 0x1d51e) },
    { name: "Bold Fraktur", text: transform(text, 0x1d56c, 0x1d586) },
    { name: "Monospace / Code", text: transform(text, 0x1d670, 0x1d68a, 0x1d7f6) },
    {
      name: "Circled",
      text: text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + (code - 97));
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
        return c;
      }).join("")
    },
    {
      name: "Squared / Boxed",
      text: text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1f130 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1f130 + (code - 97));
        return c;
      }).join("")
    }
  ];

  const handleCopy = async (val: string, idx: number) => {
    await navigator.clipboard.writeText(val);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
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
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Converters & Dev</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <Sparkles className="size-3" />
          Instagram & Twitter Compatible
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Wand2 className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Unicode Fancy Font Generator</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Transform plain text into stylish bold, script, gothic, and circled Unicode fonts ready for social media bios.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Type Your Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to style..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-base focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Font Variants List */}
      <div className="space-y-3">
        {fonts.map((f, i) => (
          <div
            key={f.name}
            className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-700 transition"
          >
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{f.name}</span>
              <p className="text-base text-white truncate font-medium">{f.text}</p>
            </div>

            <button
              onClick={() => handleCopy(f.text, i)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              {copiedIndex === i ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span>{copiedIndex === i ? "Copied" : "Copy"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
