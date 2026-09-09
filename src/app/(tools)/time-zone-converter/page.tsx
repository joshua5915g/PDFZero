"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRightLeft, Globe, Sun, Moon } from "lucide-react";

interface TimeZoneDef {
  label: string;
  tz: string;
  city: string;
}

const ZONES: TimeZoneDef[] = [
  { label: "New York (EDT/EST)", tz: "America/New_York", city: "New York" },
  { label: "London (BST/GMT)", tz: "Europe/London", city: "London" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo", city: "Tokyo" },
  { label: "Sydney (AEST)", tz: "Australia/Sydney", city: "Sydney" },
  { label: "San Francisco (PDT/PST)", tz: "America/Los_Angeles", city: "San Francisco" },
  { label: "Chicago (CDT/CST)", tz: "America/Chicago", city: "Chicago" },
  { label: "Paris / Berlin (CEST)", tz: "Europe/Paris", city: "Paris" },
  { label: "Dubai (GST)", tz: "Asia/Dubai", city: "Dubai" },
  { label: "Singapore / HK (SGT)", tz: "Asia/Singapore", city: "Singapore" },
  { label: "Mumbai / Delhi (IST)", tz: "Asia/Kolkata", city: "Mumbai" },
  { label: "São Paulo (BRT)", tz: "America/Sao_Paulo", city: "São Paulo" }
];

export default function TimeZoneConverterPage() {
  const [sourceTz, setSourceTz] = useState<string>("America/New_York");
  const [targetTz, setTargetTz] = useState<string>("Europe/London");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [hour, setHour] = useState<number>(12); // 0-23
  const [minute, setMinute] = useState<number>(0);

  // Format time in both zones
  const baseIso = `${selectedDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  
  const getTimeInZone = (tz: string) => {
    try {
      const d = new Date(baseIso);
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(d);
    } catch {
      return "Invalid date";
    }
  };

  const getHourInZone = (tz: string, h: number) => {
    try {
      const d = new Date(`${selectedDate}T${String(h).padStart(2, "0")}:00:00`);
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        hour12: true
      }).format(d);
    } catch {
      return `${h}:00`;
    }
  };

  const handleSwap = () => {
    setSourceTz(targetTz);
    setTargetTz(sourceTz);
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
            <Clock className="w-3.5 h-3.5" />
            Converters & Dev
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Time Zone Converter
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Compare meeting hours and schedule seamlessly across international timezones.
          </p>
        </div>

        {/* Interactive Dual Zone Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* Source Zone */}
            <div className="md:col-span-3 space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Origin Location</label>
              <select
                value={sourceTz}
                onChange={(e) => setSourceTz(e.target.value)}
                aria-label="Origin Timezone"
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {ZONES.map((z) => (
                  <option key={z.tz} value={z.tz}>
                    {z.label}
                  </option>
                ))}
              </select>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs text-slate-400">Local Time</div>
                <div className="text-2xl font-bold text-white mt-1">{getTimeInZone(sourceTz)}</div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={handleSwap}
                aria-label="Swap timezones"
                className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700 text-slate-300 transition-all hover:scale-105 active:scale-95"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Target Zone */}
            <div className="md:col-span-3 space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination Location</label>
              <select
                value={targetTz}
                onChange={(e) => setTargetTz(e.target.value)}
                aria-label="Destination Timezone"
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {ZONES.map((z) => (
                  <option key={z.tz} value={z.tz}>
                    {z.label}
                  </option>
                ))}
              </select>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                <div className="text-xs text-emerald-400">Destination Time</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{getTimeInZone(targetTz)}</div>
              </div>
            </div>
          </div>

          {/* Time Scrubber Slider */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Scrub Hour of Day: <span className="text-emerald-400 font-mono text-base">{String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Selected date"
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>12 AM (Midnight)</span>
              <span>6 AM</span>
              <span>12 PM (Noon)</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>
        </div>

        {/* 24-Hour Comparison Visual Strip */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" /> 24-Hour Overlap Comparison Table
          </h2>
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[700px] grid grid-cols-12 gap-1.5 text-center">
              {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((h) => {
                const isDay = h >= 8 && h <= 18;
                const isCurrent = hour === h || hour === h + 1;
                return (
                  <div
                    key={h}
                    onClick={() => setHour(h)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? "bg-emerald-500/20 border-emerald-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {isDay ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <div className="text-xs font-bold text-slate-200">{getHourInZone(sourceTz, h)}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">{getHourInZone(targetTz, h)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
