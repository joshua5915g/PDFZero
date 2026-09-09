"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState(60);
  const [revenue, setRevenue] = useState(100);

  const { grossProfit, marginPercent, markupPercent } = useMemo(() => {
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      grossProfit: profit,
      marginPercent: isNaN(margin) ? 0 : margin,
      markupPercent: isNaN(markup) ? 0 : markup
    };
  }, [cost, revenue]);

  return (
    <CalculatorLayout
      title="Profit Margin Calculator"
      description="Compute gross profit margin, markup percentage, and net cash profit per item or deal."
      iconName="Percent"
      category="Calculators & Units"
      resultSummary={{
        label: "Gross Profit Margin",
        value: `${marginPercent.toFixed(2)}%`,
        subtext: `Markup: ${markupPercent.toFixed(2)}%`
      }}
      breakdown={[
        { label: "Unit Cost (COGS)", value: `$${cost.toLocaleString()}` },
        { label: "Selling Price / Revenue", value: `$${revenue.toLocaleString()}` },
        { label: "Gross Profit Dollar Amount", value: `$${grossProfit.toLocaleString()}`, color: grossProfit >= 0 ? "text-emerald-400" : "text-red-400" },
        { label: "Markup on Cost", value: `${markupPercent.toFixed(1)}%` }
      ]}
      tips={[
        "Margin is profit divided by revenue, whereas markup is profit divided by cost.",
        "A 50% markup corresponds to a 33.3% gross profit margin."
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Cost of Goods Sold (COGS $)
          </label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Selling Price / Revenue ($)
          </label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}
