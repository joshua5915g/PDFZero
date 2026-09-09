"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function CsvToJson() {
  const [direction, setDirection] = useState<"csv2json" | "json2csv">("csv2json");
  const sampleCsv = `id,name,role,department\n1,Alice Johnson,Lead Architect,Engineering\n2,Bob Smith,Product Designer,Design\n3,Charlie Brown,Security Engineer,SecOps`;
  const [input, setInput] = useState(sampleCsv);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (direction === "csv2json") {
        // Simple client-side CSV parser
        const lines = input.trim().split("\n");
        if (lines.length === 0) return;
        const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
        const data = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
          const obj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            obj[h] = values[idx] || "";
          });
          return obj;
        });
        setOutput(JSON.stringify(data, null, 2));
        setError(null);
      } else {
        // JSON to CSV
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("JSON must be an array of objects to convert to CSV.");
        }
        const headers = Object.keys(parsed[0]);
        const csvRows = [headers.join(",")];
        parsed.forEach((row) => {
          const values = headers.map((h) => {
            const val = row[h] !== undefined ? String(row[h]) : "";
            return val.includes(",") ? `"${val}"` : val;
          });
          csvRows.push(values.join(","));
        });
        setOutput(csvRows.join("\n"));
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  }, [input, direction]);

  return (
    <ConverterLayout
      title="CSV ↔ JSON Converter"
      description="Convert spreadsheet tabular CSV data into structured JSON objects and arrays, or turn JSON arrays back into CSV."
      iconName="FileSpreadsheet"
      category="Converters & Dev"
      inputLabel={direction === "csv2json" ? "CSV Data Input" : "JSON Array Input"}
      outputLabel={direction === "csv2json" ? "JSON Output" : "CSV Output"}
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      onSwap={() => {
        setDirection(direction === "csv2json" ? "json2csv" : "csv2json");
        setInput(output);
      }}
      downloadFilename={direction === "csv2json" ? "data.json" : "data.csv"}
      downloadMime={direction === "csv2json" ? "application/json" : "text/csv"}
      errorMessage={error}
      actionControls={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection("csv2json")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              direction === "csv2json"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CSV to JSON
          </button>
          <button
            onClick={() => setDirection("json2csv")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              direction === "json2csv"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            JSON to CSV
          </button>
        </div>
      }
      tips={[
        "The first row of CSV data is automatically extracted as object keys for JSON.",
        "When converting JSON to CSV, input must be an array of uniform objects.",
        "Everything executes in your local browser sandbox."
      ]}
    />
  );
}
