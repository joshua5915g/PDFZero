"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FormInput, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

interface FormFieldData {
  name: string;
  type: "text" | "checkbox" | "select" | "unknown";
  value: string | boolean;
  options?: string[];
}

export default function PdfForms() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setProcessedPdfUrl(null);
      setFields([]);
      
      setIsProcessing(true);
      setStatus("Analyzing interactive PDF form fields...");
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();
        const rawFields = form.getFields();

        const mappedFields: FormFieldData[] = rawFields.map((field) => {
          const name = field.getName();
          
          // Identify type robustly by function presence
          if (typeof (field as any).setText === "function") {
            const val = (field as any).getText() || "";
            return { name, type: "text", value: val };
          } else if (typeof (field as any).check === "function") {
            const val = (field as any).isChecked() || false;
            return { name, type: "checkbox", value: val };
          } else if (typeof (field as any).select === "function") {
            // Dropdown / Option list
            const val = (field as any).getSelected() || "";
            const options = (field as any).getOptions() || [];
            return { name, type: "select", value: val, options };
          }
          return { name, type: "unknown", value: "" };
        });

        setFields(mappedFields.filter((f) => f.type !== "unknown"));
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        alert("Error parsing PDF fields: " + (err instanceof Error ? err.message : String(err)));
        setFile(null);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setProcessedPdfUrl(null);
    setFields([]);
  };

  const handleFieldValueChange = (name: string, value: string | boolean) => {
    setFields((prev) =>
      prev.map((f) => (f.name === name ? { ...f, value } : f))
    );
  };

  const fillFormAndDownload = async () => {
    if (!file || fields.length === 0) return;
    setIsProcessing(true);
    setStatus("Loading PDF structure...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      setStatus("Baking values into PDF form fields...");
      fields.forEach((field) => {
        const pdfField = form.getField(field.name);
        if (field.type === "text" && typeof (pdfField as any).setText === "function") {
          (pdfField as any).setText(field.value as string);
        } else if (field.type === "checkbox" && typeof (pdfField as any).check === "function") {
          if (field.value) {
            (pdfField as any).check();
          } else {
            (pdfField as any).uncheck();
          }
        } else if (field.type === "select" && typeof (pdfField as any).select === "function") {
          (pdfField as any).select(field.value as string);
        }
      });

      setStatus("Finalizing PDF structure...");
      const filledBytes = await pdfDoc.save();
      const blob = new Blob([filledBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error generating PDF: " + (err instanceof Error ? err.message : String(err)));
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
          <FormInput className="size-6 text-[#4CAF50]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">PDF Forms</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Parse interactive form fields from your PDF, fill out values using clean input controls, and generate the filled PDF.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF form file here"
            description="Select an interactive PDF to fill out fields"
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
                {fields.length > 0 && (
                  <span className="text-[10px] text-gray-500 font-semibold">
                    ({fields.length} interactive fields detected)
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

            {/* Form Fields Inputs */}
            {fields.length > 0 && !processedPdfUrl && (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5 p-3 bg-gray-50 dark:bg-[#1E2235]/40 border border-white/[0.06] dark:border-white/[0.06] rounded-lg">
                    <label className="text-xs font-bold text-[#2C2C2A] dark:text-zinc-300 block truncate">
                      {field.name}
                    </label>
                    
                    {field.type === "text" && (
                      <input
                        type="text"
                        value={field.value as string}
                        onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                        className="w-full h-9 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      />
                    )}

                    {field.type === "checkbox" && (
                      <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={field.value as boolean}
                          onChange={(e) => handleFieldValueChange(field.name, e.target.checked)}
                          className="size-4 rounded border-gray-300 dark:border-white/[0.08] text-[#6366F1] focus:ring-[#6366F1]/50"
                        />
                        <span className="text-xs text-gray-500">Enable Checkbox</span>
                      </label>
                    )}

                    {field.type === "select" && (
                      <select
                        value={field.value as string}
                        onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                        className="w-full h-9 border border-gray-300 dark:border-white/[0.08] bg-transparent text-[#2C2C2A] dark:text-[#F1F3F9] rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}

            {fields.length === 0 && !isProcessing && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                <span className="text-xs font-bold text-amber-600">
                  No interactive form fields found in this PDF document.
                </span>
              </div>
            )}

            {/* Execute Trigger */}
            {!isProcessing && !processedPdfUrl && fields.length > 0 && (
              <button 
                onClick={fillFormAndDownload}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Bake Form & Download
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
            {processedPdfUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="text-xs font-bold">Successfully filled PDF form fields!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="filled.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download Filled PDF
                  </a>
                  <button 
                    onClick={clearAll}
                    className="h-10 px-4 border border-gray-300 dark:border-white/[0.08] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold"
                  >
                    Fill Another File
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
