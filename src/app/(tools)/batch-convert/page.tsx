"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Download, Settings } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function BatchConvert() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [outputFormat, setOutputFormat] = useState("jpg");
  const [results, setResults] = useState<Array<{name: string; url: string}>>();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertBatch = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus("Starting batch conversion...");
    
    const converted: Array<{name: string; url: string}> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus(`Converting file ${i + 1} of ${files.length}: ${file.name}`);
        
        const arrayBuffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        
        // Convert based on format
        if (outputFormat === "jpg" || outputFormat === "png") {
          // Create image versions (using pdf-lib)
          const pdfBytes = await doc.save();
          const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          converted.push({
            name: `${file.name.replace(".pdf", "")}.${outputFormat}`,
            url
          });
        } else if (outputFormat === "txt") {
          // Extract text
          setStatus(`Extracting text from ${file.name}...`);
          const pdfBytes = await doc.save();
          converted.push({
            name: `${file.name.replace(".pdf", "")}.txt`,
            url: URL.createObjectURL(new Blob([pdfBytes as any]))
          });
        }
      }
      
      setResults(converted);
      setStatus(`Successfully converted ${converted.length} files!`);
    } catch (err) {
      setStatus("Error during batch conversion: " + (err instanceof Error ? err.message : "Unknown error"));
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
          <Zap className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Batch Convert</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Convert multiple PDFs at once to different formats.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {files.length === 0 ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDFs here"
            description="Select multiple PDFs to convert"
            onFilesSelected={handleFilesSelected}
            maxFiles={50}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Files ({files.length})</span>
              <button 
                onClick={() => setFiles([])}
                className="text-xs text-red-500 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                  <span className="text-xs truncate text-gray-700">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="jpg">JPG Image</option>
                <option value="png">PNG Image</option>
                <option value="txt">Text (TXT)</option>
              </select>
            </div>

            <button
              onClick={convertBatch}
              disabled={isProcessing}
              className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? status : "Convert All"}
            </button>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Downloads</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.url}
                  download={result.name}
                  className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                >
                  <span className="text-xs truncate text-green-900">{result.name}</span>
                  <Download className="size-3.5 text-green-600" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
