"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";
import { Upload } from "lucide-react";

export default function Base64Encoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello World! PDFZero 160 free web tools.");
  const [output, setOutput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === "encode") {
        // UTF-8 safe encode
        let encoded = btoa(unescape(encodeURIComponent(input)));
        if (urlSafe) {
          encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        setOutput(encoded);
        setError(null);
      } else {
        // Decode
        let str = input.trim();
        if (urlSafe) {
          str = str.replace(/-/g, "+").replace(/_/g, "/");
          while (str.length % 4) str += "=";
        }
        const decoded = decodeURIComponent(escape(atob(str)));
        setOutput(decoded);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Invalid Base64 string for decoding");
      setOutput("");
    }
  }, [input, mode, urlSafe]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setInput(result);
      setMode("encode");
    };
    reader.readAsDataURL(file);
  };

  return (
    <ConverterLayout
      title="Base64 Encoder / Decoder"
      description="Encode text or files into Base64 format, or decode Base64 strings back to clean UTF-8 text. Supports URL-safe mode."
      iconName="Binary"
      category="Converters & Dev"
      inputLabel={mode === "encode" ? "Plain Text / Data to Encode" : "Base64 String to Decode"}
      outputLabel={mode === "encode" ? "Base64 Encoded Output" : "Decoded Text Output"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
      }}
      downloadFilename={mode === "encode" ? "encoded.txt" : "decoded.txt"}
      errorMessage={error}
      actionControls={
        <div className="flex flex-wrap items-center justify-between gap-4 w-full text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("encode")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                mode === "encode"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                mode === "decode"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                className="rounded"
              />
              <span>URL-Safe (- and _)</span>
            </label>

            <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer flex items-center gap-1.5">
              <Upload className="size-3" />
              <span>Load File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      }
      tips={[
        "Supports UTF-8 special characters, emojis, and international multilingual alphabets.",
        "URL-safe mode replaces '+' with '-' and '/' with '_' so strings can be embedded safely in HTTP query parameters.",
        "Click Load File to turn any local image or binary document into a base64 data URI."
      ]}
    />
  );
}
