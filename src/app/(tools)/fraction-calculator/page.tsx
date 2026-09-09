"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export default function FractionCalculator() {
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);
  const [op, setOp] = useState<"+" | "-" | "*" | "/">("+");
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(5);

  const { resNum, resDen, mixedText, decimalVal } = useMemo(() => {
    if (den1 === 0 || den2 === 0) {
      return { resNum: 0, resDen: 1, mixedText: "Undefined (div by 0)", decimalVal: 0 };
    }

    let n = 0;
    let d = 1;

    if (op === "+") {
      n = num1 * den2 + num2 * den1;
      d = den1 * den2;
    } else if (op === "-") {
      n = num1 * den2 - num2 * den1;
      d = den1 * den2;
    } else if (op === "*") {
      n = num1 * num2;
      d = den1 * den2;
    } else if (op === "/") {
      if (num2 === 0) return { resNum: 0, resDen: 1, mixedText: "Cannot divide by 0", decimalVal: 0 };
      n = num1 * den2;
      d = den1 * num2;
    }

    if (d < 0) {
      n = -n;
      d = -d;
    }

    const divisor = gcd(n, d);
    const simpN = n / divisor;
    const simpD = d / divisor;

    // Mixed fraction string
    let mixed = "";
    const whole = Math.trunc(simpN / simpD);
    const rem = Math.abs(simpN % simpD);
    if (whole !== 0 && rem !== 0) {
      mixed = `${whole} ${rem}/${simpD}`;
    } else if (whole !== 0 && rem === 0) {
      mixed = `${whole}`;
    } else {
      mixed = `${simpN}/${simpD}`;
    }

    return {
      resNum: simpN,
      resDen: simpD,
      mixedText: mixed,
      decimalVal: simpN / simpD
    };
  }, [num1, den1, op, num2, den2]);

  return (
    <CalculatorLayout
      title="Fraction Calculator"
      description="Add, subtract, multiply, and divide fractions with automated lowest terms simplification."
      iconName="Divide"
      category="Calculators & Units"
      resultSummary={{
        label: "Simplified Result",
        value: `${resNum}/${resDen}`,
        subtext: `Mixed Number: ${mixedText} | Decimal: ${decimalVal.toFixed(4)}`
      }}
      breakdown={[
        { label: "Operation", value: `${num1}/${den1} ${op} ${num2}/${den2}` },
        { label: "Reduced Fraction", value: `${resNum}/${resDen}`, color: "text-emerald-400" },
        { label: "Mixed Fraction Representation", value: mixedText },
        { label: "Decimal Value", value: decimalVal.toFixed(6) }
      ]}
      tips={[
        "Fractions are automatically reduced using the Greatest Common Divisor (GCD).",
        "Denominator cannot equal 0."
      ]}
    >
      <div className="flex flex-wrap items-center justify-center gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value))}
            className="w-16 sm:w-20 px-2 py-2 text-center bg-slate-950 border border-slate-800 rounded-lg text-lg font-bold text-white focus:outline-none focus:border-purple-500"
          />
          <div className="w-16 sm:w-20 h-0.5 bg-slate-700" />
          <input
            type="number"
            value={den1}
            onChange={(e) => setDen1(Number(e.target.value))}
            className="w-16 sm:w-20 px-2 py-2 text-center bg-slate-950 border border-slate-800 rounded-lg text-lg font-bold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Operator Picker */}
        <div className="flex flex-col gap-1.5">
          {(["+", "-", "*", "/"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`w-9 h-9 rounded-lg font-black text-base flex items-center justify-center transition-all ${
                op === o ? "bg-purple-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {o === "*" ? "×" : o === "/" ? "÷" : o}
            </button>
          ))}
        </div>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value))}
            className="w-16 sm:w-20 px-2 py-2 text-center bg-slate-950 border border-slate-800 rounded-lg text-lg font-bold text-white focus:outline-none focus:border-purple-500"
          />
          <div className="w-16 sm:w-20 h-0.5 bg-slate-700" />
          <input
            type="number"
            value={den2}
            onChange={(e) => setDen2(Number(e.target.value))}
            className="w-16 sm:w-20 px-2 py-2 text-center bg-slate-950 border border-slate-800 rounded-lg text-lg font-bold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="text-2xl font-black text-slate-500">=</div>

        {/* Result Preview Box */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center min-w-[100px]">
          <div className="text-2xl font-black text-purple-300">{resNum}</div>
          <div className="w-full h-0.5 bg-purple-500/50 my-1" />
          <div className="text-2xl font-black text-purple-300">{resDen}</div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
