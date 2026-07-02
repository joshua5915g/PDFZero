"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import * as XLSX from "xlsx";

export default function PdfToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [processedExcelUrl, setProcessedExcelUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setProcessedExcelUrl(null);
      
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        setPageCount(doc.numPages);
      } catch (err) {
        console.error("Error reading page count:", err);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setProcessedExcelUrl(null);
    setPageCount(null);
  };

  const convertToExcel = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Extracting layout text lines from PDF...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDFJS
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      const rowsData: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Extracting tabular rows from page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let lastY = -1;
        let currentRow: string[] = [];

        textContent.items.forEach((item: any) => {
          const currentY = item.transform[5];
          
          // Detect row spacing to push columns
          if (lastY !== -1 && Math.abs(currentY - lastY) > 8) {
            if (currentRow.length > 0) {
              rowsData.push(currentRow);
              currentRow = [];
            }
          }
          currentRow.push(item.str);
          lastY = currentY;
        });

        if (currentRow.length > 0) {
          rowsData.push(currentRow);
        }
      }

      setStatus("Generating Excel Workbook sheet...");
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rowsData);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
      
      // Write workbook bytes
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      setProcessedExcelUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error converting PDF to Excel: " + (err instanceof Error ? err.message : String(err)));
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="size-6 text-[#2B87EB]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">PDF to Excel</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Parse structured data from your PDF tables and export them directly into editable Microsoft Excel XLSX sheets.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a document to extract tables to Excel format"
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2 truncate">
                <FileText className="size-4 text-[#7E84A3] shrink-0" />
                <span className="text-xs font-bold truncate text-[#2C2C2A] dark:text-[#F1F3F9]">
                  {file.name}
                </span>
                {pageCount && (
                  <span className="text-[10px] text-gray-500 font-semibold">
                    ({pageCount} pages)
                  </span>
                )}
              </div>
              <button 
                onClick={clearAll} 
                className="text-xs text-[#E25B45] hover:underline font-semibold"
                disabled={isProcessing}
              >
                Change File
              </button>
            </div>

            {/* Execute Trigger */}
            {!isProcessing && !processedExcelUrl && (
              <button 
                onClick={convertToExcel}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Convert to Excel
              </button>
            )}

            {isProcessing && (
              <div className="space-y-2 py-2">
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6366F1] animate-pulse w-full" />
                </div>
                <p className="text-center text-xs text-gray-500 font-semibold">{status}</p>
              </div>
            )}

            {/* Result Box */}
            {processedExcelUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully converted to Excel!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedExcelUrl}
                    download="table_data.xlsx"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download Excel XLSX
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Convert Another File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
