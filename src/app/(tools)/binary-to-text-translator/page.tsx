"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function BinaryTranslator() {
  const [direction, setDirection] = useState<"text2bin" | "bin2text">("text2bin");
  const [input, setInput] = useState("Hello PDFZero");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    if (direction === "text2bin") {
      const bin = input
        .split("")
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
      setOutput(bin);
    } else {
      const bytes = input.trim().split(/\s+/);
      const text = bytes
        .map((byte) => String.fromCharCode(parseInt(byte, 2)))
        .join("");
      setOutput(text);
    }
  }, [input, direction]);

  return (
    <ConverterLayout
      title="Binary to Text Translator"
      description="Convert ASCII and UTF-8 text into 8-bit binary code strings, or decode binary streams (0101) into readable text."
      iconName="Binary"
      category="Converters & Dev"
      inputLabel={direction === "text2bin" ? "Text to Encode" : "Binary Code (0101...)"}
      outputLabel={direction === "text2bin" ? "8-Bit Binary Output" : "Decoded Text Output"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setDirection(direction === "text2bin" ? "bin2text" : "text2bin");
        setInput(output);
      }}
      actionControls={
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setDirection("text2bin")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              direction === "text2bin" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Text to Binary
          </button>
          <button
            onClick={() => setDirection("bin2text")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              direction === "bin2text" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Binary to Text
          </button>
        </div>
      }
      tips={[
        "Each letter or character in standard UTF-8/ASCII maps to 1 byte (8 bits of 0s and 1s).",
        "Binary bytes are formatted with space separators for clear visual inspection.",
        "Works instantaneously offline inside browser memory."
      ]}
    />
  );
}
