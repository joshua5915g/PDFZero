"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Link2, Copy, Check, QrCode, ExternalLink, Trash2, Sparkles } from "lucide-react";

interface ShortenedLink {
  id: string;
  original: string;
  shortCode: string;
  created: string;
}

export default function UrlShortenerPage() {
  const [longUrl, setLongUrl] = useState("https://example.com/very/long/deep/nested/page/with/parameters?utm_source=social&utm_medium=campaign");
  const [customSlug, setCustomSlug] = useState("");
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pdfzero_short_links");
      if (saved) setLinks(JSON.parse(saved));
    } catch {}
  }, []);

  const saveLinks = (updated: ShortenedLink[]) => {
    setLinks(updated);
    try {
      localStorage.setItem("pdfzero_short_links", JSON.stringify(updated));
    } catch {}
  };

  const shorten = () => {
    if (!longUrl.trim()) return;

    const code = customSlug.trim() || Math.random().toString(36).substring(2, 8);
    const newLink: ShortenedLink = {
      id: Math.random().toString(),
      original: longUrl.trim(),
      shortCode: code,
      created: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updated = [newLink, ...links.filter((l) => l.shortCode !== code)];
    saveLinks(updated);
    setCustomSlug("");
  };

  const copyShort = async (link: ShortenedLink) => {
    const full = `https://pdfz.link/${link.shortCode}`;
    await navigator.clipboard.writeText(full);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteLink = (id: string) => {
    saveLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Link2 className="w-3.5 h-3.5" />
            Business & Marketing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            URL Shortener & Quick Links
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Generate clean, branded short links and manage your link history locally with zero tracking.
          </p>
        </div>

        {/* Shortener Box */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Long URL</label>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://yourwebsite.com/long-url..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <span className="text-slate-500 font-mono">pdfz.link/</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                placeholder="custom-slug (optional)"
                className="flex-1 bg-transparent border-0 text-white font-mono focus:outline-none ml-1"
              />
            </div>

            <button
              onClick={shorten}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Sparkles className="w-4 h-4" /> Shorten URL
            </button>
          </div>
        </div>

        {/* History of Shortened Links */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Shortened Links ({links.length})
          </h2>

          <div className="space-y-2.5">
            {links.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-[200px] flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      https://pdfz.link/{item.shortCode}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.created}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate max-w-md">
                    {item.original}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyShort(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === item.id ? "Copied" : "Copy"}
                  </button>

                  <a
                    href={item.original}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Visit Destination"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => deleteLink(item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {links.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No links shortened yet. Enter any destination URL above to generate your first link!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
