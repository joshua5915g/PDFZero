"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Timer, Play, Pause, RotateCcw, Bell } from "lucide-react";

export default function CountdownTimerPage() {
  const [eventName, setEventName] = useState("New Year Launch");
  const [targetDateTime, setTargetDateTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDateTime).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, totalMs: diff });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
            <Timer className="w-3.5 h-3.5" />
            Calculators & Units
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Countdown Timer
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Set custom countdowns for product releases, deadlines, holidays, and milestones.
          </p>
        </div>

        {/* Inputs */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Target Date & Time
            </label>
            <input
              type="datetime-local"
              value={targetDateTime}
              onChange={(e) => setTargetDateTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Big Display */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-purple-500/10 via-slate-900 to-slate-950 border border-purple-500/30 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{eventName}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-4xl sm:text-6xl font-black text-purple-400 font-mono">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-2">Days</div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-4xl sm:text-6xl font-black text-purple-400 font-mono">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-2">Hours</div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-4xl sm:text-6xl font-black text-purple-400 font-mono">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-2">Minutes</div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-4xl sm:text-6xl font-black text-purple-400 font-mono animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-2">Seconds</div>
            </div>
          </div>

          {timeLeft.totalMs === 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-lg animate-bounce">
              🎉 Countdown Complete! The event has arrived!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
