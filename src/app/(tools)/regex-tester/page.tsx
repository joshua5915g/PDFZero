"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, SearchCode, Check, AlertCircle, Sparkles } from "lucide-react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})");
  const [flags, setFlags] = useState("gm");
  const [testString, setTestString] = useState(
    "Contact our team at support@pdfzero.com or sales@enterprise.org for assistance."
  );

  const { matches, error, highlightedHtml } = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, highlightedHtml: testString };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: { match: string; index: number; groups: string[] }[] = [];
      let m: RegExpExecArray | null;

      if (flags.includes("g")) {
        while ((m = regex.exec(testString)) !== null) {
          allMatches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1)
          });
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testString);
        if (m) {
          allMatches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1)
          });
        }
      }

      // Generate highlighted HTML
      const escaped = testString.replace(/[&<>"']/g, (m) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[m]!));
      
      const safeRegex = new RegExp(pattern, flags);
      const highlighted = escaped.replace(safeRegex, (match) => {
        return `<mark class="bg-emerald-500/30 text-emerald-200 px-1 py-0.5 rounded font-bold border border-emerald-500/50">${match}</mark>`;
      });

      return { matches: allMatches, error: null, highlightedHtml: highlighted };
    } catch (err: any) {
      return { matches: [], error: err.message, highlightedHtml: testString };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Converters & Dev</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <Sparkles className="size-3" />
          Real-time Match Groups
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <SearchCode className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Regex Tester & Visualizer</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Test JavaScript regular expressions with instant highlighting, capture groups, and flag controls.
            </p>
          </div>
        </div>
      </div>

      {/* Regex Pattern Input Bar */}
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg text-emerald-400 font-bold">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="regular expression pattern..."
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
          />
          <span className="font-mono text-lg text-emerald-400 font-bold">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2.5 text-emerald-300 font-mono text-sm text-center"
          />
        </div>

        {/* Flag toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Flags:</span>
          {[
            { id: "g", label: "Global (g)" },
            { id: "i", label: "Case Insensitive (i)" },
            { id: "m", label: "Multiline (m)" },
            { id: "s", label: "Dot All (s)" },
            { id: "u", label: "Unicode (u)" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFlag(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                flags.includes(f.id)
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 pt-1">
            <AlertCircle className="size-3.5" />
            <span>Invalid regex: {error}</span>
          </div>
        )}
      </div>

      {/* Test String & Live Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Input */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs font-semibold text-slate-400">
            Test String
          </div>
          <textarea
            rows={8}
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="p-4 bg-transparent text-slate-200 text-sm font-mono focus:outline-none resize-none flex-grow min-h-[220px]"
          />
        </div>

        {/* Highlighted Match Output */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Match Highlighter</span>
            <span className="text-emerald-400 font-bold">{matches.length} Matches Found</span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className="p-4 text-slate-200 text-sm font-mono whitespace-pre-wrap flex-grow min-h-[220px] bg-slate-950/40 overflow-y-auto"
          />
        </div>
      </div>

      {/* Capture Groups Breakdown Table */}
      {matches.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Captured Match Information
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Match</th>
                  <th className="py-2 px-3">Index</th>
                  <th className="py-2 px-3">Captured Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {matches.map((m, idx) => (
                  <tr key={idx} className="text-slate-300">
                    <td className="py-2 px-3 font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 text-emerald-400 font-semibold">{m.match}</td>
                    <td className="py-2 px-3 text-slate-400">{m.index}</td>
                    <td className="py-2 px-3">
                      {m.groups.length > 0 ? (
                        <div className="flex gap-2">
                          {m.groups.map((grp, gIdx) => (
                            <span key={gIdx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px]">
                              ${gIdx + 1}: {grp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-600">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
