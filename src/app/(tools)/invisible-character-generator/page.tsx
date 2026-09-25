"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ghost, Copy, Check, Sparkles } from "lucide-react";

export default function InvisibleCharacterGenerator() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testText, setTestText] = useState("");

  const characters = [
    {
      name: "Zero-Width Space (ZWSP)",
      code: "U+200B",
      char: "\u200B",
      desc: "Invisible character with zero width. Perfect for line-breaking without spaces."
    },
    {
      name: "Hangul Filler (Empty Name)",
      code: "U+3164",
      char: "\u3164",
      desc: "Completely blank whitespace character. Frequently used for blank names on Discord and Steam."
    },
    {
      name: "Zero-Width Non-Joiner (ZWNJ)",
      code: "U+200C",
      char: "\u200C",
      desc: "Prevents ligatures between adjacent characters in complex scripts."
    },
    {
      name: "Zero-Width Joiner (ZWJ)",
      code: "U+200D",
      char: "\u200D",
      desc: "Joins multiple emojis together (e.g. skin tone + profession combos)."
    },
    {
      name: "Word Joiner",
      code: "U+2060",
      char: "\u2060",
      desc: "Zero-width character preventing automatic line wrapping."
    }
  ];

  const handleCopy = async (char: string, key: string) => {
    await navigator.clipboard.writeText(char);
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
          One-Click Clipboard Copy
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Ghost className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Invisible Character Generator</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Copy invisible unicode characters, zero-width spaces, and blank name fillers for Discord, Steam, and web forms.
            </p>
          </div>
        </div>
      </div>

      {/* Characters List */}
      <div className="space-y-3">
        {characters.map((item) => (
          <div
            key={item.code}
            className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{item.name}</span>
                <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 text-[10px] font-mono rounded">
                  {item.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{item.desc}</p>
            </div>

            <button
              onClick={() => handleCopy(item.char, item.code)}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {copiedKey === item.code ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy Invisible Character</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Test Area */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Paste & Test Clipboard Sandbox
        </label>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Paste here to test your invisible character..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono focus:outline-none"
        />
        <div className="text-[11px] text-slate-500 flex justify-between">
          <span>Character length: {testText.length} characters</span>
          {testText.length > 0 && <button onClick={() => setTestText("")} className="hover:text-red-400">Clear</button>}
        </div>
      </div>
    </div>
  );
}
