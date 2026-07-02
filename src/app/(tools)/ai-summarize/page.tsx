"use client";

import "@ungap/with-resolvers";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import DropZone from "@/components/ui/DropZone";

export default function AiSummarize() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState("");

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setSummary("");
    }
  };

  const clearAll = () => {
    setFile(null);
    setSummary("");
    setProgress(0);
  };

  const runSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setSummary("");
    setStatus("Loading PDF parser...");

    try {
      // 1. Extract Text from PDF
      const pdfjs = await import("pdfjs-dist");
      // @ts-ignore
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      let extractedText = "";
      for (let i = 1; i <= numPages; i++) {
        setStatus(`Extracting text from page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // @ts-ignore
          .map((item) => item.str || "")
          .join(" ");
        extractedText += pageText + "\n";
      }

      if (!extractedText.trim()) {
        throw new Error("No text content could be extracted from the PDF.");
      }

      // 2. Initialize Transformers.js
      setStatus("Downloading AI Model (~400MB, cached after first run)...");
      const { pipeline, env } = await import("@xenova/transformers");
      env.allowLocalModels = false; // force downloading from Hugging Face CDN

      const summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6", {
        progress_callback: (data: any) => {
          if (data.status === "progress") {
            setProgress(Math.round(data.progress));
            setStatus(`Downloading model weights: ${data.file} (${Math.round(data.progress)}%)`);
          } else if (data.status === "ready") {
            setStatus("Model loaded. Analyzing text...");
          }
        },
      });

      // 3. Chunk text to fit model context length (~3000 chars / ~750 words)
      setStatus("Summarizing content...");
      const textChunks = [];
      const chunkSize = 3000;
      for (let i = 0; i < extractedText.length; i += chunkSize) {
        textChunks.push(extractedText.substring(i, i + chunkSize));
      }

      let accumulatedSummary = "";
      for (let idx = 0; idx < textChunks.length; idx++) {
        setStatus(`Summarizing section ${idx + 1} of ${textChunks.length}...`);
        try {
          const result = (await summarizer(textChunks[idx], {
            max_new_tokens: 120,
            min_new_tokens: 30,
          })) as any;
          if (result && result[0] && result[0].summary_text) {
            accumulatedSummary += result[0].summary_text + "\n\n";
          }
        } catch (tokenOverflowErr: any) {
          console.warn("Token overflow or summarization crash on chunk, skipping...", tokenOverflowErr);
        }
      }

      if (!accumulatedSummary.trim()) {
        throw new Error("AI Summarizer completed but did not return any summary output.");
      }

      setSummary(accumulatedSummary.trim());
      setStatus("Completed!");
    } catch (err: any) {
      console.error(err);
      alert(`AI Summarization failed: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 text-zinc-900 dark:text-zinc-50 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black dark:border-white pb-6 space-y-4 sm:space-y-0">
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 text-sm font-bold border-2 border-black dark:border-zinc-300 px-3 py-1 bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HOME</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tighter">
              AI-SUMMARIZE
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE WASM AI
          </div>
        </div>

        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".pdf", "application/pdf"]}
            label="Drag & Drop PDF to Summarize"
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            maxSizeMB={50}
          />
        ) : (
          <div className="space-y-6">
            
            {/* File info card */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="overflow-hidden">
                <span className="font-bold block text-sm truncate text-black dark:text-white">{file.name}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB | PDF Text Summarization
                </span>
              </div>
              <button
                onClick={clearAll}
                disabled={isProcessing}
                className="px-3 py-1 border-2 border-black dark:border-zinc-300 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                REMOVE FILE
              </button>
            </div>

            {/* Progress panel */}
            {isProcessing && (
              <div className="border-4 border-black dark:border-white p-4 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="truncate max-w-[80%]">STATUS: {status}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-6 border-2 border-black dark:border-white overflow-hidden relative">
                  <div
                    className="bg-black dark:bg-white h-full transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Trigger */}
            {!summary && (
              <button
                onClick={runSummarize}
                disabled={isProcessing}
                className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                <Sparkles className="w-6 h-6" />
                <span>GENERATE SUMMARY</span>
              </button>
            )}

            {/* Result Area */}
            {summary && (
              <div className="border-4 border-black dark:border-white bg-white dark:bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
                <span className="block text-xs font-black uppercase text-zinc-500">Extracted PDF Summary</span>
                <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 p-4 text-sm font-mono text-black dark:text-white leading-relaxed max-h-[400px] overflow-auto whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
