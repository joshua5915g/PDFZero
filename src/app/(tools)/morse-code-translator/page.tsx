"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";
import { Volume2 } from "lucide-react";

const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
  6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----", " ": "/"
};

const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_MAP).reduce(
  (acc, [k, v]) => ({ ...acc, [v]: k }),
  {}
);

export default function MorseCodeTranslator() {
  const [direction, setDirection] = useState<"text2morse" | "morse2text">("text2morse");
  const [input, setInput] = useState("SOS WE NEED PDF TOOLS");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    if (direction === "text2morse") {
      const upper = input.toUpperCase();
      const morse = upper
        .split("")
        .map((c) => MORSE_MAP[c] || c)
        .join(" ");
      setOutput(morse);
    } else {
      const tokens = input.trim().split(/\s+/);
      const text = tokens
        .map((t) => REVERSE_MORSE[t] || (t === "/" ? " " : t))
        .join("");
      setOutput(text);
    }
  }, [input, direction]);

  const playMorseAudio = () => {
    const morseStr = direction === "text2morse" ? output : input;
    if (!morseStr) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dotTime = 0.08;
      let curTime = audioCtx.currentTime;

      for (const char of morseStr) {
        if (char === "." || char === "-") {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.value = 600;
          osc.connect(gain);
          gain.connect(audioCtx.destination);

          const dur = char === "." ? dotTime : dotTime * 3;
          osc.start(curTime);
          osc.stop(curTime + dur);
          curTime += dur + dotTime;
        } else if (char === " ") {
          curTime += dotTime * 2;
        } else if (char === "/") {
          curTime += dotTime * 5;
        }
      }
    } catch {
      // Audio error fallback
    }
  };

  return (
    <ConverterLayout
      title="Morse Code Translator"
      description="Translate English text to Morse code signals and decode Morse code back to readable text with audio playback."
      iconName="Radio"
      category="Converters & Dev"
      inputLabel={direction === "text2morse" ? "English Text Input" : "Morse Code Input (.-)"}
      outputLabel={direction === "text2morse" ? "Morse Code Output" : "English Text Output"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setDirection(direction === "text2morse" ? "morse2text" : "text2morse");
        setInput(output);
      }}
      actionControls={
        <div className="flex items-center justify-between w-full text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setDirection("text2morse")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                direction === "text2morse" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Text to Morse
            </button>
            <button
              onClick={() => setDirection("morse2text")}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                direction === "morse2text" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Morse to Text
            </button>
          </div>

          <button
            onClick={playMorseAudio}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition"
          >
            <Volume2 className="size-3.5 text-emerald-400" />
            <span>Play Audio Beeps</span>
          </button>
        </div>
      }
      tips={[
        "Dots (.) represent short signals, dashes (-) represent long signals (3x duration).",
        "Words are separated by slashes (/) or triple spaces.",
        "Click Play Audio Beeps to hear authentic 600Hz telegraph signals generated in real-time."
      ]}
    />
  );
}
