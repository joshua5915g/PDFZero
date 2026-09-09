"use client";

import React, { useState } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

const FLIP_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
  k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
  u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ",
  K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ò", R: "ᴚ", S: "S", T: "⊥",
  U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "'": ",", "\"": "„", "!": "¡", "?": "¿", "(": ")", ")": "(", "[": "]", "]": "[",
  "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾"
};

export default function UpsideDownTextPage() {
  const [input, setInput] = useState("Hello world! Flip this text upside down.");

  const flip = (str: string) => {
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
      const char = str[i];
      result += FLIP_MAP[char] || char;
    }
    return result;
  };

  const output = flip(input);

  return (
    <ConverterLayout
      title="Upside Down Text Generator"
      description="Flip your sentences and words upside-down and backwards (˙uʍop ǝpᴉsdn) using Unicode glyphs."
      iconName="RotateCw"
      category="Design & Web Fun"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      inputLabel="Standard Text"
      outputLabel="Upside Down Output"
      downloadFilename="upside-down.txt"
      tips={[
        "Uses international Unicode upside-down character mappings so text can be copied anywhere.",
        "Reverses character order so sentences read correctly when rotated 180 degrees."
      ]}
    />
  );
}
