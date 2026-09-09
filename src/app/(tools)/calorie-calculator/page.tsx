"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(28);
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(178);
  const [activity, setActivity] = useState<number>(1.375); // Light activity

  const { bmr, tdee, loseWeight, mildLoss, gainWeight } = useMemo(() => {
    // Mifflin-St Jeor Equation
    let bmrVal = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmrVal = gender === "male" ? bmrVal + 5 : bmrVal - 161;

    const maintenance = bmrVal * activity;
    return {
      bmr: Math.round(bmrVal),
      tdee: Math.round(maintenance),
      mildLoss: Math.round(maintenance - 250),
      loseWeight: Math.round(maintenance - 500),
      gainWeight: Math.round(maintenance + 500)
    };
  }, [gender, age, weightKg, heightCm, activity]);

  return (
    <CalculatorLayout
      title="Calorie & TDEE Calculator"
      description="Estimate your Basal Metabolic Rate (BMR) and daily calorie intake for weight loss, maintenance, or muscle gain."
      iconName="Flame"
      category="Calculators & Units"
      resultSummary={{
        label: "Daily Maintenance Calories (TDEE)",
        value: `${tdee.toLocaleString()} kcal/day`,
        subtext: `Basal Metabolic Rate (BMR): ${bmr.toLocaleString()} kcal`
      }}
      breakdown={[
        { label: "Weight Loss (-1 lb / 0.5 kg per week)", value: `${loseWeight.toLocaleString()} kcal/day`, color: "text-emerald-400" },
        { label: "Mild Weight Loss (-0.5 lb per week)", value: `${mildLoss.toLocaleString()} kcal/day` },
        { label: "Weight Maintenance", value: `${tdee.toLocaleString()} kcal/day` },
        { label: "Muscle Gain (+1 lb per week)", value: `${gainWeight.toLocaleString()} kcal/day`, color: "text-blue-400" }
      ]}
      tips={[
        "A deficit of ~500 calories per day typically results in roughly 1 pound of fat loss per week.",
        "Ensure protein intake remains around 0.8-1.0g per pound of body weight to preserve lean muscle."
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Gender</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  gender === "male" ? "bg-purple-600 border-purple-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  gender === "female" ? "bg-purple-600 border-purple-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Math.max(12, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Math.max(100, Number(e.target.value)))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value))}
            aria-label="Activity Level"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          >
            <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
            <option value={1.375}>Lightly Active (Light exercise 1-3 days/week)</option>
            <option value={1.55}>Moderately Active (Moderate exercise 3-5 days/week)</option>
            <option value={1.725}>Very Active (Hard exercise 6-7 days/week)</option>
            <option value={1.9}>Extremely Active (Athletic training / physical labor)</option>
          </select>
        </div>
      </div>
    </CalculatorLayout>
  );
}
