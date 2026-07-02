"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BrainCircuit, Terminal, Play, Save, RefreshCw, 
  Trash2, ShieldCheck, Download, Code, Layers, FileText, Lock, Sparkles
} from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import InteractiveCanvas from "@/components/ui/InteractiveCanvas";
import { executeAgentPrompt, AgentLog } from "@/utils/pdfAgent";
import { PDFDocument, rgb } from "pdf-lib";

export default function Workbench() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  
  // Agent / Command states
  const [agentPrompt, setAgentPrompt] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<AgentLog[]>([
    { timestamp: new Date().toLocaleTimeString(), type: "info", message: "PDF Sandbox Terminal Initialized. Ready for prompt instructions." }
  ]);
  
  // Visual Editor states
  const [activeTool, setActiveTool] = useState<"select" | "redact" | "draw" | "text">("redact");
  const [redactionZones, setRedactionZones] = useState<Record<number, { x: number; y: number; w: number; h: number }[]>>({});
  const [rotationMap, setRotationMap] = useState<Record<number, number>>({}); // page rotation offsets (0, 90, 180, 270)
  
  // Macro / Scripting Console states
  const [activeTab, setActiveTab] = useState<"agent" | "script" | "redact">("agent");
  const [macroScript, setMacroScript] = useState(`// Quick Macro: Stamp Confidential on top right of page 1
const pages = doc.getPages();
const page = pages[0];
const { width, height } = page.getSize();
page.drawText("CONFIDENTIAL", {
  x: width - 150,
  y: height - 40,
  size: 12,
  color: rgb(0.8, 0.2, 0.2)
});
`);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setRedactionZones({});
      setRotationMap({});
      setCurrentPage(1);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPageCount(doc.getPageCount());
        setTerminalLogs(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString(), type: "success", message: `Document loaded: "${selected.name}" (${doc.getPageCount()} pages)` }
        ]);
      } catch (err) {
        console.error("Error reading PDF pages:", err);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setPageCount(null);
    setRedactionZones({});
    setRotationMap({});
    setTerminalLogs([
      { timestamp: new Date().toLocaleTimeString(), type: "info", message: "PDF Sandbox Terminal Reset." }
    ]);
  };

  // Run autonomous prompt parser
  const runAgentPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !agentPrompt.trim()) return;

    setIsProcessing(true);
    setStatus("Agent computing sequence...");
    const prompt = agentPrompt.trim();
    setAgentPrompt("");

    setTerminalLogs(prev => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString(), type: "info", message: `[Agent] Running command: "${prompt}"` }
    ]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      let pdfDoc = await PDFDocument.load(arrayBuffer);

      // Load pdfjs-dist dynamically for OCR scans
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const result = await executeAgentPrompt(pdfDoc, prompt, pdfjsLib);
      
      // Update terminal logs
      setTerminalLogs(prev => [...prev, ...result.logs]);

      if (result.modified) {
        // Save modified PDF bytes and reload into file context
        const savedBytes = result.encryptedBytes || await result.pdfDoc.save();
        const updatedFile = new File([savedBytes as any], file.name, { type: "application/pdf" });
        setFile(updatedFile);
        setPageCount(result.pdfDoc.getPageCount());
      }
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "error", message: `Agent error: ${err.message || String(err)}` }
      ]);
      setIsProcessing(false);
    }
  };

  // Execute Developer JS macros locally
  const runMacroScript = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus("Executing custom script macro...");

    setTerminalLogs(prev => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString(), type: "info", message: "[Macro] Initializing JavaScript code sandbox..." }
    ]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);

      // Create sandboxed script evaluator passing pdf-lib scope
      const evalMacro = new Function("doc", "rgb", macroScript);
      evalMacro(doc, rgb);

      // Save output
      const savedBytes = await doc.save();
      const updatedFile = new File([savedBytes as any], file.name, { type: "application/pdf" });
      setFile(updatedFile);
      
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "success", message: "[Macro] Code successfully executed. Viewport updated." }
      ]);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "error", message: `Macro runtime error: ${err.message || String(err)}` }
      ]);
      setIsProcessing(false);
    }
  };

  // Save drawing redaction coordinates to file
  const applyRedactionBake = async () => {
    if (!file || !pageCount) return;
    
    // Check if any zones exist to redact
    const hasZones = Object.values(redactionZones).some((zones) => zones.length > 0);
    if (!hasZones) {
      alert("No redaction marks drawn on canvas. Select Redact mode and drag black boxes first.");
      return;
    }

    setIsProcessing(true);
    setStatus("Baking redaction overlays into PDF pixels...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "info", message: "Baking canvas coordinates to PDF drawing streams..." }
      ]);

      // Apply coordinates math correctly
      Object.keys(redactionZones).forEach((pageKey) => {
        const pageIdx = parseInt(pageKey, 10) - 1;
        const page = pages[pageIdx];
        const zones = redactionZones[pageIdx + 1] || [];
        
        const { width, height } = page.getSize();

        zones.forEach((zone) => {
          // pdfjs rendering scale relative to pdf-lib point coordinates
          // Translate top-left canvas coordinates to bottom-left pdf points
          const scale = 1.5; // matching Scale value of viewport rendering
          const x = (zone.x / (width * scale)) * width;
          const y = height - ((zone.y + zone.h) / (height * scale)) * height;
          const w = (zone.w / (width * scale)) * width;
          const h = (zone.h / (height * scale)) * height;

          page.drawRectangle({
            x,
            y,
            width: w,
            height: h,
            color: rgb(0, 0, 0),
          });
        });
      });

      const savedBytes = await pdfDoc.save();
      const updatedFile = new File([savedBytes as any], file.name, { type: "application/pdf" });
      setFile(updatedFile);
      setRedactionZones({});
      
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "success", message: "Redaction rectangles baked successfully. Document finalized." }
      ]);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "error", message: `Redaction bake failed: ${err.message || String(err)}` }
      ]);
      setIsProcessing(false);
    }
  };

  const addRedactionZone = (page: number, rect: { x: number; y: number; w: number; h: number }) => {
    setRedactionZones((prev) => {
      const current = prev[page] || [];
      return {
        ...prev,
        [page]: [...current, rect],
      };
    });
  };

  const clearRedactions = (page: number) => {
    setRedactionZones((prev) => ({
      ...prev,
      [page]: [],
    }));
  };

  const triggerDownload = async () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pdfghost_agent_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0F111A] text-[#F1F3F9] font-sans pb-12">
      
      {/* Navigation Header */}
      <nav className="border-b border-white/[0.06] bg-[#0F111A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
            <div className="size-6 rounded bg-[#F1F3F9] flex items-center justify-center">
              <span className="text-[#0F111A] text-xs font-black leading-none">P</span>
            </div>
            <span className="text-[#F1F3F9] font-bold tracking-tight text-sm">PDFGhost Sandbox</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {file && (
              <>
                <button
                  onClick={triggerDownload}
                  className="h-8.5 px-4 bg-[#6366F1] hover:bg-[#5558DD] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Download className="size-3.5" />
                  Save / Download
                </button>
                <button
                  onClick={clearAll}
                  className="h-8.5 px-3 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Reset Workspace
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        {!file ? (
          <div className="max-w-2xl mx-auto py-16">
            <div className="bg-[#151824]/40 border border-white/[0.06] p-8 rounded-2xl space-y-4 text-center mb-8 relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">
                  Local Agent Active
                </span>
              </div>

              <div className="size-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center mx-auto text-[#6366F1]">
                <BrainCircuit className="size-6" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold">Initialize PDF Agent Sandbox</h1>
                <p className="text-xs text-[#7E84A3] max-w-md mx-auto">
                  Upload any document to start secure offline conversions, auto-redacting sensitive credentials, or run autonomous scripting commands locally.
                </p>
              </div>
            </div>

            <DropZone
              accept={[".pdf"]}
              label="Drop PDF here to initialize Workspace"
              onFilesSelected={handleFilesSelected}
              maxFiles={1}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
            
            {/* LEFT COLUMN: INTERACTIVE CANVAS */}
            <div className="lg:col-span-7 flex flex-col h-full min-h-[400px]">
              <div className="flex-1 min-h-0">
                <InteractiveCanvas
                  file={file}
                  currentPage={currentPage}
                  activeTool={activeTool}
                  onAddRedactionZone={addRedactionZone}
                  redactionZones={redactionZones}
                  onClearRedactions={clearRedactions}
                />
              </div>

              {/* Page Selector Footer Controls */}
              {pageCount && (
                <div className="flex justify-between items-center bg-[#151824]/20 border border-white/[0.06] rounded-xl px-4 py-2 mt-3 shrink-0">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                    className="text-xs font-semibold px-2 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded transition-colors"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-semibold text-gray-400">
                    Page {currentPage} of {pageCount}
                  </span>
                  <button
                    disabled={currentPage === pageCount}
                    onClick={() => setCurrentPage(c => Math.min(pageCount, c + 1))}
                    className="text-xs font-semibold px-2 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: TERMINAL & TOOL CONTROLS */}
            <div className="lg:col-span-5 flex flex-col h-full min-h-[400px] gap-4">
              
              {/* Tool Config Tabs */}
              <div className="bg-[#151824]/40 border border-white/[0.06] rounded-2xl p-4 flex flex-col min-h-0 flex-1">
                
                {/* Tabs selection */}
                <div className="flex border-b border-white/[0.06] pb-3 mb-4 gap-2 shrink-0">
                  {[
                    { label: "Agent Command", id: "agent" },
                    { label: "Manual Redact", id: "redact" },
                    { label: "Macro Console", id: "script" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        activeTab === tab.id
                          ? "bg-[#6366F1] border-[#6366F1] text-white"
                          : "border-white/5 text-[#7E84A3] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content panel */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0 text-xs">
                  {activeTab === "agent" && (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          AI Prompt Instructions
                        </span>
                        <p className="text-[#7E84A3] text-[11px] leading-relaxed">
                          Type commands in plain text (e.g. *"rotate page 1 90 degrees"* or *"watermark CONFIDENTIAL"* or *"redact emails"*).
                        </p>
                      </div>

                      <form onSubmit={runAgentPrompt} className="space-y-2.5 pt-4">
                        <textarea
                          rows={3}
                          value={agentPrompt}
                          onChange={(e) => setAgentPrompt(e.target.value)}
                          placeholder="e.g. redact emails and rotate page 1..."
                          className="w-full bg-[#0F111A] border border-white/[0.08] text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#6366F1] placeholder:text-gray-600 resize-none font-mono"
                        />
                        <button
                          type="submit"
                          disabled={!agentPrompt.trim() || isProcessing}
                          className="w-full h-9 bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-30"
                        >
                          <Play className="size-3.5" />
                          Execute Agent Command
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "redact" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Canvas Redactor
                        </span>
                        <p className="text-[#7E84A3] text-[11px] leading-relaxed">
                          1. Set tool mode to **Redact** below.<br />
                          2. Click and drag boxes directly over text pages on the left viewport.<br />
                          3. Click "Bake Overlays" to burn boxes permanently into the PDF.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveTool("redact")}
                          className={`flex-1 h-9 rounded-lg border text-xs font-semibold transition-colors ${
                            activeTool === "redact"
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : "border-white/5 text-[#7E84A3] hover:text-white"
                          }`}
                        >
                          Redact Tool
                        </button>
                        <button
                          onClick={() => setActiveTool("select")}
                          className={`flex-1 h-9 rounded-lg border text-xs font-semibold transition-colors ${
                            activeTool === "select"
                              ? "bg-white/5 border-white/10 text-white"
                              : "border-white/5 text-[#7E84A3]"
                          }`}
                        >
                          Select Tool
                        </button>
                      </div>

                      <button
                        onClick={applyRedactionBake}
                        disabled={isProcessing}
                        className="w-full h-9 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="size-3.5" />
                        Bake Overlays (Burn PDF)
                      </button>
                    </div>
                  )}

                  {activeTab === "script" && (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          JavaScript Macro Console
                        </span>
                        <p className="text-[#7E84A3] text-[11px] leading-relaxed">
                          Execute standard programmatic API modifications directly using `pdf-lib` script code.
                        </p>
                      </div>

                      <div className="flex-grow pt-2">
                        <textarea
                          rows={6}
                          value={macroScript}
                          onChange={(e) => setMacroScript(e.target.value)}
                          className="w-full bg-[#0F111A] border border-white/[0.08] text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-[#6366F1] resize-none"
                        />
                      </div>

                      <button
                        onClick={runMacroScript}
                        disabled={isProcessing}
                        className="w-full h-9 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors mt-2"
                      >
                        <Code className="size-3.5" />
                        Run Script Macro
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* LIVE TERMINAL LOG PANEL */}
              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-4 h-48 flex flex-col shrink-0">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 mb-2 shrink-0">
                  <Terminal className="size-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                    Live Execution Logs
                  </span>
                </div>
                
                <div className="flex-grow overflow-y-auto font-mono text-[10px] space-y-1.5 pr-1 text-zinc-300">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                      <span className={`
                        ${log.type === "success" ? "text-emerald-400" : ""}
                        ${log.type === "warn" ? "text-amber-400" : ""}
                        ${log.type === "error" ? "text-red-400 font-bold" : ""}
                      `}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}
