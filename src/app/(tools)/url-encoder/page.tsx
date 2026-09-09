"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function UrlEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("https://pdfzero.com/search?q=free pdf tools&category=all tools#featured");
  const [output, setOutput] = useState("");
  const [componentOnly, setComponentOnly] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(componentOnly ? encodeURIComponent(input) : encodeURI(input));
        setError(null);
      } else {
        setOutput(decodeURIComponent(input));
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to decode URI string");
      setOutput("");
    }
  }, [input, mode, componentOnly]);

  return (
    <ConverterLayout
      title="URL Encoder / Decoder"
      description="Encode special characters into RFC 3986 percent-encoded characters or decode URL strings back to readable text."
      iconName="Link"
      category="Converters & Dev"
      inputLabel={mode === "encode" ? "Raw URL or Query String" : "Encoded URL String"}
      outputLabel={mode === "encode" ? "Percent-Encoded URL" : "Decoded URL Text"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
      }}
      downloadFilename="url.txt"
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
              Encode URL
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                mode === "decode"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Decode URL
            </button>
          </div>

          {mode === "encode" && (
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={componentOnly}
                onChange={(e) => setComponentOnly(e.target.checked)}
                className="rounded"
              />
              <span>Encode Component (encodes :, /, ?, &, #)</span>
            </label>
          )}
        </div>
      }
      tips={[
        "Encode Component converts symbols like &, =, and / so they can be passed as safe query parameters.",
        "Encode URI retains standard URL structural characters (e.g. https://) and only encodes spaces and symbols.",
        "Decode converts all %20, %26, etc., back into their natural readable characters."
      ]}
    />
  );
}
