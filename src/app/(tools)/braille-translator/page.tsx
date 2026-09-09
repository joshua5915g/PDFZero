"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const BRAILLE_MAP: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵", " ": "⠀",
  "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑", "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚"
};

const REVERSE_BRAILLE: Record<string, string> = Object.entries(BRAILLE_MAP).reduce(
  (acc, [k, v]) => ({ ...acc, [v]: k }),
  {}
);

export default function BrailleTranslator() {
  const [direction, setDirection] = useState<"text2braille" | "braille2text">("text2braille");
  const [input, setInput] = useState("Hello world");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    if (direction === "text2braille") {
      const braille = input
        .toLowerCase()
        .split("")
        .map((c) => BRAILLE_MAP[c] || c)
        .join("");
      setOutput(braille);
    } else {
      const text = input
        .split("")
        .map((c) => REVERSE_BRAILLE[c] || c)
        .join("");
      setOutput(text);
    }
  }, [input, direction]);

  return (
    <ConverterLayout
      title="Braille Translator"
      description="Translate plain text into tactile Braille Unicode characters and decode Braille symbols back to readable English."
      iconName="Grid2X2"
      category="Converters & Dev"
      inputLabel={direction === "text2braille" ? "English Text Input" : "Braille Unicode Characters"}
      outputLabel={direction === "text2braille" ? "Braille Output (⠓⠑⠇⠇⠕)" : "English Output"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setDirection(direction === "text2braille" ? "braille2text" : "text2braille");
        setInput(output);
      }}
      actionControls={
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setDirection("text2braille")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              direction === "text2braille" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Text to Braille
          </button>
          <button
            onClick={() => setDirection("braille2text")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              direction === "braille2text" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Braille to Text
          </button>
        </div>
      }
      tips={[
        "Uses official 6-dot Unicode Braille patterns (U+2800 to U+28FF).",
        "Compatible with screen readers, accessibility keyboards, and digital embossers.",
        "Space is converted to the Braille blank character (⠀)."
      ]}
    />
  );
}
