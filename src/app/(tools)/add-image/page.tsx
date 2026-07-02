"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Download } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function AddImage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePos, setImagePos] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handlePdfSelected = (files: File[]) => {
    setPdfFile(files[0]);
    setResultUrl(null);
  };

  const handleImageSelected = (files: File[]) => {
    setImageFile(files[0]);
  };

  const addImage = async () => {
    if (!pdfFile || !imageFile) return;
    setIsProcessing(true);

    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const imageBuffer = await imageFile.arrayBuffer();
      
      const doc = await PDFDocument.load(pdfBuffer);
      const page = doc.getPage(0);

      let image;
      const ext = imageFile.name.split(".").pop()?.toLowerCase();
      
      if (ext === "png") {
        image = await doc.embedPng(imageBuffer);
      } else if (ext === "jpg" || ext === "jpeg") {
        image = await doc.embedJpg(imageBuffer);
      } else {
        throw new Error("Unsupported image format");
      }

      page.drawImage(image, {
        x: imagePos.x,
        y: imagePos.y,
        width: imagePos.width,
        height: imagePos.height
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error adding image:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <ImageIcon className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Add Image to PDF</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Insert images into your PDF documents.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Step 1: Select PDF</h3>
          {pdfFile ? (
            <p className="text-sm text-gray-600">{pdfFile.name}</p>
          ) : (
            <DropZone
              accept={[".pdf"]}
              label="Drop PDF here"
              description="Select PDF file"
              onFilesSelected={handlePdfSelected}
              maxFiles={1}
            />
          )}
        </div>

        <hr />

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Step 2: Select Image</h3>
          {imageFile ? (
            <p className="text-sm text-gray-600">{imageFile.name}</p>
          ) : (
            <DropZone
              accept={[".jpg", ".jpeg", ".png"]}
              label="Drop image here"
              description="Select JPG or PNG"
              onFilesSelected={handleImageSelected}
              maxFiles={1}
            />
          )}
        </div>

        {pdfFile && imageFile && (
          <>
            <hr />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Position & Size</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">X</label>
                  <input
                    type="number"
                    value={imagePos.x}
                    onChange={(e) => setImagePos({...imagePos, x: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Y</label>
                  <input
                    type="number"
                    value={imagePos.y}
                    onChange={(e) => setImagePos({...imagePos, y: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Width</label>
                  <input
                    type="number"
                    value={imagePos.width}
                    onChange={(e) => setImagePos({...imagePos, width: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Height</label>
                  <input
                    type="number"
                    value={imagePos.height}
                    onChange={(e) => setImagePos({...imagePos, height: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <button
                onClick={addImage}
                disabled={isProcessing}
                className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 text-sm"
              >
                {isProcessing ? "Adding..." : "Add Image"}
              </button>
            </div>
          </>
        )}

        {resultUrl && (
          <a
            href={resultUrl}
            download={`image-added-${pdfFile?.name}`}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 text-sm"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        )}
      </div>
    </main>
  );
}
