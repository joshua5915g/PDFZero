"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function PercentageCalculator() {
  // Mode 1: What is P% of V?
  const [m1Pct, setM1Pct] = useState(15);
  const [m1Val, setM1Val] = useState(240);
  const m1Result = (m1Pct / 100) * m1Val;

  // Mode 2: X is what percent of Y?
  const [m2Part, setM2Part] = useState(45);
  const [m2Total, setM2Total] = useState(180);
  const m2Result = m2Total !== 0 ? (m2Part / m2Total) * 100 : 0;

  // Mode 3: Percentage change from A to B
  const [m3From, setM3From] = useState(80);
  const [m3To, setM3To] = useState(120);
  const m3Diff = m3To - m3From;
  const m3Result = m3From !== 0 ? (m3Diff / Math.abs(m3From)) * 100 : 0;

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Calculate percentages, fraction ratios, and percentage increases/decreases instantly."
      iconName="Percent"
      category="Calculators & Units"
      resultSummary={{
        label: `${m1Pct}% of ${m1Val}`,
        value: m1Result.toFixed(2),
        subtext: `${m2Part} is ${m2Result.toFixed(1)}% of ${m2Total}`
      }}
      breakdown={[
        { label: "Formula 1 Result", value: `${m1Pct}% of ${m1Val} = ${m1Result.toFixed(2)}` },
        { label: "Formula 2 Result", value: `${m2Part} / ${m2Total} = ${m2Result.toFixed(2)}%` },
        {
          label: "Formula 3 (Change)",
          value: `${m3Result >= 0 ? "+" : ""}${m3Result.toFixed(2)}% (${m3Diff >= 0 ? "Increase" : "Decrease"})`,
          color: m3Result >= 0 ? "text-emerald-400" : "text-red-400"
        }
      ]}
      tips={[
        "Percentages represent hundredths: 25% = 25/100 = 0.25.",
        "To find the percentage change, subtract original from new, divide by original, and multiply by 100."
      ]}
    >
      <div className="space-y-6">
        {/* Mode 1 */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400">1. What is X% of Y?</div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-300">What is</span>
            <input
              type="number"
              value={m1Pct}
              onChange={(e) => setM1Pct(Number(e.target.value))}
              className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
            />
            <span className="text-sm text-slate-300">% of</span>
            <input
              type="number"
              value={m1Val}
              onChange={(e) => setM1Val(Number(e.target.value))}
              className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
            />
            <span className="text-sm text-slate-300">=</span>
            <span className="text-lg font-extrabold text-emerald-400">{m1Result.toFixed(2)}</span>
          </div>
        </div>

        {/* Mode 2 */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400">2. X is what percent of Y?</div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={m2Part}
              onChange={(e) => setM2Part(Number(e.target.value))}
              className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
            />
            <span className="text-sm text-slate-300">is what % of</span>
            <input
              type="number"
              value={m2Total}
              onChange={(e) => setM2Total(Number(e.target.value))}
              className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
            />
            <span className="text-sm text-slate-300">=</span>
            <span className="text-lg font-extrabold text-emerald-400">{m2Result.toFixed(2)}%</span>
          </div>
        </div>

        {/* Mode 3 */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400">3. Percentage Increase / Decrease</div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-300">From</span>
            <input
              type="number"
              value={m3From}
              onChange={(e) => setM3From(Number(e.target.value))}
              className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
            />
            <span className="text-sm text-slate-300">to</span>
            <input
              type="number"
              value={m3To}
              onChange={(e) => setM3To(Number(e.target.value))}
              className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
            />
            <span className="text-sm text-slate-300">=</span>
            <span className={`text-lg font-extrabold ${m3Result >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {m3Result >= 0 ? "+" : ""}{m3Result.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
