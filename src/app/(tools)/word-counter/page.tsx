"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, Copy, Check } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState(
    "Welcome to PDFZero! This online suite gives you all 160 essential web tools completely free. No signup, no watermarks, and zero server uploads. Your privacy is 100% protected."
  );
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        topKeywords: []
      };
    }

    const wordsArray = trimmed.match(/\b\w+\b/g) || [];
    const wordCount = wordsArray.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = (trimmed.match(/[.!?]+(?:\s|$)/g) || []).length || 1;
    const paragraphs = trimmed.split(/\n+/).filter(Boolean).length;

    // Reading time at 200 wpm
    const readingMins = (wordCount / 200).toFixed(1);
    // Speaking time at 130 wpm
    const speakingMins = (wordCount / 130).toFixed(1);

    // Keyword density
    const freqMap: Record<string, number> = {};
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "of", "to", "is", "it", "this", "that", "you", "your", "for", "with"]);
    wordsArray.forEach((w) => {
      const lower = w.toLowerCase();
      if (lower.length > 2 && !stopWords.has(lower)) {
        freqMap[lower] = (freqMap[lower] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / wordCount) * 100).toFixed(1)
      }));

    return {
      words: wordCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes: readingMins,
      speakingTimeMinutes: speakingMins,
      topKeywords
    };
  }, [text]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-purple-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Calculators & Units</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <Sparkles className="size-3" />
          Real-Time Metrics
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
            <FileText className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Word & Character Counter</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Calculate exact words, characters, sentences, paragraphs, reading speed, and keyword density.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-purple-500/30 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Total Words</span>
          <div className="text-3xl font-black text-white mt-1">{stats.words}</div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Characters</span>
          <div className="text-3xl font-black text-slate-200 mt-1">{stats.charsWithSpaces}</div>
          <span className="text-[10px] text-slate-500">{stats.charsNoSpaces} without spaces</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reading Time</span>
          <div className="text-3xl font-black text-slate-200 mt-1">{stats.readingTimeMinutes} <span className="text-xs font-normal">mins</span></div>
          <span className="text-[10px] text-slate-500">at 200 WPM</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sentences</span>
          <div className="text-3xl font-black text-slate-200 mt-1">{stats.sentences}</div>
          <span className="text-[10px] text-slate-500">{stats.paragraphs} paragraphs</span>
        </div>
      </div>

      {/* Text Area */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold">Live Text Editor</span>
          <div className="flex gap-2">
            <button
              onClick={() => setText("")}
              className="text-slate-500 hover:text-red-400 transition"
            >
              Clear
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste content here..."
          className="w-full p-5 bg-transparent text-slate-200 text-sm font-sans resize-y focus:outline-none leading-relaxed"
        />
      </div>

      {/* Top Keywords Density */}
      {stats.topKeywords.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Keyword Frequency & Density
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {stats.topKeywords.map((kw, i) => (
              <div key={i} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex justify-between items-center">
                <span className="font-bold text-slate-200">{kw.word}</span>
                <span className="text-slate-400 font-mono text-[11px]">{kw.count}x ({kw.percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
