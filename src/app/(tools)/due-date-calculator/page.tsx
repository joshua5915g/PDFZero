"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function DueDateCalculator() {
  const [method, setMethod] = useState<"lmp" | "conception">("lmp");
  // Default to 8 weeks ago
  const defaultDate = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [cycleLength, setCycleLength] = useState(28);

  const parsedDate = new Date(selectedDate);
  
  // Calculate due date (280 days from LMP adjusted for cycle length)
  const cycleDiff = cycleLength - 28;
  const daysToAdd = method === "lmp" ? 280 + cycleDiff : 266;
  const dueDate = new Date(parsedDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  // Current gestational age
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
  const gestationalDays = method === "lmp" ? diffDays : diffDays + 14;
  const gestationalWeeks = Math.max(0, Math.floor(gestationalDays / 7));
  const remainingDays = Math.max(0, gestationalDays % 7);

  // Trimesters
  const firstTrimesterEnd = new Date(parsedDate.getTime() + 13 * 7 * 24 * 60 * 60 * 1000);
  const secondTrimesterEnd = new Date(parsedDate.getTime() + 27 * 7 * 24 * 60 * 60 * 1000);

  return (
    <CalculatorLayout
      title="Pregnancy Due Date Calculator"
      description="Estimate expected delivery date, gestational age, and trimester timelines from your last menstrual period or conception date."
      iconName="Baby"
      category="Calculators & Units"
      resultSummary={{
        label: "Estimated Due Date",
        value: dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        subtext: `Current Gestational Age: ${gestationalWeeks} weeks, ${remainingDays} days`
      }}
      breakdown={[
        { label: "Calculation Method", value: method === "lmp" ? "Last Menstrual Period" : "Conception Date" },
        { label: "End of 1st Trimester (Week 13)", value: firstTrimesterEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
        { label: "End of 2nd Trimester (Week 27)", value: secondTrimesterEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
        { label: "Full Term Delivery (Week 40)", value: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), color: "text-emerald-400" }
      ]}
      tips={[
        "Standard Naegele's rule assumes a 28-day cycle with ovulation occurring around day 14.",
        "Most babies are born between 37 and 42 weeks of gestation.",
        "Your healthcare provider will confirm this estimated date via early ultrasound measurements."
      ]}
    >
      <div className="space-y-4 text-xs text-slate-300">
        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMethod("lmp")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              method === "lmp" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            First Day of Last Period
          </button>
          <button
            onClick={() => setMethod("conception")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              method === "conception" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Conception Date
          </button>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            {method === "lmp" ? "Date of First Day of Last Period" : "Known Conception Date"}
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {method === "lmp" && (
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Average Menstrual Cycle Length: {cycleLength} days
            </label>
            <input
              type="range"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
