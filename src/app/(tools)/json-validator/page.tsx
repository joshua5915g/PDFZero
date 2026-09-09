"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";
import { CheckCircle, AlertTriangle, Minimize, Maximize } from "lucide-react";

export default function JsonValidator() {
  const [input, setInput] = useState(`{\n  "status": "success",\n  "tools": 160,\n  "features": ["offline", "unlimited", "free"],\n  "version": 2.0\n}`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setIsValid(true);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError(null);
      setIsValid(true);
    } catch (err: any) {
      setError(err.message);
      setIsValid(false);
    }
  }, [input, indentSize]);

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <ConverterLayout
      title="JSON Validator & Formatter"
      description="Format, validate syntax, pinpoint line errors, and minify JSON data with instant client-side execution."
      iconName="Code"
      category="Converters & Dev"
      inputLabel="Raw JSON Input"
      outputLabel="Formatted / Minified JSON"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      downloadFilename="formatted.json"
      downloadMime="application/json"
      errorMessage={error}
      actionControls={
        <div className="flex flex-wrap items-center justify-between gap-4 w-full text-xs">
          <div className="flex items-center gap-2">
            {isValid ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle className="size-4" /> Valid JSON
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                <AlertTriangle className="size-4" /> Syntax Error
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400 font-medium">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="1">Tab</option>
            </select>

            <button
              onClick={handleMinify}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1 transition"
            >
              <Minimize className="size-3" />
              <span>Minify</span>
            </button>
          </div>
        </div>
      }
      tips={[
        "Errors specify the exact character coordinate and token causing parsing failure.",
        "Use Minify to strip all unnecessary whitespaces and shrink payloads for production APIs.",
        "Your data remains strictly on your device and is never transmitted over the network."
      ]}
    />
  );
}
