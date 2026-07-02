"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Table2, Download } from "lucide-react";
import DropZone from "@/components/ui/DropZone";

export default function ExtractTable() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    setFile(files[0]);
    setTableData(null);
    setCsvUrl(null);
  };

  const extractTable = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      
      // Simple table extraction by parsing text content
      const table: string[][] = [];
      
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        
        // Group text items by Y coordinate to form rows
        const items = content.items.filter(item => 'str' in item);
        const rows: {[key: number]: string[]} = {};
        
        items.forEach(item => {
          if ('str' in item && 'y' in item) {
            const y = Math.round(item.y as number);
            if (!rows[y]) rows[y] = [];
            rows[y].push(item.str);
          }
        });

        // Convert to rows
        Object.keys(rows).sort((a, b) => parseInt(b) - parseInt(a)).forEach(y => {
          table.push(rows[parseInt(y)]);
        });
      }

      if (table.length > 0) {
        setTableData(table);
        
        // Convert to CSV
        const csv = table.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        setCsvUrl(url);
      }
    } catch (err) {
      console.error("Error extracting table:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <Table2 className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Extract Table</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Extract tables from PDFs and export as CSV.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drop PDF here"
            description="Select PDF with table data"
            onFilesSelected={handleFileSelected}
            maxFiles={1}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{file.name}</p>
            <button
              onClick={extractTable}
              disabled={isProcessing}
              className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? "Extracting..." : "Extract Table"}
            </button>
          </div>
        )}

        {tableData && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Extracted Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {tableData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b">
                      {row.slice(0, 5).map((cell, j) => (
                        <td key={j} className="px-2 py-1 border border-gray-300 bg-gray-50">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tableData.length > 10 && <p className="text-xs text-gray-500">... and {tableData.length - 10} more rows</p>}
          </div>
        )}

        {csvUrl && (
          <a
            href={csvUrl}
            download="extracted-table.csv"
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
          >
            <Download className="size-4" />
            Download CSV
          </a>
        )}
      </div>
    </main>
  );
}
