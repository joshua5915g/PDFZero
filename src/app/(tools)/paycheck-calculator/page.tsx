"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function PaycheckCalculator() {
  const [grossSalary, setGrossSalary] = useState(85000);
  const [payFrequency, setPayFrequency] = useState<"biweekly" | "semimonthly" | "monthly" | "weekly">("biweekly");
  const [stateTaxRate, setStateTaxRate] = useState(5.0);
  const [retirementContribution, setRetirementContribution] = useState(6.0); // % 401k

  const { paychecksPerYear, grossPerCheck, federalTax, ficaTax, stateTax, retirementAmount, netPayPerCheck, annualNet } = useMemo(() => {
    const periods = {
      weekly: 52,
      biweekly: 26,
      semimonthly: 24,
      monthly: 12
    }[payFrequency];

    const grossPeriod = grossSalary / periods;
    const retirementPeriod = grossPeriod * (retirementContribution / 100);
    const taxablePeriod = grossPeriod - retirementPeriod;

    // Approximate US federal effective progressive bracket
    let fedRate = 0.12;
    if (grossSalary > 100000) fedRate = 0.18;
    if (grossSalary > 180000) fedRate = 0.24;

    const fedPeriod = taxablePeriod * fedRate;
    const ficaPeriod = grossPeriod * 0.0765; // 6.2% SS + 1.45% Medicare
    const statePeriod = taxablePeriod * (stateTaxRate / 100);

    const netPeriod = grossPeriod - (fedPeriod + ficaPeriod + statePeriod + retirementPeriod);
    const netYear = netPeriod * periods;

    return {
      paychecksPerYear: periods,
      grossPerCheck: grossPeriod,
      federalTax: fedPeriod,
      ficaTax: ficaPeriod,
      stateTax: statePeriod,
      retirementAmount: retirementPeriod,
      netPayPerCheck: Math.max(0, netPeriod),
      annualNet: Math.max(0, netYear)
    };
  }, [grossSalary, payFrequency, stateTaxRate, retirementContribution]);

  return (
    <CalculatorLayout
      title="Paycheck Calculator"
      description="Estimate net take-home salary after Federal income tax, FICA, State taxes, and 401(k) deductions."
      iconName="DollarSign"
      category="Calculators & Units"
      resultSummary={{
        label: `Net Take-Home Pay (${payFrequency})`,
        value: `$${Math.round(netPayPerCheck).toLocaleString()}`,
        subtext: `Annual Net: $${Math.round(annualNet).toLocaleString()}`
      }}
      breakdown={[
        { label: "Gross Pay per Check", value: `$${Math.round(grossPerCheck).toLocaleString()}` },
        { label: "Federal Income Tax (Est.)", value: `-$${Math.round(federalTax).toLocaleString()}`, color: "text-red-400" },
        { label: "FICA (Social Security & Medicare)", value: `-$${Math.round(ficaTax).toLocaleString()}`, color: "text-red-400" },
        { label: `State Income Tax (${stateTaxRate}%)`, value: `-$${Math.round(stateTax).toLocaleString()}`, color: "text-red-400" },
        { label: `401(k) Retirement (${retirementContribution}%)`, value: `-$${Math.round(retirementAmount).toLocaleString()}`, color: "text-blue-400" }
      ]}
      tips={[
        "Pre-tax 401(k) contributions reduce your federally taxable gross income.",
        "Your final W-2 withholdings may adjust based on specific W-4 allowances."
      ]}
    >
      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Annual Gross Salary ($)
          </label>
          <input
            type="number"
            value={grossSalary}
            onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Pay Frequency
            </label>
            <select
              value={payFrequency}
              onChange={(e) => setPayFrequency(e.target.value as any)}
              aria-label="Pay Frequency"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            >
              <option value="biweekly">Bi-Weekly (26/yr)</option>
              <option value="semimonthly">Semi-Monthly (24/yr)</option>
              <option value="monthly">Monthly (12/yr)</option>
              <option value="weekly">Weekly (52/yr)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              State Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={stateTaxRate}
              onChange={(e) => setStateTaxRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              401(k) Pre-Tax (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={retirementContribution}
              onChange={(e) => setRetirementContribution(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
