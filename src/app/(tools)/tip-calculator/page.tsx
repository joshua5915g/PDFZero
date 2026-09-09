"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";
import { Users } from "lucide-react";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState(85.5);
  const [tipPercent, setTipPercent] = useState(18);
  const [peopleCount, setPeopleCount] = useState(2);
  const [roundUp, setRoundUp] = useState(false);

  const { tipAmount, totalBill, perPersonAmount, tipPerPerson } = useMemo(() => {
    let tip = billAmount * (tipPercent / 100);
    let total = billAmount + tip;

    if (roundUp) {
      total = Math.ceil(total);
      tip = total - billAmount;
    }

    const perPerson = peopleCount > 0 ? total / peopleCount : 0;
    const tipEach = peopleCount > 0 ? tip / peopleCount : 0;

    return {
      tipAmount: Math.max(0, tip),
      totalBill: Math.max(0, total),
      perPersonAmount: Math.max(0, perPerson),
      tipPerPerson: Math.max(0, tipEach)
    };
  }, [billAmount, tipPercent, peopleCount, roundUp]);

  return (
    <CalculatorLayout
      title="Tip & Bill Splitter Calculator"
      description="Quickly calculate server tip percentages, total check amounts, and split the bill evenly between friends."
      iconName="Coffee"
      category="Calculators & Units"
      resultSummary={{
        label: `Total Per Person (${peopleCount} guests)`,
        value: `$${perPersonAmount.toFixed(2)}`,
        subtext: `Includes $${tipPerPerson.toFixed(2)} tip each`
      }}
      breakdown={[
        { label: "Original Bill Subtotal", value: `$${billAmount.toFixed(2)}` },
        { label: `Tip Total (${tipPercent}%)`, value: `$${tipAmount.toFixed(2)}`, color: "text-emerald-400" },
        { label: "Grand Total Check", value: `$${totalBill.toFixed(2)}` },
        { label: "Split Count", value: `${peopleCount} people` }
      ]}
      tips={[
        "Standard US restaurant tipping benchmarks: 15% (Fair), 18% (Good), 20% (Great), 25% (Exceptional).",
        "Enabling Round Up rounds the grand total up to the next full dollar for easy cash or card splitting."
      ]}
    >
      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Bill Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={billAmount}
            onChange={(e) => setBillAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Tip Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Tip Percentage: {tipPercent}%
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[10, 15, 18, 20, 25].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTipPercent(p)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  tipPercent === p ? "bg-purple-600 border-purple-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={35}
            step={1}
            value={tipPercent}
            onChange={(e) => setTipPercent(Number(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Split Between (Number of People)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800"
              >
                -
              </button>
              <div className="flex-1 text-center font-bold text-lg text-white">{peopleCount}</div>
              <button
                onClick={() => setPeopleCount((p) => p + 1)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800 select-none">
              <input
                type="checkbox"
                checked={roundUp}
                onChange={(e) => setRoundUp(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span className="text-sm font-semibold text-slate-300">Round Up Grand Total</span>
            </label>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
