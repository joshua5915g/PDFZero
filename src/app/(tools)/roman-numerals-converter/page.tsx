"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
];

const ROMAN_VALS: Record<string, number> = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
};

export default function RomanNumeralsConverter() {
  const [direction, setDirection] = useState<"num2roman" | "roman2num">("num2roman");
  const [input, setInput] = useState("2026");
  const [output, setOutput] = useState("");

  const toRoman = (num: number): string => {
    if (isNaN(num) || num <= 0 || num > 3999) return "Enter number between 1 and 3999";
    let res = "";
    for (const [val, sym] of ROMAN_MAP) {
      while (num >= val) {
        res += sym;
        num -= val;
      }
    }
    return res;
  };

  const toArabic = (roman: string): string => {
    const clean = roman.toUpperCase().trim();
    if (!clean) return "";
    let total = 0;
    for (let i = 0; i < clean.length; i++) {
      const cur = ROMAN_VALS[clean[i]];
      const next = ROMAN_VALS[clean[i + 1]];
      if (!cur) return "Invalid Roman numeral character: " + clean[i];
      if (next && next > cur) {
        total += next - cur;
        i++;
      } else {
        total += cur;
      }
    }
    return total.toString();
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (direction === "num2roman") {
      setOutput(toRoman(parseInt(input, 10)));
    } else {
      setOutput(toArabic(input));
    }
  }, [input, direction]);

  return (
    <ConverterLayout
      title="Roman Numerals Converter"
      description="Convert standard Arabic numbers into Roman numerals and decode Roman numerals back into numbers."
      iconName="Columns3"
      category="Converters & Dev"
      inputLabel={direction === "num2roman" ? "Number (1 to 3999)" : "Roman Numeral (e.g. MMXXVI)"}
      outputLabel={direction === "num2roman" ? "Roman Numeral Output" : "Standard Number Output"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setDirection(direction === "num2roman" ? "roman2num" : "num2roman");
        setInput(output);
      }}
      actionControls={
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setDirection("num2roman")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              direction === "num2roman" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Number to Roman
          </button>
          <button
            onClick={() => setDirection("roman2num")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              direction === "roman2num" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Roman to Number
          </button>
        </div>
      }
      tips={[
        "Roman numerals use subtractive notation (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).",
        "Standard Roman numerals can represent numbers up to 3,999 (MMMCMXCIX).",
        "Commonly used in copyright years, movie sequels, book chapters, and clocks."
      ]}
    />
  );
}
