"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, FileText, Send, Loader2, Bot, User } from "lucide-react";
import DropZone from "@/components/ui/DropZone";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AiChat() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setMessages([]);
      
      setIsProcessing(true);
      setStatus("Extracting text layers from PDF for local analysis...");
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await selected.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        setPageCount(pdf.numPages);
        
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          setStatus(`Scanning page ${i} of ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += `[Page ${i}] ${pageText}\n`;
        }

        setDocumentText(fullText);
        setMessages([
          {
            id: "system-1",
            sender: "bot",
            text: `Hi! I've analyzed your document: "${selected.name}" (${pdf.numPages} pages). I've indexed all paragraphs locally. What would you like to know about it?`,
            timestamp: new Date(),
          },
        ]);
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        alert("Error loading PDF text: " + (err instanceof Error ? err.message : String(err)));
        setFile(null);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setDocumentText("");
    setPageCount(null);
    setMessages([]);
    setInputVal("");
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Local-first keyword search and contextual answering engine
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !documentText) return;

    const userQuery = inputVal.trim();
    const newMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: userQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");

    // Simulate thinking delay
    const typingMsgId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: typingMsgId, sender: "bot", text: "Scanning document contents...", timestamp: new Date() },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Tokenize search query keywords
    const keywords = userQuery.toLowerCase().split(/\s+/).filter((k) => k.length > 2);
    
    // Split document into lines/paragraphs
    const paragraphs = documentText.split("\n").filter((p) => p.trim().length > 10);
    
    // Score paragraphs based on keyword frequency match
    const scoredParagraphs = paragraphs.map((p) => {
      let score = 0;
      keywords.forEach((kw) => {
        if (p.toLowerCase().includes(kw)) {
          score += 1;
        }
      });
      return { text: p, score };
    });

    // Sort and get top matching paragraphs
    const topMatches = scoredParagraphs
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    let reply = "";
    if (topMatches.length > 0) {
      reply = `Based on my local search, here is the most relevant section of the document:\n\n${topMatches.map(m => `"${m.text.trim()}"`).join("\n\n")}\n\nCan I help you find anything else?`;
    } else {
      reply = `I couldn't find an exact keyword match in the document for your query. However, I can scan for terms if you try summarizing or using specific keywords (e.g. dates, names, or values). Here is a general snippet from the beginning of your file:\n\n"${paragraphs.slice(0, 1)[0]?.substring(0, 300)}..."`;
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === typingMsgId
          ? { ...msg, text: reply, timestamp: new Date() }
          : msg
      )
    );
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* Top Header */}
      <div className="space-y-4 shrink-0">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
          <div className="flex items-center gap-3">
            <BrainCircuit className="size-6 text-[#FF9800]" />
            <h1 className="text-xl font-bold text-[#F1F3F9]">AI Chat with PDF</h1>
          </div>
          <p className="text-sm text-[#7E84A3]">
            Ask questions, summarize chapters, or find specific clauses in your PDF document locally and privately.
          </p>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md rounded-xl shadow-lg flex flex-col overflow-hidden min-h-0">
        {!file ? (
          <div className="p-6 my-auto">
            <DropZone
              accept={[".pdf"]}
              label="Upload PDF to Chat"
              description="Extract text layers locally to converse with your document"
              onFilesSelected={handleFilesSelected}
              maxFiles={1}
            />
          </div>
        ) : (
          <>
            {/* Active file status */}
            <div className="px-4 py-2.5 bg-gray-50 border-b border-white/[0.06] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 truncate">
                <FileText className="size-4 text-[#7E84A3] shrink-0" />
                <span className="text-xs font-bold text-[#2C2C2A] truncate">
                  {file.name}
                </span>
                {pageCount && (
                  <span className="text-[10px] text-gray-400">
                    ({pageCount} pages)
                  </span>
                )}
              </div>
              <button
                onClick={clearAll}
                className="text-xs text-red-500 hover:underline font-semibold"
                disabled={isProcessing}
              >
                Change Document
              </button>
            </div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isBot && (
                      <div className="size-7 rounded-lg bg-[#FF9800]/10 flex items-center justify-center text-[#FF9800] shrink-0">
                        <Bot className="size-4" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        isBot
                          ? "bg-white text-[#2C2C2A] border border-white/[0.06] rounded-tl-none"
                          : "bg-[#6366F1] text-white rounded-tr-none shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {!isBot && (
                      <div className="size-7 rounded-lg bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] shrink-0">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-white/[0.06] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask about document content..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isProcessing}
                className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:border-[#6366F1]"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isProcessing}
                className="size-9 bg-[#6366F1] text-white rounded-lg flex items-center justify-center hover:bg-[#5558DD] transition-colors disabled:opacity-30 shrink-0"
              >
                <Send className="size-4" />
              </button>
            </form>
          </>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-6 text-[#6366F1] animate-spin" />
            <span className="text-xs text-gray-500 font-semibold">{status}</span>
          </div>
        )}
      </div>
    </main>
  );
}
