"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function SalaryCalculator() {
  const [amount, setAmount] = useState(75000);
  const [period, setPeriod] = useState<"hourly" | "weekly" | "monthly" | "annually">("annually");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  // Compute annualized total
  let annual = 0;
  if (period === "hourly") {
    annual = amount * hoursPerWeek * weeksPerYear;
  } else if (period === "weekly") {
    annual = amount * weeksPerYear;
  } else if (period === "monthly") {
    annual = amount * 12;
  } else {
    annual = amount;
  }

  const monthly = annual / 12;
  const biweekly = annual / 26;
  const weekly = annual / weeksPerYear;
  const daily = annual / (weeksPerYear * 5);
  const hourly = annual / (weeksPerYear * hoursPerWeek);

  return (
    <CalculatorLayout
      title="Salary & Wage Calculator"
      description="Convert compensation between hourly wages, weekly pay, bi-weekly paychecks, monthly income, and annual salary."
      iconName="DollarSign"
      category="Calculators & Units"
      resultSummary={{
        label: "Annual Equivalent Salary",
        value: `$${Math.round(annual).toLocaleString()}/year`,
        subtext: `Equivalent to $${hourly.toFixed(2)}/hour`
      }}
      breakdown={[
        { label: "Hourly Wage", value: `$${hourly.toFixed(2)} / hour`, color: "text-amber-400" },
        { label: "Daily Rate (8 hrs)", value: `$${daily.toFixed(2)} / day` },
        { label: "Weekly Pay", value: `$${weekly.toFixed(2)} / week` },
        { label: "Bi-Weekly Paycheck", value: `$${biweekly.toFixed(2)} / 2 weeks`, color: "text-emerald-400" },
        { label: "Monthly Gross Income", value: `$${monthly.toFixed(2)} / month`, color: "text-purple-400" }
      ]}
      tips={[
        "Standard US full-time employment assumes 2,080 working hours per year (40 hrs/wk * 52 wks).",
        "Bi-weekly schedules yield 26 paychecks per year instead of 24 monthly checks.",
        "Calculations represent gross income before federal, state, and payroll tax deductions."
      ]}
    >
      <div className="space-y-4 text-xs text-slate-300">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Enter Compensation Amount</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white font-bold text-base focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1.5">Pay Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "hourly", label: "Per Hour" },
              { id: "weekly", label: "Per Week" },
              { id: "monthly", label: "Per Month" },
              { id: "annually", label: "Per Year" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`py-2 px-3 rounded-xl font-bold transition text-xs ${
                  period === p.id
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-slate-400 mb-1">Hours Per Week: {hoursPerWeek}</label>
            <input
              type="range"
              min="10"
              max="80"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Weeks Per Year: {weeksPerYear}</label>
            <input
              type="range"
              min="40"
              max="52"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
