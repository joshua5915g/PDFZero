"use client";

import React, { useState, useEffect } from "react";
import ConverterLayout from "@/components/tools/ConverterLayout";

export default function SqlFormatter() {
  const sampleSql = "select u.id, u.name, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.active = 1 and u.created_at >= '2024-01-01' group by u.id, u.name having count(o.id) > 5 order by total_orders desc limit 50;";
  const [input, setInput] = useState(sampleSql);
  const [output, setOutput] = useState("");
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);

  const formatSql = (sql: string) => {
    if (!sql.trim()) return "";
    
    // Core SQL keywords to indent and line-break
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", 
      "OUTER JOIN", "JOIN", "ON", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "OFFSET", 
      "UNION ALL", "UNION", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM"
    ];

    let formatted = sql.replace(/\s+/g, " ").trim();

    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(regex, (match) => {
        const replacement = uppercaseKeywords ? match.toUpperCase() : match.toLowerCase();
        return `\n${replacement}`;
      });
    });

    // Clean up indentations
    const lines = formatted.split("\n").map(l => l.trim()).filter(Boolean);
    const indentedLines = lines.map((line, idx) => {
      if (idx === 0) return line;
      if (/^(AND|OR|ON)\b/i.test(line)) {
        return `  ${line}`;
      }
      return line;
    });

    return indentedLines.join("\n");
  };

  useEffect(() => {
    setOutput(formatSql(input));
  }, [input, uppercaseKeywords]);

  return (
    <ConverterLayout
      title="SQL Formatter & Beautifier"
      description="Clean, indent, and standardize raw unformatted SQL statements into readable multi-line database queries."
      iconName="Database"
      category="Converters & Dev"
      inputLabel="Raw SQL Query"
      outputLabel="Beautified SQL Query"
      inputValue={input}
      outputValue={output}
      onInputChange={setInput}
      onClear={() => setInput("")}
      downloadFilename="query.sql"
      downloadMime="application/sql"
      actionControls={
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercaseKeywords}
              onChange={(e) => setUppercaseKeywords(e.target.checked)}
              className="rounded"
            />
            <span>Uppercase Keywords (SELECT, WHERE...)</span>
          </label>
        </div>
      }
      tips={[
        "Formats standard ANSI SQL, MySQL, PostgreSQL, SQLite, and Microsoft SQL Server.",
        "Indents clauses like JOIN, ON, AND, and OR for immediate visual scanability.",
        "Completely private client-side formatting — database structures are never logged."
      ]}
    />
  );
}
