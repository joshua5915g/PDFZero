"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(8.0);

  const { endBalance, totalDeposited, totalInterest } = useMemo(() => {
    const r = annualReturn / 100 / 12;
    const months = years * 12;

    let balance = initialAmount;
    let deposited = initialAmount;

    for (let m = 0; m < months; m++) {
      balance = balance * (1 + r) + monthlyContribution;
      deposited += monthlyContribution;
    }

    const interest = balance - deposited;

    return {
      endBalance: Math.max(0, balance),
      totalDeposited: Math.max(0, deposited),
      totalInterest: Math.max(0, interest)
    };
  }, [initialAmount, monthlyContribution, years, annualReturn]);

  return (
    <CalculatorLayout
      title="Investment Calculator"
      description="Forecast compound interest returns, portfolio growth, and monthly recurring investment power over time."
      iconName="TrendingUp"
      category="Calculators & Units"
      resultSummary={{
        label: `Projected Value in ${years} Years`,
        value: `$${Math.round(endBalance).toLocaleString()}`,
        subtext: `Total Interest Earned: $${Math.round(totalInterest).toLocaleString()}`
      }}
      breakdown={[
        { label: "Initial Starting Capital", value: `$${initialAmount.toLocaleString()}` },
        { label: "Total Out-of-Pocket Deposits", value: `$${Math.round(totalDeposited).toLocaleString()}` },
        { label: "Compound Growth & Interest", value: `$${Math.round(totalInterest).toLocaleString()}`, color: "text-emerald-400" },
        { label: "Monthly Contribution", value: `$${monthlyContribution.toLocaleString()}/mo` },
        { label: "Expected Annual Growth", value: `${annualReturn}%` }
      ]}
      tips={[
        "The S&P 500 has historically returned approximately 9-10% annually before inflation over 30-year spans.",
        "Starting early gives compounding exponential leverage on your terminal wealth."
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Initial Principal ($)
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Time Horizon (Years): {years}
            </label>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Estimated Annual Return (%): {annualReturn}%
            </label>
            <input
              type="range"
              min={1}
              max={18}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
