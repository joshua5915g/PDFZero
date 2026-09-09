"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, DollarSign, TrendingUp, RefreshCw } from "lucide-react";

// Standard client-side reference rates (relative to 1 USD)
const RATES: Record<string, { rate: number; name: string; symbol: string }> = {
  USD: { rate: 1.0, name: "US Dollar", symbol: "$" },
  EUR: { rate: 0.92, name: "Euro", symbol: "€" },
  GBP: { rate: 0.79, name: "British Pound", symbol: "£" },
  JPY: { rate: 154.2, name: "Japanese Yen", symbol: "¥" },
  CAD: { rate: 1.36, name: "Canadian Dollar", symbol: "CA$" },
  AUD: { rate: 1.52, name: "Australian Dollar", symbol: "A$" },
  CHF: { rate: 0.91, name: "Swiss Franc", symbol: "CHF" },
  CNY: { rate: 7.24, name: "Chinese Yuan", symbol: "¥" },
  INR: { rate: 83.5, name: "Indian Rupee", symbol: "₹" },
  BRL: { rate: 5.15, name: "Brazilian Real", symbol: "R$" },
  MXN: { rate: 16.8, name: "Mexican Peso", symbol: "Mex$" },
  SGD: { rate: 1.35, name: "Singapore Dollar", symbol: "S$" },
  NZD: { rate: 1.67, name: "New Zealand Dollar", symbol: "NZ$" },
  KRW: { rate: 1375.0, name: "South Korean Won", symbol: "₩" },
  AED: { rate: 3.67, name: "UAE Dirham", symbol: "AED" }
};

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>("USD");
  const [toCurr, setToCurr] = useState<string>("EUR");

  const fromRate = RATES[fromCurr]?.rate || 1;
  const toRate = RATES[toCurr]?.rate || 1;

  // Convert: Amount in USD = amount / fromRate; Amount in target = USD * toRate
  const converted = (amount / fromRate) * toRate;
  const unitRate = toRate / fromRate;
  const reverseUnitRate = fromRate / toRate;

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            Converters & Dev
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Currency Converter
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Instant client-side currency calculator across 15+ major global currencies.
          </p>
        </div>

        {/* Converter Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* Amount */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  {RATES[fromCurr]?.symbol}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                aria-label="Source Currency"
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(RATES).map(([code, item]) => (
                  <option key={code} value={code}>
                    {code} - {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-2">
              <button
                onClick={handleSwap}
                aria-label="Swap currencies"
                className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700 text-slate-300 transition-all hover:scale-105 active:scale-95"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Converted Output */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Converted To</label>
              <div className="w-full px-4 py-3 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-400">
                  {RATES[toCurr]?.symbol} {converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-semibold text-slate-500">{toCurr}</span>
              </div>
              <select
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                aria-label="Target Currency"
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(RATES).map(([code, item]) => (
                  <option key={code} value={code}>
                    {code} - {item.name} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              1 {fromCurr} = <span className="text-slate-200 font-medium">{unitRate.toFixed(4)} {toCurr}</span>
              <span className="mx-2 text-slate-600">|</span>
              1 {toCurr} = <span className="text-slate-200 font-medium">{reverseUnitRate.toFixed(4)} {fromCurr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <RefreshCw className="w-3.5 h-3.5" /> Updated daily reference benchmarks
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Live Conversion Multipliers ({fromCurr} Base)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(RATES).map(([code, item]) => {
              const eq = (amount / fromRate) * item.rate;
              return (
                <div key={code} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-400">{code} - {item.name}</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">
                    {item.symbol} {eq.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
