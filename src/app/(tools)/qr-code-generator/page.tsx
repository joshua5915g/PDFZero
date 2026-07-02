"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Download, Copy } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, PDFPage, rgb } from "pdf-lib";

export default function QrCodeGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [qrText, setQrText] = useState("https://example.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrPdfUrl, setQrPdfUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileSelected = (selectedFiles: File[]) => {
    setFile(selectedFiles[0]);
  };

  const generateQRCode = async () => {
    setIsProcessing(true);
    try {
      // Use a public QR code API
      const encodedText = encodeURIComponent(qrText);
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
      setQrUrl(url);
    } catch (err) {
      console.error("Error generating QR code:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const embedQRInPDF = async () => {
    if (!qrUrl || !file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const pages = doc.getPages();
      const page = pages[0];
      
      const { width, height } = page.getSize();
      
      // Fetch the QR code image
      const response = await fetch(qrUrl);
      const buffer = await response.arrayBuffer();
      const image = await doc.embedPng(buffer);
      
      // Draw QR code on page
      page.drawImage(image, {
        x: width - 150,
        y: height - 150,
        width: 100,
        height: 100,
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setQrPdfUrl(url);
    } catch (err) {
      console.error("Error embedding QR code:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <QrCode className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">QR Code Generator</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Generate QR codes and embed them in your PDF documents.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">QR Code Data</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="Enter URL or text for QR code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={copyToClipboard}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                copied 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Copy className="size-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-green-600">Copied!</p>}
        </div>

        <button
          onClick={generateQRCode}
          disabled={isProcessing || !qrText}
          className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? "Generating..." : "Generate QR Code"}
        </button>

        {qrUrl && (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
            </div>
            <a
              href={qrUrl}
              download="qr-code.png"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <Download className="size-4" />
              Download QR Code
            </a>
          </div>
        )}

        {qrUrl && (
          <>
            <hr className="my-4" />
            <h3 className="text-sm font-semibold text-gray-700">Embed in PDF</h3>
            
            {!file ? (
              <DropZone
                accept={[".pdf"]}
                label="Drag & drop PDF here"
                description="Select PDF to embed QR code"
                onFilesSelected={handleFileSelected}
                maxFiles={1}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{file.name}</p>
                <button
                  onClick={embedQRInPDF}
                  disabled={isProcessing}
                  className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? "Embedding..." : "Embed QR Code in PDF"}
                </button>
              </div>
            )}
          </>
        )}

        {qrPdfUrl && (
          <a
            href={qrPdfUrl}
            download={`qr-embedded-${file?.name}`}
            className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
          >
            <Download className="size-4" />
            Download PDF with QR Code
          </a>
        )}
      </div>
    </main>
  );
}
