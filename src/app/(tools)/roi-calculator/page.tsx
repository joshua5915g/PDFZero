"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function RoiCalculator() {
  const [investedAmount, setInvestedAmount] = useState(15000);
  const [returnedAmount, setReturnedAmount] = useState(24500);
  const [holdingYears, setHoldingYears] = useState(3);

  const { netProfit, roiPercent, annualizedRoi, multiple } = useMemo(() => {
    const profit = returnedAmount - investedAmount;
    const roi = investedAmount > 0 ? (profit / investedAmount) * 100 : 0;
    const mult = investedAmount > 0 ? returnedAmount / investedAmount : 0;

    let annualized = 0;
    if (investedAmount > 0 && returnedAmount > 0 && holdingYears > 0) {
      annualized = (Math.pow(returnedAmount / investedAmount, 1 / holdingYears) - 1) * 100;
    }

    return {
      netProfit: profit,
      roiPercent: isNaN(roi) ? 0 : roi,
      annualizedRoi: isNaN(annualized) ? 0 : annualized,
      multiple: isNaN(mult) ? 0 : mult
    };
  }, [investedAmount, returnedAmount, holdingYears]);

  return (
    <CalculatorLayout
      title="ROI Calculator"
      description="Calculate total return on investment (ROI), net earnings, investment multiple, and annualized CAGR."
      iconName="BarChart3"
      category="Calculators & Units"
      resultSummary={{
        label: "Total ROI",
        value: `${roiPercent.toFixed(2)}%`,
        subtext: `Annualized (CAGR): ${annualizedRoi.toFixed(2)}%/yr`
      }}
      breakdown={[
        { label: "Net Gain / Profit", value: `$${netProfit.toLocaleString()}`, color: netProfit >= 0 ? "text-emerald-400" : "text-red-400" },
        { label: "Investment Multiple", value: `${multiple.toFixed(2)}x` },
        { label: "Initial Outlay", value: `$${investedAmount.toLocaleString()}` },
        { label: "Total Final Proceeds", value: `$${returnedAmount.toLocaleString()}` },
        { label: "Investment Timeframe", value: `${holdingYears} Years` }
      ]}
      tips={[
        "ROI measures raw capital efficiency regardless of whether proceeds derive from dividends or capital gains.",
        "Annualized ROI (CAGR) normalizes performance across investments of differing durations."
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Amount Invested ($)
          </label>
          <input
            type="number"
            value={investedAmount}
            onChange={(e) => setInvestedAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Amount Returned / Value ($)
          </label>
          <input
            type="number"
            value={returnedAmount}
            onChange={(e) => setReturnedAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Holding Period (Years)
          </label>
          <input
            type="number"
            min={0.1}
            step={0.5}
            value={holdingYears}
            onChange={(e) => setHoldingYears(Math.max(0.1, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}
