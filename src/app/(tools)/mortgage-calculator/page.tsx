"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState(5000);
  const [homeInsuranceYearly, setHomeInsuranceYearly] = useState(1400);
  const [hoaMonthly, setHoaMonthly] = useState(0);

  const loanAmount = Math.max(0, homePrice - downPayment);
  const downPaymentPercent = homePrice > 0 ? ((downPayment / homePrice) * 100).toFixed(1) : 0;

  const { monthlyPrincipalInterest, totalPaymentMonthly, totalInterestPaid, totalLoanCost } = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    let pi = 0;
    if (monthlyRate > 0) {
      pi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
           (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      pi = loanAmount / totalPayments;
    }

    const monthlyTax = propertyTaxYearly / 12;
    const monthlyInsurance = homeInsuranceYearly / 12;
    const totalMonthly = pi + monthlyTax + monthlyInsurance + hoaMonthly;

    const totalInterest = pi * totalPayments - loanAmount;
    const totalCost = pi * totalPayments + downPayment + (propertyTaxYearly + homeInsuranceYearly) * loanTermYears;

    return {
      monthlyPrincipalInterest: isNaN(pi) ? 0 : pi,
      totalPaymentMonthly: isNaN(totalMonthly) ? 0 : totalMonthly,
      totalInterestPaid: isNaN(totalInterest) ? 0 : totalInterest,
      totalLoanCost: isNaN(totalCost) ? 0 : totalCost
    };
  }, [loanAmount, downPayment, interestRate, loanTermYears, propertyTaxYearly, homeInsuranceYearly, hoaMonthly]);

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Estimate monthly mortgage payments including principal, interest, property taxes, homeowner's insurance, and HOA fees."
      iconName="Home"
      category="Calculators & Units"
      resultSummary={{
        label: "Estimated Monthly Payment",
        value: `$${Math.round(totalPaymentMonthly).toLocaleString()}/mo`,
        subtext: `Principal & Interest: $${Math.round(monthlyPrincipalInterest).toLocaleString()}`
      }}
      breakdown={[
        { label: "Loan Principal", value: `$${loanAmount.toLocaleString()}` },
        { label: "Down Payment", value: `$${downPayment.toLocaleString()} (${downPaymentPercent}%)` },
        { label: "Total Interest Paid (Life of Loan)", value: `$${Math.round(totalInterestPaid).toLocaleString()}`, color: "text-amber-400" },
        { label: "Monthly Property Tax", value: `$${Math.round(propertyTaxYearly / 12).toLocaleString()}` },
        { label: "Monthly Homeowners Insurance", value: `$${Math.round(homeInsuranceYearly / 12).toLocaleString()}` },
        { label: "Total Cost of Home & Loan", value: `$${Math.round(totalLoanCost).toLocaleString()}`, color: "text-emerald-400" }
      ]}
      tips={[
        "Putting down at least 20% eliminates the need for Private Mortgage Insurance (PMI).",
        "A 15-year fixed loan significantly reduces total lifetime interest compared to a 30-year term.",
        "Include local property taxes and HOA dues for an accurate monthly cashflow estimate."
      ]}
    >
      <div className="space-y-4 text-xs text-slate-300">
        <div>
          <div className="flex justify-between mb-1">
            <label className="font-semibold text-slate-300">Home Price: ${homePrice.toLocaleString()}</label>
          </div>
          <input
            type="range"
            min="50000"
            max="2000000"
            step="10000"
            value={homePrice}
            onChange={(e) => setHomePrice(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="font-semibold text-slate-300">Down Payment: ${downPayment.toLocaleString()} ({downPaymentPercent}%)</label>
          </div>
          <input
            type="range"
            min="0"
            max={homePrice}
            step="5000"
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Loan Term</label>
            <select
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
            >
              <option value="15">15 Years (Fixed)</option>
              <option value="20">20 Years (Fixed)</option>
              <option value="30">30 Years (Fixed)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-slate-400 mb-1">Property Tax / yr</label>
            <input
              type="number"
              value={propertyTaxYearly}
              onChange={(e) => setPropertyTaxYearly(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Home Insurance / yr</label>
            <input
              type="number"
              value={homeInsuranceYearly}
              onChange={(e) => setHomeInsuranceYearly(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">HOA Fee / mo</label>
            <input
              type="number"
              value={hoaMonthly}
              onChange={(e) => setHoaMonthly(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
            />
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
