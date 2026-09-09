"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Share2, Copy, Check } from "lucide-react";

export default function OgPreviewerPage() {
  const [title, setTitle] = useState("PDFZero — 100% Free Client-Side PDF & Web Tools");
  const [description, setDescription] = useState("Edit, convert, merge, and optimize documents directly inside your browser. No files uploaded to servers, no limits, and no watermarks.");
  const [siteUrl, setSiteUrl] = useState("https://pdfzero.com");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&auto=format&fit=crop&q=80");
  const [platform, setPlatform] = useState<"google" | "twitter" | "facebook">("twitter");
  const [copied, setCopied] = useState(false);

  const metaHtml = `
<!-- Standard Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${siteUrl}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(metaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Share2 className="w-3.5 h-3.5" />
            Business & Marketing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Open Graph (OG) Social Card Previewer
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Simulate how your website links appear when shared on Google, Twitter/X, and Facebook/LinkedIn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">OG Image URL (1200x630)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Generated Tags */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Tags Code</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Tags"}
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={metaHtml}
                aria-label="Generated Meta Tags Code"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-400"
              />
            </div>
          </div>

          {/* Previews */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex gap-2">
              {(["twitter", "facebook", "google"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    platform === p ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Twitter / Facebook Preview */}
            {(platform === "twitter" || platform === "facebook") && (
              <div className="rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl">
                <div className="aspect-[1.91/1] w-full bg-slate-900 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1.5 bg-[#16181c]">
                  <div className="text-[11px] font-mono text-slate-400 truncate">{siteUrl.replace(/^https?:\/\//, "")}</div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{description}</p>
                </div>
              </div>
            )}

            {/* Google SERP Preview */}
            {platform === "google" && (
              <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate">{siteUrl}</span>
                </div>
                <h3 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight">
                  {title}
                </h3>
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
