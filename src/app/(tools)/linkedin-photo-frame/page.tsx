"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, Upload, Download, Sparkles } from "lucide-react";

type FrameType = "opentowork" | "hiring" | "leadership" | "freelance";

export default function LinkedInPhotoFramePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [frame, setFrame] = useState<FrameType>("opentowork");
  const [zoom, setZoom] = useState<number>(1);
  const [framedUrl, setFramedUrl] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    renderFramedAvatar(url, frame, zoom);
  };

  const renderFramedAvatar = (src: string, frameType: FrameType, zoomLevel: number) => {
    const img = new Image();
    img.onload = () => {
      const size = 500;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw circular clipping mask
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
      ctx.clip();

      // Draw user image centered & zoomed
      const scaledW = img.width * zoomLevel;
      const scaledH = img.height * zoomLevel;
      const aspect = img.width / img.height;

      let drawW = size * zoomLevel;
      let drawH = size * zoomLevel;
      if (aspect > 1) {
        drawH = drawW / aspect;
      } else {
        drawW = drawH * aspect;
      }

      ctx.drawImage(img, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);
      ctx.restore();

      // Draw bottom curved frame badge
      ctx.save();
      const colors: Record<FrameType, { bg: string; text: string; label: string }> = {
        opentowork: { bg: "#0a66c2", text: "#ffffff", label: "#OpenToWork" },
        hiring: { bg: "#702459", text: "#ffffff", label: "#Hiring" },
        leadership: { bg: "#eab308", text: "#0f172a", label: "#Leadership" },
        freelance: { bg: "#059669", text: "#ffffff", label: "#AvailableForHire" }
      };

      const selected = colors[frameType];

      // Draw curved banner arc
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 20, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.lineWidth = 42;
      ctx.strokeStyle = selected.bg;
      ctx.stroke();

      // Draw hashtag text centered along the curve
      ctx.fillStyle = selected.text;
      ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selected.label, size / 2, size - 46);

      ctx.restore();

      setFramedUrl(canvas.toDataURL("image/png"));
    };
    img.src = src;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            LinkedIn Profile Photo Frame Editor
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Add official #OpenToWork, #Hiring, or custom circular badges to your avatar.
          </p>
        </div>

        {!imageSrc ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload your profile portrait</h2>
              <p className="text-xs text-slate-500 mt-1">Files are processed 100% on your device.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Select Avatar Photo
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Frame Badge</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "opentowork", label: "#OpenToWork", color: "bg-[#0a66c2]" },
                  { id: "hiring", label: "#Hiring", color: "bg-[#702459]" },
                  { id: "freelance", label: "#AvailableForHire", color: "bg-[#059669]" },
                  { id: "leadership", label: "#Leadership", color: "bg-[#eab308]" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFrame(f.id as FrameType);
                      if (imageSrc) renderFramedAvatar(imageSrc, f.id as FrameType, zoom);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      frame === f.id ? "bg-slate-800 border-blue-500 text-white ring-1 ring-blue-500" : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Photo Zoom Scale</span>
                  <span className="font-mono font-bold text-white">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={2.0}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => {
                    const z = Number(e.target.value);
                    setZoom(z);
                    if (imageSrc) renderFramedAvatar(imageSrc, frame, z);
                  }}
                  className="w-full accent-blue-500"
                />
              </div>

              {framedUrl && (
                <a
                  href={framedUrl}
                  download="linkedin_avatar_framed.png"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <Download className="w-4 h-4" /> Download Profile Picture
                </a>
              )}
            </div>

            {/* Circular Avatar Preview */}
            <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
              {framedUrl && (
                <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-slate-700 bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={framedUrl} alt="Framed Avatar" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
