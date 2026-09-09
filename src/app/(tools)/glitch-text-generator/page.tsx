"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

// Combining diacritical marks
const ZALGO_UP = [
  "\u030d", "\u030e", "\u0304", "\u0305", "\u033f", "\u0311", "\u0306", "\u0310",
  "\u0352", "\u0357", "\u0351", "\u0307", "\u0308", "\u030a", "\u0342", "\u0343",
  "\u0344", "\u034a", "\u034b", "\u034c", "\u0303", "\u0302", "\u030c", "\u0350"
];

const ZALGO_DOWN = [
  "\u0316", "\u0317", "\u0318", "\u0319", "\u031c", "\u031d", "\u031e", "\u031f",
  "\u0320", "\u0324", "\u0325", "\u0326", "\u0329", "\u032a", "\u032b", "\u032c",
  "\u032d", "\u032e", "\u032f", "\u0330", "\u0331", "\u0332", "\u0333", "\u0339"
];

export default function GlitchTextGenerator() {
  const [input, setInput] = useState("Corrupted Data Signal");
  const [intensity, setIntensity] = useState(5);
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    let res = "";
    for (let i = 0; i < input.length; i++) {
      res += input[i];
      if (input[i] !== " ") {
        for (let j = 0; j < intensity; j++) {
          const upMark = ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
          const downMark = ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
          res += upMark + downMark;
        }
      }
    }
    setOutput(res);
  }, [input, intensity]);

  return (
    <ConverterLayout
      title="Glitch / Zalgo Text Generator"
      description="Add creepy corrupted Zalgo distortion and glitch marks across any text string."
      iconName="Activity"
      category="Converters & Dev"
      inputLabel="Normal Text"
      outputLabel="Glitch / Zalgo Output"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      actionControls={
        <div className="flex items-center gap-4 w-full text-xs text-slate-300">
          <label className="font-semibold">Glitch Corruption Level: {intensity}</label>
          <input
            type="range"
            min="1"
            max="12"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-48"
          />
        </div>
      }
      tips={[
        "Uses zero-width Unicode combining characters stacked on top of and below each base letter.",
        "Works on social networks like Discord, Twitter, Reddit, and Instagram."
      ]}
    />
  );
}
