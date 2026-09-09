"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const WINGDINGS_MAP: Record<string, string> = {
  a: "♋", b: "♌", c: "♍", d: "♎", e: "♏", f: "♐", g: "♑", h: "♒", i: "♓", j: "🕆",
  k: "🕇", l: "🕈", m: "🕉", n: "☸", o: "✡", p: "🕁", q: "🕂", r: "🕃", s: "🕄", t: "🕅",
  u: "🕆", v: "🕇", w: "🕈", x: "🕉", y: "🕊", z: "☼",
  A: "✌", B: "👌", C: "👍", D: "👎", E: "☜", F: "☞", G: "☝", H: "☟", I: "✋", J: "☺",
  K: "😐", L: "☹", M: "💣", N: "☠", O: "⚐", P: "🏱", Q: "✈", R: "☼", S: "💧", T: "❄",
  U: "🕆", V: "🕇", W: "🕈", X: "✕", Y: "✔", Z: "★", " ": " "
};

export default function WingdingsTranslator() {
  const [input, setInput] = useState("Mystery Code");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    const converted = input
      .split("")
      .map((c) => WINGDINGS_MAP[c] || c)
      .join("");
    setOutput(converted);
  }, [input]);

  return (
    <ConverterLayout
      title="Wingdings Translator"
      description="Translate characters and letters into classic retro Wingdings and Webdings symbols."
      iconName="Sparkle"
      category="Converters & Dev"
      inputLabel="Input Text"
      outputLabel="Wingdings Symbol Output"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      tips={[
        "Wingdings is a classic 1990s Microsoft symbol font created by Kris Holmes and Charles Bigelow.",
        "Outputs true Unicode symbol glyphs that can be pasted on Twitter, Discord, and messaging apps."
      ]}
    />
  );
}
