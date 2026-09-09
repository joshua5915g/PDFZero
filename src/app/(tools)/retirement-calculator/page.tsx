"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(800);
  const [annualReturn, setAnnualReturn] = useState(7.0);

  const { yearsToGrow, retirementNestEgg, safeAnnualWithdrawal, safeMonthlyWithdrawal } = useMemo(() => {
    const years = Math.max(0, retirementAge - currentAge);
    const r = annualReturn / 100 / 12;
    const months = years * 12;

    let balance = currentSavings;
    for (let m = 0; m < months; m++) {
      balance = balance * (1 + r) + monthlyContribution;
    }

    const annualWithdrawal = balance * 0.04; // Standard 4% rule
    const monthlyWithdrawal = annualWithdrawal / 12;

    return {
      yearsToGrow: years,
      retirementNestEgg: Math.max(0, balance),
      safeAnnualWithdrawal: Math.max(0, annualWithdrawal),
      safeMonthlyWithdrawal: Math.max(0, monthlyWithdrawal)
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);

  return (
    <CalculatorLayout
      title="Retirement Calculator"
      description="Plan your financial independence with the Trinity Study 4% rule and compound growth projections."
      iconName="ShieldCheck"
      category="Calculators & Units"
      resultSummary={{
        label: `Projected Nest Egg at Age ${retirementAge}`,
        value: `$${Math.round(retirementNestEgg).toLocaleString()}`,
        subtext: `Safe 4% Rule Income: $${Math.round(safeMonthlyWithdrawal).toLocaleString()}/month`
      }}
      breakdown={[
        { label: "Years Until Retirement", value: `${yearsToGrow} Years` },
        { label: "Current Portfolio Balance", value: `$${currentSavings.toLocaleString()}` },
        { label: "Monthly Savings Contribution", value: `$${monthlyContribution.toLocaleString()}/mo` },
        { label: "Safe Annual Passive Income (4%)", value: `$${Math.round(safeAnnualWithdrawal).toLocaleString()}/year`, color: "text-emerald-400" },
        { label: "Assumed Annual Return", value: `${annualReturn}%` }
      ]}
      tips={[
        "The 4% withdrawal rule is designed to preserve capital across a 30-year retirement period without depletion.",
        "Increasing your monthly contribution by just $100 adds significant compounded dollars over 20+ years."
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Current Age: {currentAge}
            </label>
            <input
              type="range"
              min={18}
              max={80}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Retirement Target Age: {retirementAge}
            </label>
            <input
              type="range"
              min={Math.max(currentAge + 1, 40)}
              max={90}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Current Savings ($)
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
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
      </div>
    </CalculatorLayout>
  );
}
