"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Fingerprint, Copy, Check, RefreshCw, Download, Sparkles } from "lucide-react";

export default function UuidGenerator() {
  const [version, setVersion] = useState<"v4" | "v7" | "nil">("v4");
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUUIDv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUUIDv7 = () => {
    // Unix timestamp in ms to hex
    const timestamp = Date.now().toString(16).padStart(12, "0");
    const rand = "xxxxxxxx-xxxx".replace(/[x]/g, () => {
      return (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf).toString(16);
    });
    return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-7xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let id = "";
      if (version === "nil") {
        id = "00000000-0000-0000-0000-000000000000";
      } else if (version === "v7") {
        id = generateUUIDv7();
      } else {
        id = generateUUIDv4();
      }

      if (noHyphens) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    generate();
  }, [version, quantity, uppercase, noHyphens]);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${version}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
          Cryptographically Secure
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Fingerprint className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">UUID / GUID Generator</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Generate RFC-compliant UUIDv4, UUIDv7 (timestamp-ordered), and Nil identifiers in bulk.
            </p>
          </div>
        </div>
      </div>

      {/* Options Panel */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">UUID Version</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
            >
              <option value="v4">UUID v4 (Random)</option>
              <option value="v7">UUID v7 (Time-Ordered)</option>
              <option value="nil">Nil UUID (All zeros)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Count</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
            >
              <option value="1">1 UUID</option>
              <option value="5">5 UUIDs</option>
              <option value="10">10 UUIDs</option>
              <option value="25">25 UUIDs</option>
              <option value="50">50 UUIDs</option>
              <option value="100">100 UUIDs</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-5">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded"
              />
              <span>UPPERCASE</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={noHyphens}
                onChange={(e) => setNoHyphens(e.target.checked)}
                className="rounded"
              />
              <span>No Hyphens</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={generate}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Generate New</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Copied All!" : "Copy All"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated List */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex justify-between">
          <span>Generated List ({uuids.length})</span>
          <span className="text-slate-500">Click individual ID to copy</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {uuids.map((id, index) => (
            <div
              key={index}
              onClick={() => navigator.clipboard.writeText(id)}
              title="Click to copy"
              className="px-3.5 py-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 text-emerald-300 hover:text-white flex items-center justify-between cursor-pointer transition group"
            >
              <span>{id}</span>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-300">Copy</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
