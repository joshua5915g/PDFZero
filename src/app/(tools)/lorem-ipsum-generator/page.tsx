"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Copy, Check, RefreshCw, Download, Sparkles } from "lucide-react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 10) + 8;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const s = words.join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  };

  const generateParagraph = () => {
    const sentences = Math.floor(Math.random() * 4) + 4;
    const list: string[] = [];
    for (let i = 0; i < sentences; i++) {
      list.push(generateSentence());
    }
    return list.join(" ");
  };

  const generate = () => {
    let result = "";
    if (type === "words") {
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        list.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      result = list.join(" ");
      if (startWithLorem && count >= 5) {
        result = "Lorem ipsum dolor sit amet " + result.slice(26);
      }
    } else if (type === "sentences") {
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        list.push(generateSentence());
      }
      if (startWithLorem && list.length > 0) {
        list[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      result = list.join(" ");
    } else {
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        list.push(generateParagraph());
      }
      if (startWithLorem && list.length > 0) {
        list[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + list[0];
      }
      result = list.join("\n\n");
    }
    setText(result);
  };

  useEffect(() => {
    generate();
  }, [type, count, startWithLorem]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-pink-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Design & Web Fun</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-300 border border-pink-500/20">
          <Sparkles className="size-3" />
          Placeholder Copy Engine
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-inner">
            <FileText className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Lorem Ipsum Generator</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Generate customizable dummy placeholder copy by paragraphs, sentences, or word counts.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Generate By</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(["paragraphs", "sentences", "words"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    type === t ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Quantity: {count}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded"
              />
              <span>Start with &quot;Lorem ipsum...&quot;</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={generate}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
          </button>
        </div>
      </div>

      {/* Text Output Box */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="text-slate-300 text-sm font-sans leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      </div>
    </div>
  );
}
