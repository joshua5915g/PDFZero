"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

// Minimal ASCII Banner character matrix
const BANNER_MAP: Record<string, string[]> = {
  A: [" ___ ", "/ _ \\", "|/_\\|", "|   |"],
  B: [" ___ ", "| _ )", "| _ \\", "|___/"],
  C: ["  __ ", " / _|", "| (_ ", " \\__|"],
  D: [" ___ ", "|   \\", "| |) |", "|___/"],
  E: [" ___ ", "| __|", "| _| ", "|___|"],
  F: [" ___ ", "| __|", "| _| ", "|_|  "],
  G: ["  __ ", " / _|", "| |/|", " \\__|"],
  H: [" _ _ ", "| | |", "| _ |", "|_| |"],
  I: [" ___ ", "  |  ", "  |  ", " ___ "],
  J: ["  __ ", "   | ", "|  | ", " \\_/ "],
  K: [" _ _ ", "| |/ ", "|   <", "|_|\\_\\"],
  L: [" _   ", "| |  ", "| |_ ", "|___|"],
  M: [" _ _ ", "| ' |", "| . |", "|_|_|"],
  N: [" _ _ ", "| \\ |", "| . |", "|_|\\_|"],
  O: [" ___ ", "/ _ \\", "| | |", "\\___/"],
  P: [" ___ ", "| _ \\", "|  _/", "|_|  "],
  Q: [" ___ ", "/ _ \\", "| \\ |", "\\_\\_\\"],
  R: [" ___ ", "| _ \\", "|   /", "|_|_\\"],
  S: [" ___ ", "/ __|", "\\__ \\", "|___/"],
  T: [" ___ ", " |_| ", "  |  ", "  |  "],
  U: [" _ _ ", "| | |", "| |_|", "\\___/"],
  V: [" _ _ ", "| | |", " \\ / ", "  V  "],
  W: [" _ _ ", "| | |", "| | |", "|_|_|"],
  X: [" _ _ ", " \\_/ ", " / \\ ", "|_|_|"],
  Y: [" _ _ ", " \\_/ ", "  |  ", "  |  "],
  Z: [" ___ ", "  / /", " / / ", "/___|"],
  " ": ["     ", "     ", "     ", "     "],
  "!": [" _ ", "| |", "|_|", "(_)"]
};

export default function AsciiArtGenerator() {
  const [input, setInput] = useState("PDFZERO");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const clean = input.toUpperCase();
    const lines = ["", "", "", ""];

    for (const char of clean) {
      const glyph = BANNER_MAP[char] || BANNER_MAP[" "];
      for (let i = 0; i < 4; i++) {
        lines[i] += glyph[i] + " ";
      }
    }

    setOutput(lines.join("\n"));
  }, [input]);

  return (
    <ConverterLayout
      title="ASCII Art Banner Generator"
      description="Transform regular text words into large banner-style ASCII art for console logs, Readmes, and code comments."
      iconName="Terminal"
      category="Converters & Dev"
      inputLabel="Input Text (A-Z)"
      outputLabel="ASCII Banner Output"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      downloadFilename="ascii-art.txt"
      tips={[
        "Use in GitHub README.md files, source code headers, or welcome terminal messages.",
        "Monospaced fonts ensure characters line up into solid block structures.",
        "Generates clean plain text compatible with all operating systems."
      ]}
    />
  );
}
