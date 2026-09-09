"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Cake, Sparkles, Heart } from "lucide-react";

export default function DateToAgeConverterPage() {
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const birth = new Date(birthDate);
  const now = currentTime;

  // Age calculations
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = Math.max(0, now.getTime() - birth.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);

  // Next birthday calculation
  let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) {
    nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntilNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Zodiac sign
  const getZodiac = (month: number, day: number) => {
    const signs = [
      { name: "Capricorn ♑", cutoff: 20 },
      { name: "Aquarius ♒", cutoff: 19 },
      { name: "Pisces ♓", cutoff: 21 },
      { name: "Aries ♈", cutoff: 20 },
      { name: "Taurus ♉", cutoff: 21 },
      { name: "Gemini ♊", cutoff: 21 },
      { name: "Cancer ♋", cutoff: 23 },
      { name: "Leo ♌", cutoff: 23 },
      { name: "Virgo ♍", cutoff: 23 },
      { name: "Libra ♎", cutoff: 23 },
      { name: "Scorpio ♏", cutoff: 22 },
      { name: "Sagittarius ♐", cutoff: 22 }
    ];
    const prevMonth = (month + 11) % 12;
    return day < signs[month].cutoff ? signs[prevMonth].name : signs[month].name;
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
            <Cake className="w-3.5 h-3.5" />
            Converters & Dev
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Date to Age Converter
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Calculate your exact chronological age down to the second, plus next birthday countdown.
          </p>
        </div>

        {/* Date Input Box */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Your Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Hero Age Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/30 text-center space-y-4">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald-400">Current Age</div>
          <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            {years} <span className="text-2xl sm:text-3xl text-slate-400 font-semibold">Years</span>{" "}
            {months} <span className="text-2xl sm:text-3xl text-slate-400 font-semibold">Months</span>{" "}
            {days} <span className="text-2xl sm:text-3xl text-slate-400 font-semibold">Days</span>
          </div>
          <div className="text-sm font-mono text-slate-400 pt-2 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400 animate-spin" /> Live Ticking: {totalSeconds.toLocaleString()} seconds old
          </div>
        </div>

        {/* Life Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Total Months</div>
            <div className="text-2xl font-bold text-white mt-1">{(years * 12 + months).toLocaleString()}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Total Weeks</div>
            <div className="text-2xl font-bold text-white mt-1">{totalWeeks.toLocaleString()}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Total Days</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{totalDays.toLocaleString()}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Total Hours</div>
            <div className="text-2xl font-bold text-white mt-1">{totalHours.toLocaleString()}</div>
          </div>
        </div>

        {/* Bonus Highlights: Birthday & Zodiac */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Upcoming Birthday In</div>
              <div className="text-xl font-bold text-white">{daysUntilNext} Days</div>
              <div className="text-xs text-slate-500">{nextBday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Astrological Zodiac</div>
              <div className="text-xl font-bold text-white">{getZodiac(birth.getMonth(), birth.getDate())}</div>
              <div className="text-xs text-slate-500">Based on date of birth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
