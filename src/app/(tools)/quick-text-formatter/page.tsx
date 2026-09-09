"use client";

import React, { useState } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function QuickTextFormatter() {
  const [input, setInput] = useState("Hello world! Welcome to PDFZero 160 free tools.");
  const [output, setOutput] = useState("");

  const transform = (type: string) => {
    switch (type) {
      case "upper":
        setOutput(input.toUpperCase());
        break;
      case "lower":
        setOutput(input.toLowerCase());
        break;
      case "title":
        setOutput(
          input.toLowerCase().replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase())
        );
        break;
      case "sentence":
        setOutput(
          input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        );
        break;
      case "camel":
        setOutput(
          input
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        );
        break;
      case "kebab":
        setOutput(
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        );
        break;
      case "snake":
        setOutput(
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
        );
        break;
      case "pascal":
        setOutput(
          input
            .toLowerCase()
            .replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, chr) => chr.toUpperCase())
        );
        break;
      case "constant":
        setOutput(
          input
            .toUpperCase()
            .trim()
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
        );
        break;
      case "reverse":
        setOutput(input.split("").reverse().join(""));
        break;
      default:
        setOutput(input);
    }
  };

  React.useEffect(() => {
    transform("upper");
  }, [input]);

  return (
    <ConverterLayout
      title="Text Case Formatter"
      description="Convert text cases instantly: UPPERCASE, lowercase, Title Case, camelCase, kebab-case, snake_case, PascalCase, and reverse."
      iconName="Type"
      category="Converters & Dev"
      inputLabel="Input Text"
      outputLabel="Formatted Text Output"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      actionControls={
        <div className="flex flex-wrap gap-2 w-full text-xs">
          {[
            { id: "upper", label: "UPPERCASE" },
            { id: "lower", label: "lowercase" },
            { id: "title", label: "Title Case" },
            { id: "sentence", label: "Sentence case" },
            { id: "camel", label: "camelCase" },
            { id: "kebab", label: "kebab-case" },
            { id: "snake", label: "snake_case" },
            { id: "pascal", label: "PascalCase" },
            { id: "constant", label: "CONSTANT_CASE" },
            { id: "reverse", label: "esreveR txeT" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => transform(btn.id)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition"
            >
              {btn.label}
            </button>
          ))}
        </div>
      }
      tips={[
        "kebab-case and snake_case are perfect for generating URL slugs and database column identifiers.",
        "camelCase and PascalCase are standard naming conventions in JavaScript, TypeScript, and Java.",
        "Title Case capitalizes the first letter of each word according to publishing standards."
      ]}
    />
  );
}
