"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Download, FileText } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function MetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
    producer: "",
  });
  const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null);

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setEditedPdfUrl(null);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setMetadata({
          title: doc.getTitle() || "",
          author: doc.getAuthor() || "",
          subject: doc.getSubject() || "",
          keywords: doc.getKeywords() || "",
          creator: doc.getCreator() || "",
          producer: doc.getProducer() || "",
        });
      } catch (err) {
        console.error("Error reading metadata:", err);
      }
    }
  };

  const updateMetadata = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      
      doc.setTitle(metadata.title);
      doc.setAuthor(metadata.author);
      doc.setSubject(metadata.subject);
      doc.setKeywords(metadata.keywords.split(",").map(k => k.trim()));
      doc.setCreator(metadata.creator);
      doc.setProducer(metadata.producer);

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setEditedPdfUrl(url);
    } catch (err) {
      console.error("Error updating metadata:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <Edit className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Edit Metadata</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Edit PDF document properties like title, author, and keywords.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drag & drop your PDF here"
            description="Select a PDF to edit metadata"
            onFilesSelected={handleFileSelected}
            maxFiles={1}
          />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-sm font-semibold text-gray-800">{file.name}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Document title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={metadata.author}
                  onChange={(e) => setMetadata({...metadata, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={metadata.subject}
                  onChange={(e) => setMetadata({...metadata, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  value={metadata.keywords}
                  onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>

            <button
              onClick={updateMetadata}
              disabled={isProcessing}
              className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? "Updating..." : "Update Metadata"}
            </button>
          </div>
        )}

        {editedPdfUrl && (
          <div className="flex gap-3">
            <a
              href={editedPdfUrl}
              download={`metadata-${file?.name}`}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <Download className="size-4" />
              Download Updated PDF
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
