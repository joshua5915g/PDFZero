"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface InteractiveCanvasProps {
  file: File;
  currentPage: number;
  rotation?: number; // 0, 90, 180, 270
  activeTool: "select" | "redact" | "draw" | "text";
  onAddRedactionZone?: (page: number, rect: { x: number; y: number; w: number; h: number }) => void;
  redactionZones?: Record<number, { x: number; y: number; w: number; h: number }[]>;
  onClearRedactions?: (page: number) => void;
}

export default function InteractiveCanvas({
  file,
  currentPage,
  rotation = 0,
  activeTool,
  onAddRedactionZone,
  redactionZones = {},
  onClearRedactions,
}: InteractiveCanvasProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  // PDF page reference
  const pageRef = useRef<any>(null);

  // Render PDF page to canvas
  useEffect(() => {
    let active = true;

    async function loadPage() {
      setIsLoading(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(currentPage);
        pageRef.current = page;

        if (!active) return;
        renderCanvas();
      } catch (err) {
        console.error("Error rendering page to workbench canvas:", err);
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [file, currentPage, zoom, rotation]);

  const renderCanvas = () => {
    const page = pageRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!page || !canvas || !overlay) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Viewport scaling with rotation
    const viewport = page.getViewport({ scale: 1.5 * zoom, rotation });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    overlay.width = viewport.width;
    overlay.height = viewport.height;

    page.render({
      canvasContext: context,
      viewport: viewport,
    } as any).promise.then(() => {
      setIsLoading(false);
      drawRedactionOverlays();
    });
  };

  // Re-draw redaction overlay blocks
  const drawRedactionOverlays = () => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Draw active redactions for current page
    const zones = redactionZones[currentPage] || [];
    zones.forEach((zone) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
    });
  };

  // Trigger redraw on zone updates
  useEffect(() => {
    if (!isLoading) {
      drawRedactionOverlays();
    }
  }, [redactionZones, currentPage, isLoading]);

  // Handle drawing redaction boxes
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinate inputs correctly relative to canvas width/height bounds
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "redact") return;
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== "redact") return;
    const pos = getMousePos(e);
    setCurrentPos(pos);

    // Draw active selection box outline on overlay
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    drawRedactionOverlays();

    // Draw temporary drag box bounds
    ctx.strokeStyle = "#818CF8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    ctx.setLineDash([]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || activeTool !== "redact") return;
    setIsDrawing(false);

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);

    // Only apply if block size is meaningful (e.g. 5x5 pixels)
    if (w > 5 && h > 5 && onAddRedactionZone) {
      onAddRedactionZone(currentPage, { x, y, w, h });
    }
  };

  return (
    <div className="flex flex-col items-center h-full w-full bg-[#fbfbfd] border border-black/[0.06] rounded-2xl overflow-hidden p-4 space-y-4">
      
      {/* Visual Controls Viewport Header */}
      <div className="w-full flex items-center justify-between border-b border-black/[0.06] pb-3 shrink-0">
        <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
          Page {currentPage} Preview
          {activeTool === "redact" && (
            <span className="text-[10px] bg-[#ff3b30]/10 text-[#d70015] border border-[#ff3b30]/20 px-2 py-0.5 rounded-full font-bold">
              Redact Mode (Drag to Mask)
            </span>
          )}
        </span>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="p-1.5 hover:bg-black/[0.05] border border-black/[0.06] rounded-full text-[#6e6e73] hover:text-[#1d1d1f] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="text-xs font-medium text-[#1d1d1f] w-12 text-center select-none font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={() => setZoom(z => Math.min(2.0, z + 0.1))}
            className="p-1.5 hover:bg-black/[0.05] border border-black/[0.06] rounded-full text-[#6e6e73] hover:text-[#1d1d1f] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="size-3.5" />
          </button>
          {onClearRedactions && (redactionZones[currentPage] || []).length > 0 && (
            <button
              onClick={() => onClearRedactions(currentPage)}
              className="text-[10px] text-[#ff3b30] hover:underline font-bold px-2 cursor-pointer"
            >
              Clear Marks
            </button>
          )}
        </div>
      </div>

      {/* RENDER CANVAS CONTAINER */}
      <div 
        ref={canvasContainerRef}
        className="flex-1 w-full overflow-auto flex items-start justify-center relative p-2"
      >
        <div className="relative shadow-md border border-black/[0.08] rounded-xl bg-white overflow-hidden">
          {/* Base PDF Canvas layer */}
          <canvas ref={canvasRef} className="block" />

          {/* Mouse drag text highlight/draw overlay layer */}
          <canvas
            ref={overlayCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="absolute inset-0 block cursor-crosshair"
          />
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-6 text-[#0071e3] animate-spin" />
            <span className="text-xs text-[#6e6e73] font-medium">Rendering document preview...</span>
          </div>
        )}
      </div>
    </div>
  );
}
