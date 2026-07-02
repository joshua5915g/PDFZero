"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Type, Download } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, rgb } from "pdf-lib";

export default function AddTextBox() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textBox, setTextBox] = useState({
    text: "Sample Text",
    fontSize: 12,
    x: 50,
    y: 50,
    color: "#000000"
  });
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = (selectedFiles: File[]) => {
    setFile(selectedFiles[0]);
    setResultUrl(null);
  };

  const addTextBox = async () => {
    if (!file || !textBox.text) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const page = doc.getPage(0);

      const hexColor = textBox.color.replace("#", "");
      const r = parseInt(hexColor.substring(0, 2), 16) / 255;
      const g = parseInt(hexColor.substring(2, 4), 16) / 255;
      const b = parseInt(hexColor.substring(4, 6), 16) / 255;

      page.drawText(textBox.text, {
        x: textBox.x,
        y: textBox.y,
        size: textBox.fontSize,
        color: rgb(r, g, b)
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error adding text:", err);
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
          <Type className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Add Text Box</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Add custom text boxes to your PDF pages.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop your PDF"
            description="Select a PDF to add text"
            onFilesSelected={handleFileSelected}
            maxFiles={1}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{file.name}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Text</label>
                <textarea
                  value={textBox.text}
                  onChange={(e) => setTextBox({...textBox, text: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Font Size</label>
                <input
                  type="number"
                  value={textBox.fontSize}
                  onChange={(e) => setTextBox({...textBox, fontSize: parseInt(e.target.value)})}
                  min="8"
                  max="72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">X Position</label>
                  <input
                    type="number"
                    value={textBox.x}
                    onChange={(e) => setTextBox({...textBox, x: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Y Position</label>
                  <input
                    type="number"
                    value={textBox.y}
                    onChange={(e) => setTextBox({...textBox, y: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Text Color</label>
                <input
                  type="color"
                  value={textBox.color}
                  onChange={(e) => setTextBox({...textBox, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={addTextBox}
              disabled={isProcessing}
              className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? "Adding..." : "Add Text"}
            </button>
          </div>
        )}

        {resultUrl && (
          <a
            href={resultUrl}
            download={`text-added-${file?.name}`}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        )}
      </div>
    </main>
  );
}
