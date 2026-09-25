"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, ArrowRightLeft, Sparkles } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature" | "volume" | "time";

interface UnitDef {
  id: string;
  name: string;
  factor: number; // relative to base unit
}

const UNITS: Record<UnitCategory, { name: string; base: string; units: UnitDef[] }> = {
  length: {
    name: "Length & Distance",
    base: "m",
    units: [
      { id: "m", name: "Meters (m)", factor: 1 },
      { id: "km", name: "Kilometers (km)", factor: 1000 },
      { id: "cm", name: "Centimeters (cm)", factor: 0.01 },
      { id: "mm", name: "Millimeters (mm)", factor: 0.001 },
      { id: "miles", name: "Miles (mi)", factor: 1609.344 },
      { id: "feet", name: "Feet (ft)", factor: 0.3048 },
      { id: "inch", name: "Inches (in)", factor: 0.0254 },
      { id: "yard", name: "Yards (yd)", factor: 0.9144 }
    ]
  },
  weight: {
    name: "Weight & Mass",
    base: "kg",
    units: [
      { id: "kg", name: "Kilograms (kg)", factor: 1 },
      { id: "grams", name: "Grams (g)", factor: 0.001 },
      { id: "mg", name: "Milligrams (mg)", factor: 0.000001 },
      { id: "lbs", name: "Pounds (lbs)", factor: 0.45359237 },
      { id: "oz", name: "Ounces (oz)", factor: 0.028349523125 },
      { id: "ton", name: "Metric Ton (t)", factor: 1000 }
    ]
  },
  temperature: {
    name: "Temperature",
    base: "c",
    units: [
      { id: "c", name: "Celsius (°C)", factor: 1 },
      { id: "f", name: "Fahrenheit (°F)", factor: 1 },
      { id: "k", name: "Kelvin (K)", factor: 1 }
    ]
  },
  volume: {
    name: "Volume & Liquid",
    base: "l",
    units: [
      { id: "liters", name: "Liters (L)", factor: 1 },
      { id: "ml", name: "Milliliters (mL)", factor: 0.001 },
      { id: "gallons", name: "US Gallons (gal)", factor: 3.78541 },
      { id: "floz", name: "Fluid Ounces (fl oz)", factor: 0.0295735 },
      { id: "cups", name: "US Cups", factor: 0.236588 }
    ]
  },
  time: {
    name: "Time",
    base: "s",
    units: [
      { id: "seconds", name: "Seconds (s)", factor: 1 },
      { id: "minutes", name: "Minutes (min)", factor: 60 },
      { id: "hours", name: "Hours (hr)", factor: 3600 },
      { id: "days", name: "Days (d)", factor: 86400 },
      { id: "weeks", name: "Weeks", factor: 604800 }
    ]
  }
};

export default function UniversalUnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [val, setVal] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState("miles");
  const [toUnit, setToUnit] = useState("km");

  // Sync default units on category change
  useEffect(() => {
    const list = UNITS[category].units;
    setFromUnit(list[0].id);
    setToUnit(list[1]?.id || list[0].id);
  }, [category]);

  const convert = () => {
    if (isNaN(val)) return 0;
    if (category === "temperature") {
      let celsius = val;
      if (fromUnit === "f") celsius = ((val - 32) * 5) / 9;
      if (fromUnit === "k") celsius = val - 273.15;

      if (toUnit === "c") return celsius;
      if (toUnit === "f") return (celsius * 9) / 5 + 32;
      if (toUnit === "k") return celsius + 273.15;
      return celsius;
    }

    const currentCat = UNITS[category];
    const fromFactor = currentCat.units.find((u) => u.id === fromUnit)?.factor || 1;
    const toFactor = currentCat.units.find((u) => u.id === toUnit)?.factor || 1;

    const baseValue = val * fromFactor;
    return baseValue / toFactor;
  };

  const result = convert();

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-purple-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Calculators & Units</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <Sparkles className="size-3" />
          Precision Metric & Imperial
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
            <Scale className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Universal Unit Converter</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Convert length, distance, weight, temperature, volume, and time between metric and imperial systems.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(UNITS) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              category === cat
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10"
                : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {UNITS[cat].name}
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Source Input */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-400">From</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-lg font-mono font-bold focus:outline-none focus:border-purple-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
            >
              {UNITS[category].units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              title="Swap units"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-full transition border border-slate-700 hover:scale-110 active:scale-95"
            >
              <ArrowRightLeft className="size-5" />
            </button>
          </div>

          {/* Target Output */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-400">To (Calculated)</label>
            <div className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl p-3 text-purple-300 text-lg font-mono font-black overflow-x-auto">
              {Number(result.toFixed(6)).toString()}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
            >
              {UNITS[category].units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Reference Equivalents */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            All Equivalents for {val} {UNITS[category].units.find(u => u.id === fromUnit)?.name}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            {UNITS[category].units
              .filter((u) => u.id !== fromUnit)
              .map((u) => {
                let eq = 0;
                if (category === "temperature") {
                  let celsius = val;
                  if (fromUnit === "f") celsius = ((val - 32) * 5) / 9;
                  if (fromUnit === "k") celsius = val - 273.15;
                  if (u.id === "c") eq = celsius;
                  if (u.id === "f") eq = (celsius * 9) / 5 + 32;
                  if (u.id === "k") eq = celsius + 273.15;
                } else {
                  const fromFactor = UNITS[category].units.find((x) => x.id === fromUnit)?.factor || 1;
                  eq = (val * fromFactor) / u.factor;
                }
                return (
                  <div key={u.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">{u.name}</span>
                    <span className="text-slate-200 font-bold">{Number(eq.toFixed(4)).toString()}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
