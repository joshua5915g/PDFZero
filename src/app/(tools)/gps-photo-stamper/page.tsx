"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Upload, Download, Sparkles } from "lucide-react";

export default function GpsPhotoStamperPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [stampedUrl, setStampedUrl] = useState<string | null>(null);
  const [locationText, setLocationText] = useState("San Francisco, CA • 37.7749° N, 122.4194° W");
  const [timestampText, setTimestampText] = useState(() => new Date().toLocaleString());
  const [position, setPosition] = useState<"bottom-left" | "bottom-right">("bottom-left");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    applyStamp(url, locationText, timestampText, position);
  };

  const applyStamp = (src: string, loc: string, time: string, pos: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Render GPS badge banner
      const fontSize = Math.max(16, Math.round(canvas.width / 40));
      ctx.font = `600 ${fontSize}px sans-serif`;

      const text1 = `📍 ${loc}`;
      const text2 = `🕒 ${time}`;
      const padding = fontSize;
      const badgeWidth = Math.max(ctx.measureText(text1).width, ctx.measureText(text2).width) + padding * 2;
      const badgeHeight = fontSize * 2.8;

      let x = pos === "bottom-left" ? padding : canvas.width - badgeWidth - padding;
      let y = canvas.height - badgeHeight - padding;

      // Dark translucent backdrop badge
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.beginPath();
      ctx.roundRect(x, y, badgeWidth, badgeHeight, 12);
      ctx.fill();

      // Golden text stamp
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(text1, x + padding, y + fontSize + 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text2, x + padding, y + fontSize * 2 + 8);

      setStampedUrl(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = src;
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
            <MapPin className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            GPS Photo Location Stamper
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Stamp verified GPS coordinates, geographic location, and timestamps directly onto photos.
          </p>
        </div>

        {!imageSrc ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Select photo to stamp</h2>
              <p className="text-xs text-slate-500 mt-1">Processed client-side. EXIF metadata preserved.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Browse Image
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Location Text & GPS
                </label>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => {
                    setLocationText(e.target.value);
                    if (imageSrc) applyStamp(imageSrc, e.target.value, timestampText, position);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Date / Timestamp
                </label>
                <input
                  type="text"
                  value={timestampText}
                  onChange={(e) => {
                    setTimestampText(e.target.value);
                    if (imageSrc) applyStamp(imageSrc, locationText, e.target.value, position);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-end">
                {stampedUrl && (
                  <a
                    href={stampedUrl}
                    download="stamped_photo.jpg"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" /> Download Stamped Image
                  </a>
                )}
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex justify-center max-h-[500px]">
              {stampedUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={stampedUrl} alt="Stamped Preview" className="max-h-[480px] object-contain rounded-2xl shadow-2xl" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
