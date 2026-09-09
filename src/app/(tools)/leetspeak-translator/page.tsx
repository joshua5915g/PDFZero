"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const LEET_MAP: Record<string, string> = {
  a: "4", b: "8", e: "3", g: "9", i: "1", l: "1", o: "0", s: "5", t: "7", z: "2"
};

export default function LeetspeakTranslator() {
  const [input, setInput] = useState("Hello world! We are elite hackers using PDFZero.");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    const leet = input
      .split("")
      .map((c) => {
        const lower = c.toLowerCase();
        return LEET_MAP[lower] || c;
      })
      .join("");

    setOutput(leet);
  }, [input]);

  return (
    <ConverterLayout
      title="Leetspeak (1337) Translator"
      description="Convert ordinary sentences into classic 90s hacker leetspeak substitution typography."
      iconName="Cpu"
      category="Converters & Dev"
      inputLabel="Standard English Text"
      outputLabel="1337 5P34K Output"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      tips={[
        "Replaces letters with visually similar numbers (E->3, A->4, T->7, O->0, S->5).",
        "Popular in gaming gamer tags, retro cyberpunk communities, and meme culture."
      ]}
    />
  );
}
