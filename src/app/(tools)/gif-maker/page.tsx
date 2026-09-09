"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Upload, Download, Play, Pause, Trash2, Sparkles } from "lucide-react";

export default function GifMakerPage() {
  const [frames, setFrames] = useState<string[]>([]);
  const [fps, setFps] = useState<number>(4);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<any>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newUrls = files.map((f) => URL.createObjectURL(f));
    setFrames((prev) => [...prev, ...newUrls]);
  };

  useEffect(() => {
    if (frames.length > 1 && isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentFrame((c) => (c + 1) % frames.length);
      }, 1000 / fps);
    }
    return () => clearInterval(timerRef.current);
  }, [frames, fps, isPlaying]);

  const removeFrame = (idx: number) => {
    setFrames(frames.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Film className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Animated GIF Maker
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Upload multiple images or photo frames to generate an animated looping GIF directly in your browser.
          </p>
        </div>

        {/* Upload Station */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <label className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-600/20">
            <Upload className="w-4 h-4" /> Add Image Frames
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Speed: {fps} FPS</span>
            <input
              type="range"
              min={1}
              max={15}
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="accent-blue-500 w-28"
            />
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause Preview" : "Play Preview"}
          </button>
        </div>

        {/* Live Animation Player */}
        {frames.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/40 border border-slate-800 min-h-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frames[currentFrame % frames.length]}
                alt="Animation Preview"
                className="max-h-80 object-contain rounded-2xl shadow-2xl border border-slate-800"
              />
              <div className="text-xs font-mono text-slate-400 mt-4">
                Frame {((currentFrame % frames.length) + 1)} of {frames.length}
              </div>
            </div>

            {/* Frames List */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sequenced Frames ({frames.length})
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto p-2 bg-slate-900/60 border border-slate-800 rounded-2xl">
                {frames.map((f, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f} alt={`Frame ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFrame(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            No frames uploaded yet. Click &quot;Add Image Frames&quot; above to begin making your animation!
          </div>
        )}
      </div>
    </div>
  );
}
