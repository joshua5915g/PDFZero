"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function SalesTaxCalculator() {
  const [mode, setMode] = useState<"add" | "reverse">("add");
  const [amount, setAmount] = useState(120);
  const [taxRate, setTaxRate] = useState(8.25);

  let preTax = 0;
  let taxAmount = 0;
  let totalWithTax = 0;

  if (mode === "add") {
    preTax = amount;
    taxAmount = (preTax * taxRate) / 100;
    totalWithTax = preTax + taxAmount;
  } else {
    totalWithTax = amount;
    preTax = totalWithTax / (1 + taxRate / 100);
    taxAmount = totalWithTax - preTax;
  }

  return (
    <CalculatorLayout
      title="Sales Tax Calculator"
      description="Add sales tax to an item's net price, or reverse-calculate the pre-tax base cost and VAT from a gross receipt total."
      iconName="Percent"
      category="Calculators & Units"
      resultSummary={{
        label: mode === "add" ? "Total Price (Including Tax)" : "Original Net Price (Before Tax)",
        value: mode === "add" ? `$${totalWithTax.toFixed(2)}` : `$${preTax.toFixed(2)}`,
        subtext: `Tax Amount (${taxRate}%): $${taxAmount.toFixed(2)}`
      }}
      breakdown={[
        { label: "Net Pre-Tax Amount", value: `$${preTax.toFixed(2)}` },
        { label: `Tax Rate Applied`, value: `${taxRate}%` },
        { label: "Calculated Tax Amount", value: `$${taxAmount.toFixed(2)}`, color: "text-amber-400" },
        { label: "Final Total (Net + Tax)", value: `$${totalWithTax.toFixed(2)}`, color: "text-emerald-400" }
      ]}
      tips={[
        "Use 'Add Tax' when pricing items for retail or preparing quotes for clients.",
        "Use 'Reverse Tax' when examining a receipt to separate the actual product cost from the sales tax.",
        "Standard US state sales taxes range from 0% (in Oregon/Delaware) to over 9.5% with local surcharges."
      ]}
    >
      <div className="space-y-4 text-xs text-slate-300">
        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode("add")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              mode === "add" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Add Tax to Price
          </button>
          <button
            onClick={() => setMode("reverse")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              mode === "reverse" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Reverse Tax from Total
          </button>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            {mode === "add" ? "Base Price Before Tax" : "Total Price Paid (With Tax)"}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Sales Tax Rate: {taxRate}%</label>
          <input
            type="range"
            min="0"
            max="25"
            step="0.25"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}
