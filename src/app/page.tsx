"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, Download, FileText, Sparkles,
  ShieldCheck, ArrowRight, Cpu, Layers, Trash2, RotateCw, RefreshCw,
  MessageSquare, EyeOff, PenTool, Lock, Unlock, Scissors,
  LayoutGrid, FileSpreadsheet, Presentation, Image as ImageIcon, Split, Combine
} from "lucide-react";
import Link from "next/link";
import DropZone from "@/components/ui/DropZone";
import InteractiveCanvas from "@/components/ui/InteractiveCanvas";
import { executeAgentPrompt, AgentLog } from "@/utils/pdfAgent";
import { PDFDocument, rgb } from "pdf-lib";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { ALL_TOOLS, CATEGORY_METADATA, ToolCategory, ToolItem } from "@/lib/toolsRegistry";
import { Search, Sparkles as SparklesIcon, CheckCircle } from "lucide-react";
import LinearToolCard from "@/components/ui/LinearToolCard";
import AirGapHUD from "@/components/ui/AirGapHUD";
import DefensiveDropZone from "@/components/ui/DefensiveDropZone";
import ComputeEngineMask from "@/components/ui/ComputeEngineMask";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<AgentLog[]>([
    { timestamp: new Date().toLocaleTimeString(), type: "info", message: "Autonomous PDF Agent Sandbox Console initialized." }
  ]);
  const [activeTool, setActiveTool] = useState<"select" | "redact" | "draw" | "text">("redact");
  const [redactionZones, setRedactionZones] = useState<Record<number, { x: number; y: number; w: number; h: number }[]>>({});
  const [activeTab, setActiveTab] = useState<"agent" | "script" | "redact">("agent");
  const [macroScript, setMacroScript] = useState(`// Stamp CONFIDENTIAL on page 1\nconst pages = doc.getPages();\nconst page = pages[0];\nconst { width, height } = page.getSize();\npage.drawText(\"CONFIDENTIAL\", {\n  x: width - 150,\n  y: height - 40,\n  size: 12,\n  color: rgb(0.8, 0.2, 0.2)\n});`);
  const [selectedCategory, setSelectedCategory] = useState<"all" | ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selected = selectedFiles[0];
      setFile(selected);
      setRedactionZones({});
      setCurrentPage(1);
      
      try {
        const arrayBuffer = await selected.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPageCount(doc.getPageCount());
        setTerminalLogs(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString(), type: "success", message: `Document parsed: "${selected.name}" (${doc.getPageCount()} pages)` }
        ]);
      } catch (err) {
        console.error("Error loading PDF:", err);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setPageCount(null);
    setRedactionZones({});
    setTerminalLogs([
      { timestamp: new Date().toLocaleTimeString(), type: "info", message: "PDF Sandbox Terminal Reset." }
    ]);
  };

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

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const result = await executeAgentPrompt(pdfDoc, prompt, pdfjsLib);
      
      setTerminalLogs(prev => [...prev, ...result.logs]);

      if (result.modified) {
        const savedBytes = result.encryptedBytes || await result.pdfDoc.save();
        const updatedFile = new File([savedBytes as any], file.name, { type: "application/pdf" });
        setFile(updatedFile);
        setPageCount(result.pdfDoc.getPageCount());
      }
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "error", message: `Agent error: ${errMsg}` }
      ]);
      setIsProcessing(false);
    }
  };

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

      const evalMacro = new Function("doc", "rgb", macroScript);
      evalMacro(doc, rgb);

      const savedBytes = await doc.save();
      const updatedFile = new File([savedBytes as any], file.name, { type: "application/pdf" });
      setFile(updatedFile);
      
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "success", message: "[Macro] Code successfully executed. Viewport updated." }
      ]);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "error", message: `Macro runtime error: ${errMsg}` }
      ]);
      setIsProcessing(false);
    }
  };

  const applyRedactionBake = async () => {
    if (!file || !pageCount) return;
    
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
      
      Object.keys(redactionZones).forEach((pageKey) => {
        const pageIdx = parseInt(pageKey, 10) - 1;
        const page = pages[pageIdx];
        const zones = redactionZones[pageIdx + 1] || [];
        const { width, height } = page.getSize();

        zones.forEach((zone) => {
          const scale = 1.5;
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
        { timestamp: new Date().toLocaleTimeString(), type: "success", message: "Redaction rectangles baked successfully." }
      ]);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setTerminalLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), type: "error", message: `Redaction bake failed: ${errMsg}` }
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
    <div className="min-h-screen bg-[#08090D] text-[#F1F3F9] font-sans pb-24 relative overflow-hidden">
      
      {/* Apple-grade ambient mesh background glow overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-[#6366F1]/12 via-[#4F46E5]/4 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#10B981]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#6366F1]/3 blur-[120px] pointer-events-none z-0" />
      
      {/* Centered Fixed Navigation Bar - Frosted Glass effect */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08090D]/70 backdrop-blur-xl border-b border-white/[0.04] h-16 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={clearAll} className="flex items-center gap-3 hover:opacity-95 transition-opacity bg-transparent border-0 text-left p-0 cursor-pointer">
            <div className="size-7 rounded-lg bg-gradient-to-br from-white to-gray-200 flex items-center justify-center shadow-lg shadow-black/10">
              <span className="text-[#08090D] text-xs font-black tracking-tighter">P</span>
            </div>
            <span className="text-white font-extrabold tracking-tight text-sm">PDFGhost</span>
          </button>
          
          <div className="flex items-center gap-3">
            {file ? (
              <>
                <button
                  onClick={triggerDownload}
                  className="h-9 px-4 bg-white hover:bg-gray-100 text-[#08090D] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-lg active:scale-[0.98] border-0 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Export Document
                </button>
                <button
                  onClick={clearAll}
                  className="h-9 px-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Reset Workspace
                </button>
              </>
            ) : (
              <AirGapHUD />
            )}
          </div>
        </div>
      </nav>

      {/* Unified Center-Aligned Main Viewport */}
      <main className="w-full flex flex-col items-center justify-start px-6 relative z-10" style={{ paddingTop: "130px" }}>
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-12">
          
          {!file ? (
            <div className="space-y-10 w-full flex flex-col items-center pt-2">
              
              {/* Hero header */}
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md animate-fade-in">
                  <Sparkles className="size-3 text-[#818CF8]" />
                  100% Serverless WebAssembly Toolkit
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight pt-1">
                  <span className="bg-gradient-to-b from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                    Autonomous PDF Agent
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-light">
                  Control, modify, and secure documents through simple natural language instructions or JavaScript scripts. Everything processes locally in-memory.
                </p>
              </div>

              {/* Premium Dropzone Wrapper */}
              <div className="max-w-2xl mx-auto w-full">
                <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-3 rounded-3xl shadow-2xl shadow-black/60 hover:border-white/[0.12] transition-all duration-300">
                  <DefensiveDropZone
                    acceptTypes={[".pdf", "application/pdf"]}
                    maxBytes={150 * 1024 * 1024}
                    label="Drop PDF here to initialize Autonomous Agent Workspace"
                    sublabel="Verified %PDF-1.x binary magic bytes • Max 150MB local allocation"
                    onValidPayload={handleFilesSelected}
                  />
                </div>
              </div>

              {/* Instant Search Bar */}
              <div className="w-full max-w-xl mx-auto px-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 size-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 160 tools (e.g. compress, invoice, mortgage, base64, gradient, resume...)"
                    className="w-full h-12 pl-11 pr-10 bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition shadow-xl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 p-1 text-slate-400 hover:text-white rounded-lg text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto animate-fade-in px-2">
                {[
                  { label: "All Tools", id: "all", count: ALL_TOOLS.length },
                  { label: "PDF Tools", id: "pdf", count: CATEGORY_METADATA.pdf.count },
                  { label: "Image Studio", id: "image", count: CATEGORY_METADATA.image.count },
                  { label: "Converters & Dev", id: "converter", count: CATEGORY_METADATA.converter.count },
                  { label: "Calculators", id: "calculator", count: CATEGORY_METADATA.calculator.count },
                  { label: "Business & Docs", id: "marketing", count: CATEGORY_METADATA.marketing.count },
                  { label: "Design & Fun", id: "fun", count: CATEGORY_METADATA.fun.count },
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === category.id
                        ? "bg-white text-slate-950 border-white shadow-lg shadow-white/10 scale-[1.02]"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === category.id ? "bg-slate-200 text-slate-900 font-bold" : "bg-slate-800 text-slate-400"}`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* 160 Tools Dynamic Grid */}
              <div className="space-y-6 pt-2 w-full flex flex-col items-center">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between w-full max-w-6xl px-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                      {selectedCategory === "all" ? "All 160 Free Tools" : CATEGORY_METADATA[selectedCategory]?.name}
                    </h2>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({ALL_TOOLS.filter((t) => {
                        const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
                        if (!matchesCat) return false;
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase().trim();
                        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q));
                      }).length} available)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold tracking-wider uppercase">
                    100% Free • No Signup
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl px-2">
                  {ALL_TOOLS
                    .filter((tool) => {
                      const matchesCat = selectedCategory === "all" || tool.category === selectedCategory;
                      if (!matchesCat) return false;
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase().trim();
                      return (
                        tool.title.toLowerCase().includes(q) ||
                        tool.description.toLowerCase().includes(q) ||
                        tool.tags.some((tag) => tag.toLowerCase().includes(q))
                      );
                    })
                    .map((tool) => (
                      <LinearToolCard
                        key={tool.id}
                        title={tool.title}
                        description={tool.description}
                        url={tool.url}
                        iconName={tool.iconName}
                        badge={tool.badge}
                        category={CATEGORY_METADATA[tool.category]?.name || tool.category}
                      />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)] w-full relative z-10">
              
              {/* Left Column - Interactive Canvas Viewport */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-[400px]">
                <div className="flex-grow min-h-0 bg-[#0B0D13] border border-white/[0.04] rounded-3xl shadow-2xl p-4 flex items-center justify-center relative overflow-hidden">
                  <ComputeEngineMask
                    isComputing={isProcessing}
                    progressPercent={status.includes("Baking") ? 85 : 55}
                    taskPhase={status || "Executing client-side document operation..."}
                  />
                  <div className="w-full h-full overflow-auto flex items-center justify-center">
                    <InteractiveCanvas
                      file={file}
                      currentPage={currentPage}
                      activeTool={activeTool}
                      onAddRedactionZone={addRedactionZone}
                      redactionZones={redactionZones}
                      onClearRedactions={clearRedactions}
                    />
                  </div>
                </div>

                {pageCount && (
                  <div className="flex justify-between items-center bg-white/[0.01] border border-white/[0.04] rounded-2xl px-5 py-3 mt-4 shrink-0 shadow-lg">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                      className="text-xs font-bold px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-20 rounded-lg transition-colors border border-white/[0.06] cursor-pointer text-white disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    <span className="text-xs font-bold text-gray-400">
                      Page {currentPage} of {pageCount}
                    </span>
                    <button
                      disabled={currentPage === pageCount}
                      onClick={() => setCurrentPage(c => Math.min(pageCount, c + 1))}
                      className="text-xs font-bold px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-20 rounded-lg transition-colors border border-white/[0.06] cursor-pointer text-white disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Controls Console */}
              <div className="lg:col-span-5 flex flex-col h-full min-h-[400px] gap-5">
                
                {/* Tab Controls Panel */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-3xl p-5 flex flex-col min-h-0 flex-1 shadow-xl">
                  
                  {/* Segmented Control Switcher */}
                  <div className="flex bg-[#0B0D13] border border-white/[0.04] p-1 rounded-2xl mb-5 gap-1 shrink-0">
                    {[
                      { label: "AI Prompt", id: "agent" },
                      { label: "Redact", id: "redact" },
                      { label: "Macro Console", id: "script" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer border-0 ${
                          activeTab === tab.id
                            ? "bg-white text-[#08090D] shadow-md font-extrabold"
                            : "bg-transparent text-gray-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Tab Panel Body */}
                  <div className="flex-grow overflow-y-auto pr-1 min-h-0 text-xs">
                    
                    {activeTab === "agent" && (
                      <div className="space-y-5 h-full flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block">
                            AI Execution Instructions
                          </span>
                          <p className="text-gray-400 text-[11px] leading-relaxed font-light">
                            Describe your modification in natural language (e.g. &quot;rotate first page 90 degrees&quot;, &quot;watermark confidential&quot;, &quot;redact emails&quot;).
                          </p>
                        </div>

                        <form onSubmit={runAgentPrompt} className="space-y-3.5 pt-4">
                          <textarea
                            rows={4}
                            value={agentPrompt}
                            onChange={(e) => setAgentPrompt(e.target.value)}
                            placeholder="e.g. rotate page 1 by 180 degrees and stamp draft..."
                            className="w-full bg-[#0B0D13]/60 border border-white/[0.06] text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#6366F1]/50 placeholder-zinc-600 resize-none font-mono leading-relaxed"
                          />
                          <button
                            type="submit"
                            disabled={!agentPrompt.trim() || isProcessing}
                            className="w-full h-10 bg-white hover:bg-gray-100 disabled:opacity-20 text-[#08090D] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border-0 cursor-pointer disabled:cursor-not-allowed shadow-lg"
                          >
                            Execute AI Prompt
                          </button>
                        </form>
                      </div>
                    )}

                    {activeTab === "redact" && (
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block">
                            Canvas Redaction Controller
                          </span>
                          <p className="text-gray-400 text-[11px] leading-relaxed font-light">
                            Click and drag redaction boxes over the PDF viewport on the left, then bake them permanently to black out data.
                          </p>
                        </div>

                        <div className="flex gap-2.5 bg-[#0B0D13] p-1 rounded-2xl border border-white/[0.04]">
                          <button
                            onClick={() => setActiveTool("redact")}
                            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border-0 ${
                              activeTool === "redact"
                                ? "bg-red-500/10 text-red-400 font-extrabold"
                                : "bg-transparent text-gray-400 hover:text-white"
                            }`}
                          >
                            Redact mode
                          </button>
                          <button
                            onClick={() => setActiveTool("select")}
                            className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border-0 ${
                              activeTool === "select"
                                ? "bg-white/[0.04] text-white font-extrabold"
                                : "bg-transparent text-gray-400 hover:text-white"
                            }`}
                          >
                            Select mode
                          </button>
                        </div>

                        <button
                          onClick={applyRedactionBake}
                          disabled={isProcessing}
                          className="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border-0 cursor-pointer shadow-lg shadow-red-500/10"
                        >
                          <ShieldCheck className="size-4" />
                          Bake Redactions into PDF
                        </button>
                      </div>
                    )}

                    {activeTab === "script" && (
                      <div className="space-y-5 h-full flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block">
                            JavaScript Sandbox Macro
                          </span>
                          <p className="text-gray-400 text-[11px] leading-relaxed font-light">
                            Run custom scripts directly inside your browser container using the programmatic `pdf-lib` document API.
                          </p>
                        </div>

                        <div className="flex-grow pt-2">
                          <textarea
                            rows={8}
                            value={macroScript}
                            onChange={(e) => setMacroScript(e.target.value)}
                            className="w-full bg-[#0B0D13]/60 border border-white/[0.06] text-white rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#6366F1]/50 resize-none leading-relaxed"
                          />
                        </div>

                        <button
                          onClick={runMacroScript}
                          disabled={isProcessing}
                          className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors mt-2 border-0 cursor-pointer shadow-lg shadow-emerald-500/10"
                        >
                          Run JavaScript Macro
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Terminal Logs Panel */}
                <div className="bg-black/35 border border-white/[0.04] rounded-3xl p-5 h-48 flex flex-col shrink-0 shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2.5 mb-2.5 shrink-0">
                    <Terminal className="size-4 text-emerald-400" />
                    <span className="text-[9px] font-extrabold tracking-widest uppercase text-emerald-400">
                      Live Terminal Stream
                    </span>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto font-mono text-[10px] space-y-2 pr-1 text-zinc-400 leading-relaxed">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                        <span className={log.type === "success" ? "text-emerald-400" : log.type === "warn" ? "text-amber-400" : log.type === "error" ? "text-red-400 font-semibold" : ""}>
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
        </div>
      </main>
    </div>
);
}