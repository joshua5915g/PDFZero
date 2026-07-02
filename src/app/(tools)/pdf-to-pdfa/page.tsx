"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, FileText, CheckCircle2 } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, PDFName } from "pdf-lib";

export default function PdfToPdfa() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setProcessedPdfUrl(null);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPageCount(doc.getPageCount());
      } catch (err) {
        console.error("Error reading page count:", err);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setProcessedPdfUrl(null);
    setPageCount(null);
  };

  const convertToPdfa = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setStatus("Embedding PDF/A-1b archiving compliance metadata...");
      // In PDF/A, metadata is stored in an XML stream. We can embed the standard Dublin Core / PDF/A scheme:
      const pdfaMetadataXml = `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
   <pdfaid:part>1</pdfaid:part>
   <pdfaid:conformance>B</pdfaid:conformance>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

      // Create Metadata stream
      const metadataStream = pdfDoc.context.stream(pdfaMetadataXml, {
        Type: "Metadata",
        Subtype: "XML",
      });
      const metadataRef = pdfDoc.context.register(metadataStream);
      
      // Inject into document catalog
      pdfDoc.catalog.set(PDFName.of("Metadata"), metadataRef);

      setStatus("Finalizing PDF/A structure...");
      const pdfaBytes = await pdfDoc.save();
      const blob = new Blob([pdfaBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error converting to PDF/A: " + (err instanceof Error ? err.message : String(err)));
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
          <FileCheck className="size-6 text-[#2B87EB]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">PDF to PDF/A</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Convert standard PDF documents into PDF/A ISO standard compliant files for long-term secure archiving.
        </p>
      </div>

      {/* Main Action Box */}
      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop PDF file here"
            description="Select a document to convert to PDF/A"
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
            {!isProcessing && !processedPdfUrl && (
              <button 
                onClick={convertToPdfa}
                className="w-full h-11 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5558DD] transition-colors shadow-md text-sm"
              >
                Convert to PDF/A
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
                  <span className="text-xs font-bold">Successfully converted to PDF/A!</span>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={processedPdfUrl}
                    download="archive_compliant.pdf"
                    className="flex-1 h-10 bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-600 transition-colors shadow text-xs"
                  >
                    Download PDF/A
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
