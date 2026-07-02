"use client";

import "@ungap/with-resolvers";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import DropZone from "@/components/ui/DropZone";

export default function AiTranslate() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [targetLang, setTargetLang] = useState("spa_Latn"); // Default target language (Spanish)
  const [translatedText, setTranslatedText] = useState("");

  const languages = [
    { label: "Spanish", value: "spa_Latn" },
    { label: "French", value: "fra_Latn" },
    { label: "German", value: "deu_Latn" },
    { label: "Japanese", value: "jpn_Jpan" },
    { label: "Chinese (Simplified)", value: "zho_Hans" },
  ];

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setTranslatedText("");
    }
  };

  const clearAll = () => {
    setFile(null);
    setTranslatedText("");
    setProgress(0);
  };

  const runTranslation = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setTranslatedText("");
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

      // 2. Initialize NLLB-200 translation pipeline
      setStatus("Downloading Translation Model (~600M parameters, cached after first run)...");
      const { pipeline, env } = await import("@xenova/transformers");
      env.allowLocalModels = false; // download from Hugging Face

      const translator = await pipeline("translation", "Xenova/nllb-200-distilled-600M", {
        progress_callback: (data: any) => {
          if (data.status === "progress") {
            setProgress(Math.round(data.progress));
            setStatus(`Downloading translation engine weights: ${data.file} (${Math.round(data.progress)}%)`);
          } else if (data.status === "ready") {
            setStatus("Model loaded. Analyzing text...");
          }
        },
      });

      // 3. Chunk text to fit model context bounds (~1000 characters)
      setStatus("Translating content...");
      const textChunks = [];
      const chunkSize = 1000;
      for (let i = 0; i < extractedText.length; i += chunkSize) {
        textChunks.push(extractedText.substring(i, i + chunkSize));
      }

      let accumulatedTranslation = "";
      for (let idx = 0; idx < textChunks.length; idx++) {
        setStatus(`Translating chunk ${idx + 1} of ${textChunks.length}...`);
        try {
          const result = (await translator(textChunks[idx], {
            src_lang: "eng_Latn", // Assume Source: English
            tgt_lang: targetLang,
          } as any)) as any;
          if (result && result[0] && result[0].translation_text) {
            accumulatedTranslation += result[0].translation_text + "\n\n";
          }
        } catch (tokenOverflowErr: any) {
          console.warn("Translation token overflow on chunk, skipping...", tokenOverflowErr);
        }
      }

      if (!accumulatedTranslation.trim()) {
        throw new Error("AI Translator completed but did not return any translation output.");
      }

      setTranslatedText(accumulatedTranslation.trim());
      setStatus("Completed!");
    } catch (err: any) {
      console.error(err);
      alert(`AI Translation failed: ${err.message || err}`);
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
              AI-TRANSLATE
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE WASM TRANSLATION
          </div>
        </div>

        {/* DropZone / File Area */}
        {!file ? (
          <DropZone
            accept={[".pdf", "application/pdf"]}
            label="Drag & Drop PDF to Translate"
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
                  {(file.size / 1024 / 1024).toFixed(2)} MB | PDF Translation
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

            {/* Translation settings */}
            <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
              <label className="block text-xs font-black uppercase text-black dark:text-white">
                Select Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 font-bold focus:outline-none focus:border-red-500 rounded-none text-black dark:text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
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
            {!translatedText && (
              <button
                onClick={runTranslation}
                disabled={isProcessing}
                className={`w-full py-4 border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                <Languages className="w-6 h-6" />
                <span>TRANSLATE DOCUMENT</span>
              </button>
            )}

            {/* Result Area */}
            {translatedText && (
              <div className="border-4 border-black dark:border-white bg-white dark:bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
                <span className="block text-xs font-black uppercase text-zinc-500">Translated PDF Output</span>
                <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 p-4 text-sm font-mono text-black dark:text-white leading-relaxed max-h-[400px] overflow-auto whitespace-pre-wrap">
                  {translatedText}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
