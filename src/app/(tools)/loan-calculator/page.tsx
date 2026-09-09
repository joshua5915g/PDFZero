"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [termMonths, setTermMonths] = useState(60);

  const { monthlyPayment, totalInterest, totalPayment } = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = termMonths;
    let payment = 0;
    if (r > 0 && n > 0) {
      payment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      payment = loanAmount / n;
    }
    const total = payment * n;
    const interest = total - loanAmount;

    return {
      monthlyPayment: isNaN(payment) ? 0 : payment,
      totalInterest: isNaN(interest) ? 0 : interest,
      totalPayment: isNaN(total) ? 0 : total
    };
  }, [loanAmount, interestRate, termMonths]);

  return (
    <CalculatorLayout
      title="Loan Calculator"
      description="Calculate fixed monthly payments and total interest costs for auto, personal, or installment loans."
      iconName="CreditCard"
      category="Calculators & Units"
      resultSummary={{
        label: "Estimated Monthly Payment",
        value: `$${Math.round(monthlyPayment).toLocaleString()}/mo`,
        subtext: `Total repayment: $${Math.round(totalPayment).toLocaleString()}`
      }}
      breakdown={[
        { label: "Principal Borrowed", value: `$${loanAmount.toLocaleString()}` },
        { label: "Total Interest Cost", value: `$${Math.round(totalInterest).toLocaleString()}`, color: "text-amber-400" },
        { label: "Loan Duration", value: `${termMonths} months (${(termMonths / 12).toFixed(1)} years)` },
        { label: "Annual APR", value: `${interestRate}%` }
      ]}
      tips={[
        "Paying an extra 10% each month can shorten your payoff term significantly.",
        "Ensure there are no prepayment penalties if you plan to retire the loan early."
      ]}
    >
      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Interest Rate (APR %)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Term (Months)
            </label>
            <select
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              aria-label="Loan Term in Months"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            >
              <option value={12}>12 Months (1 Year)</option>
              <option value={24}>24 Months (2 Years)</option>
              <option value={36}>36 Months (3 Years)</option>
              <option value={48}>48 Months (4 Years)</option>
              <option value={60}>60 Months (5 Years)</option>
              <option value={72}>72 Months (6 Years)</option>
              <option value={84}>84 Months (7 Years)</option>
            </select>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
