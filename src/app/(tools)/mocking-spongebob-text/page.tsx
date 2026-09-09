"use client";

import React, { useState } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function MockingSpongebobTextPage() {
  const [input, setInput] = useState("Stop copying my homework and do it yourself!");

  // Convert to alternating / mocking caps
  const convert = (str: string) => {
    let result = "";
    let upper = false;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (/[a-zA-Z]/.test(char)) {
        result += upper ? char.toUpperCase() : char.toLowerCase();
        upper = !upper;
      } else {
        result += char;
      }
    }
    return result;
  };

  const output = convert(input);

  return (
    <ConverterLayout
      title="Mocking SpongeBob Text Generator"
      description="tRaNsFoRm YoUr TeXt InTo MoCkInG sPoNgEbOb CaPs FoR mEmEs AnD rOaStS."
      iconName="Smile"
      category="Design & Web Fun"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      inputLabel="Normal Input Text"
      outputLabel="mOcKiNg SpOnGeBoB rEsUlT"
      downloadFilename="spongebob-text.txt"
      tips={[
        "Letters alternate between lowercase and uppercase sequentially ignoring spaces and punctuation.",
        "Perfect for Twitter/X replies, meme formats, and sarcasm."
      ]}
    />
  );
}
