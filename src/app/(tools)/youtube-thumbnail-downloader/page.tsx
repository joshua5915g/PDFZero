"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Video, Download, Check, AlertCircle, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function YouTubeThumbnailDownloaderPage() {
  const [urlInput, setUrlInput] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);

  // Extract YouTube Video ID
  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    // Standard youtube.com/watch?v=ID
    const vMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    return vMatch ? vMatch[1] : null;
  };

  const videoId = extractVideoId(urlInput);

  const qualities = [
    { label: "Maximum Quality (1080p / 4K)", code: "maxresdefault", res: "1920x1080", filename: `${videoId || "video"}_maxres.jpg` },
    { label: "High Quality (HD)", code: "hqdefault", res: "480x360", filename: `${videoId || "video"}_hq.jpg` },
    { label: "Standard Definition", code: "sddefault", res: "640x480", filename: `${videoId || "video"}_sd.jpg` },
    { label: "Medium Quality", code: "mqdefault", res: "320x180", filename: `${videoId || "video"}_mq.jpg` }
  ];

  const downloadThumbnail = async (qualityCode: string, filename: string) => {
    if (!videoId) return;
    setDownloadingQuality(qualityCode);
    const imgUrl = `https://img.youtube.com/vi/${videoId}/${qualityCode}.jpg`;

    try {
      const resp = await fetch(imgUrl, { mode: "cors" });
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(imgUrl, "_blank");
    } finally {
      setDownloadingQuality(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
            <Video className="w-3.5 h-3.5" />
            Converters & Dev
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Instantly grab full HD, 1080p, and SD cover art from any YouTube video or short.
          </p>
        </div>

        {/* Input Bar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Enter YouTube Video URL or Video ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          {videoId ? (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
              <Check className="w-3.5 h-3.5" /> Extracted Video ID: {videoId}
            </div>
          ) : (
            <div className="text-xs text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Please enter a valid YouTube link or 11-character video ID.
            </div>
          )}
        </div>

        {/* Thumbnails Grid */}
        {videoId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualities.map((q) => {
              const imgUrl = `https://img.youtube.com/vi/${videoId}/${q.code}.jpg`;
              return (
                <div
                  key={q.code}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all"
                >
                  <div className="relative aspect-video bg-black/40 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={q.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono font-medium text-slate-200">
                      {q.res}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">{q.label}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{q.code}.jpg</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadThumbnail(q.code, q.filename)}
                        disabled={downloadingQuality === q.code}
                        className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {downloadingQuality === q.code ? "Downloading..." : "Download Image"}
                      </button>
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
