"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Volume2, Sparkles, Hourglass } from "lucide-react";

export default function PomodoroTimer() {
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MODES = {
    work: { label: "Focus Work", duration: 25 * 60, color: "text-amber-400", border: "border-amber-500/30" },
    shortBreak: { label: "Short Break", duration: 5 * 60, color: "text-emerald-400", border: "border-emerald-500/30" },
    longBreak: { label: "Long Rest", duration: 15 * 60, color: "text-blue-400", border: "border-blue-500/30" }
  };

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Ignore audio error
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playChime();
            if (mode === "work") {
              setSessionsCompleted((s) => s + 1);
              setMode("shortBreak");
              return 5 * 60;
            } else {
              setMode("work");
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const switchMode = (newMode: "work" | "shortBreak" | "longBreak") => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const totalDuration = MODES[mode].duration;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Business & Marketing</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Sparkles className="size-3" />
          Web Audio Bell Chimes
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md text-center">
        <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3 shadow-inner">
          <Hourglass className="size-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Pomodoro Focus Timer</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
          Boost your productivity using 25-minute focused work intervals followed by rest breaks.
        </p>
      </div>

      {/* Main Timer Display */}
      <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-3xl flex flex-col items-center space-y-8 shadow-2xl">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => switchMode("work")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === "work" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === "shortBreak" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === "longBreak" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Long Rest (15m)
          </button>
        </div>

        {/* Circular Progress Display */}
        <div className="relative size-64 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={mode === "work" ? "text-amber-500" : mode === "shortBreak" ? "text-emerald-500" : "text-blue-500"}
              strokeWidth="6"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-black text-white tracking-tight">{formattedTime}</span>
            <span className="text-xs uppercase font-bold text-slate-400 mt-2 tracking-widest">{MODES[mode].label}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl transition border border-slate-700"
          >
            <RotateCcw className="size-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-2xl font-bold text-sm transition flex items-center gap-2 shadow-xl ${
              isRunning
                ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-amber-500/20"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="size-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => switchMode(mode === "work" ? "shortBreak" : "work")}
            title="Skip to next session"
            className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl transition border border-slate-700"
          >
            <SkipForward className="size-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <div>Sessions Completed: <strong className="text-white">{sessionsCompleted}</strong></div>
          <div>•</div>
          <div>Total Focus Time: <strong className="text-white">{sessionsCompleted * 25} mins</strong></div>
        </div>
      </div>
    </div>
  );
}
