"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function CommissionCalculator() {
  const [salesVolume, setSalesVolume] = useState(85000);
  const [commissionRate, setCommissionRate] = useState(6.0); // %
  const [baseSalary, setBaseSalary] = useState(3000); // monthly base

  const { commissionEarned, totalPay, effectiveRate } = useMemo(() => {
    const commission = salesVolume * (commissionRate / 100);
    const total = baseSalary + commission;
    const rate = salesVolume > 0 ? (commission / salesVolume) * 100 : 0;

    return {
      commissionEarned: commission,
      totalPay: total,
      effectiveRate: isNaN(rate) ? 0 : rate
    };
  }, [salesVolume, commissionRate, baseSalary]);

  return (
    <CalculatorLayout
      title="Commission Calculator"
      description="Estimate sales rep commission payouts, tiered incentives, and monthly blended compensation."
      iconName="Award"
      category="Calculators & Units"
      resultSummary={{
        label: "Total Take-Home Compensation",
        value: `$${Math.round(totalPay).toLocaleString()}`,
        subtext: `Commission Earned: $${Math.round(commissionEarned).toLocaleString()}`
      }}
      breakdown={[
        { label: "Base Salary", value: `$${baseSalary.toLocaleString()}` },
        { label: "Commission Payout", value: `$${Math.round(commissionEarned).toLocaleString()}`, color: "text-emerald-400" },
        { label: "Total Sales Generated", value: `$${salesVolume.toLocaleString()}` },
        { label: "Commission Rate", value: `${commissionRate}%` }
      ]}
      tips={[
        "Use this calculator to project monthly or quarterly sales quota compensation plans.",
        "Add accelerators if your plan includes quota tier kickers."
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Total Sales Volume ($)
          </label>
          <input
            type="number"
            value={salesVolume}
            onChange={(e) => setSalesVolume(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Commission Rate (%)
          </label>
          <input
            type="number"
            step="0.5"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Base Salary ($)
          </label>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}
