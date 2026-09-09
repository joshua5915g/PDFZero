"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  
  // Imperial: lbs, feet, inches
  const [weightLbs, setWeightLbs] = useState(165);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(10);

  // Metric: kg, cm
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(178);

  let bmi = 0;
  if (unit === "imperial") {
    const totalInches = feet * 12 + inches;
    if (totalInches > 0) {
      bmi = (703 * weightLbs) / (totalInches * totalInches);
    }
  } else {
    const meters = heightCm / 100;
    if (meters > 0) {
      bmi = weightKg / (meters * meters);
    }
  }

  const roundedBmi = parseFloat(bmi.toFixed(1));

  let category = "Normal weight";
  let catColor = "text-emerald-400";
  if (roundedBmi < 18.5) {
    category = "Underweight";
    catColor = "text-amber-400";
  } else if (roundedBmi >= 25 && roundedBmi < 30) {
    category = "Overweight";
    catColor = "text-amber-400";
  } else if (roundedBmi >= 30) {
    category = "Obese";
    catColor = "text-red-400";
  }

  // Ideal weight range for height
  let idealMin = 0;
  let idealMax = 0;
  if (unit === "imperial") {
    const totalInches = feet * 12 + inches;
    idealMin = Math.round((18.5 * totalInches * totalInches) / 703);
    idealMax = Math.round((24.9 * totalInches * totalInches) / 703);
  } else {
    const meters = heightCm / 100;
    idealMin = Math.round(18.5 * meters * meters);
    idealMax = Math.round(24.9 * meters * meters);
  }

  return (
    <CalculatorLayout
      title="BMI Calculator"
      description="Calculate Body Mass Index (BMI), health classification, and optimal target weight ranges according to World Health Organization criteria."
      iconName="HeartPulse"
      category="Calculators & Units"
      resultSummary={{
        label: "Your Body Mass Index (BMI)",
        value: roundedBmi.toString(),
        subtext: `Classification: ${category}`
      }}
      breakdown={[
        { label: "Weight Category", value: category, color: catColor },
        { label: "Optimal Healthy Weight", value: unit === "imperial" ? `${idealMin} - ${idealMax} lbs` : `${idealMin} - ${idealMax} kg`, color: "text-emerald-400" },
        { label: "Underweight Threshold", value: "< 18.5 BMI" },
        { label: "Normal Range", value: "18.5 - 24.9 BMI" },
        { label: "Overweight Range", value: "25.0 - 29.9 BMI" },
        { label: "Obese Range", value: "≥ 30.0 BMI" }
      ]}
      tips={[
        "BMI is a screening tool based on height and weight, widely used by physicians.",
        "Athletes with higher muscle density may have elevated BMIs without excess body fat.",
        "Maintaining a BMI between 18.5 and 24.9 is associated with reduced cardiovascular risk."
      ]}
    >
      <div className="space-y-4 text-xs text-slate-300">
        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setUnit("imperial")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              unit === "imperial" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Imperial (lbs, ft, in)
          </button>
          <button
            onClick={() => setUnit("metric")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              unit === "metric" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Metric (kg, cm)
          </button>
        </div>

        {unit === "imperial" ? (
          <>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Weight: {weightLbs} lbs</label>
              <input
                type="range"
                min="70"
                max="400"
                value={weightLbs}
                onChange={(e) => setWeightLbs(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Height (Feet)</label>
                <input
                  type="number"
                  min="3"
                  max="7"
                  value={feet}
                  onChange={(e) => setFeet(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Height (Inches)</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={inches}
                  onChange={(e) => setInches(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Weight: {weightKg} kg</label>
              <input
                type="range"
                min="30"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Height: {heightCm} cm</label>
              <input
                type="range"
                min="100"
                max="230"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </CalculatorLayout>
  );
}
