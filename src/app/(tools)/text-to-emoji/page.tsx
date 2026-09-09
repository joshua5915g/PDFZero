"use client";

import React, { useState } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const WORD_TO_EMOJI: Record<string, string> = {
  love: "❤️",
  heart: "💖",
  fire: "🔥",
  lit: "🔥",
  happy: "😊",
  smile: "😄",
  cool: "😎",
  money: "💰",
  cash: "💵",
  car: "🚗",
  drive: "🚙",
  sun: "☀️",
  star: "⭐",
  moon: "🌙",
  coffee: "☕",
  tea: "🍵",
  beer: "🍺",
  pizza: "🍕",
  cat: "🐱",
  dog: "🐶",
  party: "🎉",
  rocket: "🚀",
  computer: "💻",
  code: "💻",
  music: "🎵",
  dance: "💃",
  book: "📚",
  idea: "💡",
  light: "💡",
  yes: "✅",
  no: "❌",
  sad: "😢",
  cry: "😭",
  laugh: "😂",
  lol: "🤣",
  clock: "⏰",
  time: "⏳",
  phone: "📱",
  game: "🎮"
};

export default function TextToEmojiPage() {
  const [input, setInput] = useState("I love drinking coffee while writing code on my computer");
  const [mode, setMode] = useState<"replace" | "blocks">("replace");

  const convert = (text: string) => {
    if (mode === "blocks") {
      return text
        .toUpperCase()
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            // Regional indicator symbol letter
            return String.fromCodePoint(0x1f1e6 + (code - 65)) + " ";
          }
          if (c === " ") return "   ";
          return c;
        })
        .join("");
    }

    // Word replacement
    const words = text.split(/(\s+|[.,!?])/);
    return words
      .map((w) => {
        const lower = w.toLowerCase();
        if (WORD_TO_EMOJI[lower]) {
          return `${w} ${WORD_TO_EMOJI[lower]}`;
        }
        return w;
      })
      .join("");
  };

  const output = convert(input);

  return (
    <ConverterLayout
      title="Text to Emoji Translator"
      description="Translate keywords into contextual emojis or render letters as giant regional letter block emojis."
      iconName="Smile"
      category="Design & Web Fun"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      inputLabel="Standard Text"
      outputLabel="Emoji Translated Output"
      downloadFilename="emoji-text.txt"
      actionControls={
        <div className="flex gap-2">
          <button
            onClick={() => setMode("replace")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mode === "replace" ? "bg-pink-600 border-pink-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            Contextual Emojis
          </button>
          <button
            onClick={() => setMode("blocks")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mode === "blocks" ? "bg-pink-600 border-pink-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            Regional Letter Blocks (🇦 🇧 🇨)
          </button>
        </div>
      }
      tips={[
        "Contextual mode detects over 40+ common English keywords and suffixes corresponding emojis.",
        "Regional Letter Blocks mode converts each alphabet letter into Discord/Slack letter block emojis."
      ]}
    />
  );
}
