"use client";

import React, { useState } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function VaporwaveTextPage() {
  const [input, setInput] = useState("Vaporwave Aesthetic Dreams 1984");

  // Fullwidth conversion (ASCII 33-126 to 0xFF01 - 0xFF5E)
  const toVaporwave = (str: string) => {
    return str
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code === 32) return "  "; // double space
        if (code >= 33 && code <= 126) {
          return String.fromCharCode(code + 0xfee0);
        }
        return char;
      })
      .join("");
  };

  const output = toVaporwave(input);

  return (
    <ConverterLayout
      title="Vaporwave Aesthetic Text Generator"
      description="Ｃｏｎｖｅｒｔ  ｙｏｕｒ  ｔｅｘｔ  ｉｎｔｏ  ｗｉｄｅ  ｆｕｌｌｗｉｄｔｈ  ｖａｐｏｒｗａｖｅ  ａｅｓｔｈｅｔｉｃｓ."
      iconName="Sparkles"
      category="Design & Web Fun"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      inputLabel="Normal Input Text"
      outputLabel="Ｆｕｌｌｗｉｄｔｈ  Ｖａｐｏｒｗａｖｅ  Ｒｅｓｕｌｔ"
      downloadFilename="vaporwave.txt"
      tips={[
        "Converts standard Latin alphabet characters to East Asian Fullwidth Unicode characters.",
        "Adds double spacing between words for maximum retro 80s/90s cyber aesthetic."
      ]}
    />
  );
}
