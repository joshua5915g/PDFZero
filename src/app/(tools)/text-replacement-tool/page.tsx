"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";
import { Replace } from "lucide-react";

export default function TextReplacementTool() {
  const [input, setInput] = useState(
    "The quick brown fox jumps over the lazy dog. The fox was nimble and the dog was sleeping."
  );
  const [output, setOutput] = useState("");
  const [findStr, setFindStr] = useState("fox");
  const [replaceStr, setReplaceStr] = useState("cat");
  const [matchCase, setMatchCase] = useState(false);
  const [isRegex, setIsRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    if (!input || !findStr) {
      setOutput(input);
      setMatchCount(0);
      return;
    }

    try {
      let regex: RegExp;
      if (isRegex) {
        regex = new RegExp(findStr, matchCase ? "g" : "gi");
      } else {
        const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        regex = new RegExp(escaped, matchCase ? "g" : "gi");
      }

      const matches = input.match(regex);
      setMatchCount(matches ? matches.length : 0);
      setOutput(input.replace(regex, replaceStr));
    } catch {
      setOutput(input);
      setMatchCount(0);
    }
  }, [input, findStr, replaceStr, matchCase, isRegex]);

  return (
    <ConverterLayout
      title="Find & Replace Text"
      description="Find and replace text substrings or regular expression patterns across any document with occurrence counters."
      iconName="Replace"
      category="Converters & Dev"
      inputLabel="Original Source Text"
      outputLabel={`Replaced Output (${matchCount} replacements made)`}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      actionControls={
        <div className="flex flex-wrap items-center justify-between gap-4 w-full text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Find:</span>
              <input
                type="text"
                value={findStr}
                onChange={(e) => setFindStr(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono text-xs w-36"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Replace:</span>
              <input
                type="text"
                value={replaceStr}
                onChange={(e) => setReplaceStr(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono text-xs w-36"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded"
              />
              <span>Match Case</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isRegex}
                onChange={(e) => setIsRegex(e.target.checked)}
                className="rounded"
              />
              <span>Regular Expression</span>
            </label>
          </div>
        </div>
      }
      tips={[
        "Enable Regular Expression to use patterns like \\d+ for digits or \\s+ for whitespace sequences.",
        "Matches and replacement previews update automatically in real-time.",
        "Click Copy or Save to download the updated document."
      ]}
    />
  );
}
