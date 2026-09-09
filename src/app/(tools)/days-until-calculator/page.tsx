"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function DaysUntilCalculator() {
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split("T")[0];
  });

  const { totalDays, businessDays, weekendDays, weeks, isPast } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let busDays = 0;
    let wkndDays = 0;
    const cur = new Date(today);
    const step = days >= 0 ? 1 : -1;

    for (let i = 0; i < Math.abs(days); i++) {
      cur.setDate(cur.getDate() + step);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        wkndDays++;
      } else {
        busDays++;
      }
    }

    return {
      totalDays: days,
      businessDays: busDays,
      weekendDays: wkndDays,
      weeks: (Math.abs(days) / 7).toFixed(1),
      isPast: days < 0
    };
  }, [targetDate]);

  const setHoliday = (month: number, day: number) => {
    const now = new Date();
    let year = now.getFullYear();
    const candidate = new Date(year, month, day);
    if (candidate < now) {
      year += 1;
    }
    const target = new Date(year, month, day);
    setTargetDate(target.toISOString().split("T")[0]);
  };

  return (
    <CalculatorLayout
      title="Days Until Calculator"
      description="Calculate the exact count of calendar days, business work days, and weeks until any future date."
      iconName="Calendar"
      category="Calculators & Units"
      resultSummary={{
        label: isPast ? "Days Since Date" : "Days Remaining",
        value: `${Math.abs(totalDays)} Days`,
        subtext: `${businessDays} Business Days | ${weekendDays} Weekend Days`
      }}
      breakdown={[
        { label: "Total Calendar Days", value: `${Math.abs(totalDays)} Days` },
        { label: "Working Days (Mon - Fri)", value: `${businessDays} Days`, color: "text-emerald-400" },
        { label: "Weekend Days (Sat - Sun)", value: `${weekendDays} Days` },
        { label: "Total Weeks Equivalent", value: `${weeks} Weeks` }
      ]}
      tips={[
        "Business days exclude Saturdays and Sundays to help you plan project sprint deadlines.",
        "Click any quick holiday preset below to instantly jump to upcoming major calendar milestones."
      ]}
    >
      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select Target Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Quick Holiday Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Holiday Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setHoliday(11, 25)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300"
            >
              🎄 Christmas (Dec 25)
            </button>
            <button
              type="button"
              onClick={() => setHoliday(0, 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300"
            >
              🎆 New Year (Jan 1)
            </button>
            <button
              type="button"
              onClick={() => setHoliday(9, 31)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300"
            >
              🎃 Halloween (Oct 31)
            </button>
            <button
              type="button"
              onClick={() => setHoliday(6, 4)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300"
            >
              🇺🇸 4th of July
            </button>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
