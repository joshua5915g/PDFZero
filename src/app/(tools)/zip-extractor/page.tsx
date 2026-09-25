"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderArchive, Download, Upload, File, Sparkles, CheckCircle } from "lucide-react";
import JSZip from "jszip";

interface ExtractedFile {
  name: string;
  size: number;
  blob: Blob;
}

export default function ZipExtractor() {
  const [zipName, setZipName] = useState<string | null>(null);
  const [files, setFiles] = useState<ExtractedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setZipName(file.name);
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const extractedList: ExtractedFile[] = [];

      for (const [filename, fileData] of Object.entries(content.files)) {
        if (!fileData.dir) {
          const blob = await fileData.async("blob");
          extractedList.push({
            name: filename,
            size: blob.size,
            blob
          });
        }
      }
      setFiles(extractedList);
    } catch (err) {
      console.error("Failed to extract zip:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (fileItem: ExtractedFile) => {
    const url = URL.createObjectURL(fileItem.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileItem.name.split("/").pop() || "file";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Converters & Dev</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <Sparkles className="size-3" />
          Client-Side In-Memory Unpack
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <FolderArchive className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">ZIP Archive Extractor</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Unpack and extract files from ZIP archives right inside your browser without uploading to any server.
            </p>
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/30 rounded-3xl p-12 text-center transition flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
            <Upload className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Select a ZIP archive to unpack</h3>
            <p className="text-xs text-slate-400">Works 100% offline in browser memory</p>
          </div>
          <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20">
            Browse ZIP File
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-400 block">Archive Loaded</span>
              <h4 className="text-sm font-bold text-white mt-0.5">{zipName} ({files.length} files)</h4>
            </div>
            <label className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition">
              Open Another ZIP
              <input
                type="file"
                accept=".zip,application/zip"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Contents ({files.length})
            </div>
            <div className="divide-y divide-slate-800/60 font-mono text-xs">
              {files.map((f, i) => (
                <div key={i} className="py-3 flex items-center justify-between hover:bg-slate-900/50 px-2 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <File className="size-4 text-emerald-400" />
                    <span className="text-slate-200">{f.name}</span>
                    <span className="text-slate-500 text-[11px]">({formatSize(f.size)})</span>
                  </div>
                  <button
                    onClick={() => downloadFile(f)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Download className="size-3" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
