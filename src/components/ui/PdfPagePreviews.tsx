"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

interface PdfPagePreviewsProps {
  file: File;
  onPageClick?: (pageIndex: number) => void;
  selectedPages?: number[]; // 1-indexed pages that are selected (e.g. for removal)
  pageRotations?: Record<number, number>; // map of page index (1-indexed) to rotation angle (0, 90, 180, 270)
  enableDragAndDrop?: boolean;
  onReorder?: (newOrderIndices: number[]) => void;
}

export default function PdfPagePreviews({
  file,
  onPageClick,
  selectedPages = [],
  pageRotations = {},
  enableDragAndDrop = false,
  onReorder,
}: PdfPagePreviewsProps) {
  const [pages, setPages] = useState<{ index: number; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function renderThumbnails() {
      setIsLoading(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        
        const renderedPages: { index: number; url: string }[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          if (!active) return;
          const page = await pdf.getPage(i);
          
          // Render page to a canvas
          const viewport = page.getViewport({ scale: 0.4 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: viewport,
            } as any).promise;
            
            renderedPages.push({
              index: i,
              url: canvas.toDataURL(),
            });
          }
        }

        if (active) {
          setPages(renderedPages);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error rendering PDF thumbnails:", err);
        if (active) {
          setIsLoading(false);
        }
      }
    }

    renderThumbnails();

    return () => {
      active = false;
    };
  }, [file]);

  // HTML5 Drag and Drop handlers for Organize tool
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (!enableDragAndDrop) return;
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    if (!enableDragAndDrop || draggedIndex === null || draggedIndex === targetIdx) return;
    e.preventDefault();

    const newList = [...pages];
    const draggedItem = newList[draggedIndex];
    newList.splice(draggedIndex, 1);
    newList.splice(targetIdx, 0, draggedItem);

    setDraggedIndex(targetIdx);
    setPages(newList);
    if (onReorder) {
      onReorder(newList.map((p) => p.index - 1)); // emit 0-indexed list to parent
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <Loader2 className="size-6 text-[#6366F1] animate-spin" />
        <span className="text-xs text-gray-500 font-semibold">Generating visual page previews...</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[360px] overflow-y-auto p-2 border border-gray-100 dark:border-white/[0.08] rounded-xl bg-gray-50 dark:bg-black/20"
    >
      {pages.map((page, index) => {
        const isSelected = selectedPages.includes(page.index);
        const rotation = pageRotations[page.index] || 0;

        return (
          <div
            key={page.index}
            draggable={enableDragAndDrop}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => onPageClick && onPageClick(page.index)}
            className={`relative aspect-[3/4] bg-white dark:bg-[#151824] border rounded-lg flex flex-col items-center justify-between p-2 shadow-sm transition-all select-none ${
              enableDragAndDrop ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
            } ${
              isSelected 
                ? "border-red-500 bg-red-500/5 shadow-red-500/10" 
                : "border-gray-200 dark:border-white/[0.06] hover:border-[#6366F1]/50"
            } ${draggedIndex === index ? "opacity-50 border-dashed border-[#6366F1]" : ""}`}
          >
            {/* Visual Thumbnail Rendering */}
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded">
              <img
                src={page.url}
                alt={`Page ${page.index}`}
                className="max-h-full max-w-full object-contain shadow-xs transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </div>

            {/* Page Index Label */}
            <div className="w-full flex justify-between items-center mt-1 text-[10px] font-bold">
              <span className={isSelected ? "text-red-500" : "text-[#6366F1]"}>
                Page {page.index}
              </span>
              {rotation > 0 && (
                <span className="text-gray-400">({rotation}°)</span>
              )}
            </div>

            {/* Delete indicator overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500 rounded-lg flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                  REMOVING
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
