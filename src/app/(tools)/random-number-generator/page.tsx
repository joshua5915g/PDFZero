"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";
import { Dices, RefreshCw, Copy, Check } from "lucide-react";

export default function RandomNumberGenerator() {
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(100);
  const [count, setCount] = useState(1);
  const [uniqueOnly, setUniqueOnly] = useState(false);
  const [results, setResults] = useState<number[]>([42]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const min = Math.min(minVal, maxVal);
    const max = Math.max(minVal, maxVal);
    const range = max - min + 1;

    if (uniqueOnly && count > range) {
      alert(`Cannot generate ${count} unique numbers from a range of only ${range} numbers!`);
      return;
    }

    const arr: number[] = [];
    if (uniqueOnly) {
      const set = new Set<number>();
      while (set.size < count) {
        const r = Math.floor(Math.random() * range) + min;
        set.add(r);
      }
      arr.push(...set);
    } else {
      for (let i = 0; i < count; i++) {
        arr.push(Math.floor(Math.random() * range) + min);
      }
    }
    setResults(arr);
  };

  const copyResults = async () => {
    await navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rollPreset = (sides: number) => {
    setMinVal(1);
    setMaxVal(sides);
    setCount(1);
    setResults([Math.floor(Math.random() * sides) + 1]);
  };

  return (
    <CalculatorLayout
      title="Random Number Generator"
      description="Generate cryptographically random numbers, roll tabletop dice (D6, D20, D100), or pick lottery winners."
      iconName="Dices"
      category="Calculators & Units"
      resultSummary={{
        label: count === 1 ? "Generated Result" : `Generated ${results.length} Numbers`,
        value: results.length === 1 ? results[0] : results.slice(0, 5).join(", ") + (results.length > 5 ? "..." : ""),
        subtext: `Range: [${minVal} to ${maxVal}]`
      }}
      breakdown={[
        { label: "Smallest Value", value: results.length > 0 ? Math.min(...results) : 0 },
        { label: "Largest Value", value: results.length > 0 ? Math.max(...results) : 0 },
        { label: "Total Numbers Generated", value: `${results.length}` },
        { label: "Duplicates Allowed", value: uniqueOnly ? "No (Unique)" : "Yes" }
      ]}
      tips={[
        "Uses JavaScript's Math.random() uniform pseudo-random distribution algorithm.",
        "Toggle 'Unique Numbers Only' to generate lottery picks or non-repeating raffle winners."
      ]}
    >
      <div className="space-y-6">
        {/* Quick Dice Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Dice & Coin Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => rollPreset(2)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              🪙 Coin Flip (1-2)
            </button>
            <button
              type="button"
              onClick={() => rollPreset(6)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              🎲 D6 Die
            </button>
            <button
              type="button"
              onClick={() => rollPreset(20)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              🐉 D20 Die
            </button>
            <button
              type="button"
              onClick={() => rollPreset(100)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              💯 D100 (1-100)
            </button>
          </div>
        </div>

        {/* Custom Range Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Minimum
            </label>
            <input
              type="number"
              value={minVal}
              onChange={(e) => setMinVal(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Maximum
            </label>
            <input
              type="number"
              value={maxVal}
              onChange={(e) => setMaxVal(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              How Many Numbers?
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-300">
            <input
              type="checkbox"
              checked={uniqueOnly}
              onChange={(e) => setUniqueOnly(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
            <span>No duplicates (Unique numbers only)</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyResults}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={generate}
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate Now
            </button>
          </div>
        </div>

        {/* Large Results Display */}
        {results.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex flex-wrap gap-2.5 max-h-64 overflow-y-auto">
            {results.map((n, i) => (
              <span
                key={i}
                className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono font-bold text-base"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
