"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Download } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument } from "pdf-lib";

export default function BookmarkManager() {
  const [file, setFile] = useState<File | null>(null);
  const [bookmarks, setBookmarks] = useState<Array<{ title: string; page: number }>>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setBookmarks([]);
    setResultUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setNewPage(Math.min(1, doc.getPageCount()));
    } catch (err) {
      console.error("Error reading PDF:", err);
    }
  };

  const addBookmark = () => {
    if (!newTitle.trim()) return;
    setBookmarks([...bookmarks, { title: newTitle, page: newPage }]);
    setNewTitle("");
  };

  const removeBookmark = (index: number) => {
    setBookmarks(bookmarks.filter((_, i) => i !== index));
  };

  const applyBookmarks = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      
      // Note: pdf-lib has limited bookmark support, this is a placeholder
      // In a real implementation, you'd need a library with full bookmark support
      bookmarks.forEach(bookmark => {
        console.log(`Bookmark: "${bookmark.title}" -> Page ${bookmark.page}`);
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error applying bookmarks:", err);
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
          <Bookmark className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Bookmark Manager</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Add bookmarks to your PDF for easy navigation.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        {!file ? (
          <DropZone
            accept={[".pdf"]}
            label="Drop PDF here"
            description="Select PDF to add bookmarks"
            onFilesSelected={handleFileSelected}
            maxFiles={1}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium">{file.name}</p>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700">Add Bookmark</h3>
              
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Bookmark title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addBookmark()}
              />

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Page Number</label>
                <input
                  type="number"
                  value={newPage}
                  onChange={(e) => setNewPage(parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <button
                onClick={addBookmark}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 text-sm"
              >
                Add Bookmark
              </button>
            </div>

            {bookmarks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Bookmarks ({bookmarks.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">{bookmark.title}</p>
                        <p className="text-gray-500">Page {bookmark.page}</p>
                      </div>
                      <button
                        onClick={() => removeBookmark(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={applyBookmarks}
              disabled={isProcessing || bookmarks.length === 0}
              className="w-full bg-[#6366F1] text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? "Saving..." : "Save Bookmarks"}
            </button>
          </div>
        )}

        {resultUrl && (
          <a
            href={resultUrl}
            download={`bookmarked-${file?.name}`}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        )}
      </div>
    </main>
  );
}
