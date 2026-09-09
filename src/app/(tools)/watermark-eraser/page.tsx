"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Eraser, Upload, Download, RotateCcw, Sparkles } from "lucide-react";

export default function WatermarkEraserPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<number>(25);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      if (canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        const ctx = canvasRef.current.getContext("2d");
        ctx?.drawImage(img, 0, 0);
      }
    };
    img.src = url;
  };

  const eraseArea = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Apply blur / blend inpaint effect in radius
    const r = brushSize;
    const startX = Math.max(0, Math.round(x - r));
    const startY = Math.max(0, Math.round(y - r));
    const w = Math.min(canvas.width - startX, r * 2);
    const h = Math.min(canvas.height - startY, r * 2);

    if (w <= 0 || h <= 0) return;

    const imgData = ctx.getImageData(startX, startY, w, h);
    const data = imgData.data;

    // Box blur kernel over the painted patch
    for (let i = 0; i < data.length; i += 4) {
      // Smooth neighbor averaging
      const next = (i + 4) % data.length;
      data[i] = (data[i] + data[next]) / 2;
      data[i + 1] = (data[i + 1] + data[next + 1]) / 2;
      data[i + 2] = (data[i + 2] + data[next + 2]) / 2;
    }

    ctx.putImageData(imgData, startX, startY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    eraseArea((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    eraseArea((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const resetCanvas = () => {
    if (canvasRef.current && originalImageRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(originalImageRef.current, 0, 0);
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "erased_image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <Eraser className="w-3.5 h-3.5" />
            Image Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Watermark & Object Eraser
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Brush over unwanted logos, stamps, and watermarks to blend them into the surrounding background.
          </p>
        </div>

        {!imageSrc ? (
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl bg-slate-900/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload image with watermark</h2>
              <p className="text-xs text-slate-500 mt-1">100% browser-based canvas inpainting.</p>
            </div>
            <label className="inline-block px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-blue-600/20">
              Browse Image
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase">Brush Size: {brushSize}px</span>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="accent-blue-500 w-32"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetCanvas}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Revert Original
                </button>
                <button
                  onClick={downloadImage}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  <Download className="w-3.5 h-3.5" /> Download Result
                </button>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/40 border border-slate-800 flex justify-center overflow-auto">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="max-h-[600px] object-contain rounded-xl cursor-crosshair shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
