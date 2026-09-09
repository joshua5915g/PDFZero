"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const TEENS = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const THOUSANDS = ["", "Thousand", "Million", "Billion", "Trillion"];

export default function NumbersToWords() {
  const [numInput, setNumInput] = useState("12450.75");
  const [currencyMode, setCurrencyMode] = useState(true);
  const [output, setOutput] = useState("");

  const convertThreeDigits = (n: number): string => {
    let str = "";
    if (n >= 100) {
      str += ONES[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += TEENS[n - 10] + " ";
    } else if (n >= 20) {
      str += TENS[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n >= 1 && n <= 9) {
      str += ONES[n] + " ";
    }
    return str.trim();
  };

  const convertNumber = (numStr: string): string => {
    const clean = numStr.replace(/,/g, "").trim();
    if (!clean || isNaN(Number(clean))) return "";

    const parts = clean.split(".");
    let integerPart = parseInt(parts[0], 10);
    const decimalPart = parts[1] ? parts[1].slice(0, 2).padEnd(2, "0") : null;

    if (integerPart === 0 && !decimalPart) return "Zero";

    let words = "";
    let groupIdx = 0;

    while (integerPart > 0) {
      const chunk = integerPart % 1000;
      if (chunk !== 0) {
        const chunkWords = convertThreeDigits(chunk);
        words = chunkWords + (THOUSANDS[groupIdx] ? " " + THOUSANDS[groupIdx] : "") + " " + words;
      }
      integerPart = Math.floor(integerPart / 1000);
      groupIdx++;
    }

    words = words.trim();

    if (currencyMode) {
      const cents = decimalPart ? parseInt(decimalPart, 10) : 0;
      return `${words || "Zero"} Dollars and ${cents}/100 Cents`;
    } else if (decimalPart) {
      const centsNum = parseInt(decimalPart, 10);
      return `${words || "Zero"} Point ${convertThreeDigits(centsNum)}`;
    }

    return words;
  };

  useEffect(() => {
    setOutput(convertNumber(numInput));
  }, [numInput, currencyMode]);

  return (
    <ConverterLayout
      title="Numbers to Words Converter"
      description="Spell out numbers into complete English words for legal contracts, official bank cheques, and formal invoices."
      iconName="FileDigit"
      category="Converters & Dev"
      inputLabel="Numeric Value (e.g. 12450.75)"
      outputLabel="Spelled Words Output"
      inputValue={numInput}
      outputValue={output}
      onInputChange={setNumInput}
      onClear={() => setNumInput("")}
      actionControls={
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
            <input
              type="checkbox"
              checked={currencyMode}
              onChange={(e) => setCurrencyMode(e.target.checked)}
              className="rounded"
            />
            <span>Bank Cheque Format (Dollars & Cents)</span>
          </label>
        </div>
      }
      tips={[
        "Ideal for filling out paper banking cheques, escrow agreements, and legal deeds.",
        "Supports billions and trillions with decimal cents precision.",
        "Runs 100% locally in your browser."
      ]}
    />
  );
}
