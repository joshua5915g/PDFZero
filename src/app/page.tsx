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
import DefensiveDropZone from "@/components/ui/DefensiveDropZone";
import ComputeEngineMask from "@/components/ui/ComputeEngineMask";
import Shell from "@/components/layout/Shell";

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
    <Shell>
      <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans pb-24 relative overflow-hidden apple-mesh-glow">
        
        {/* Subtle Apple Studio Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#0071e3]/5 via-[#af52de]/3 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#34c759]/3 blur-[140px] pointer-events-none z-0" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-6 sm:pt-10">
          
          {!file ? (
            <div className="space-y-10 w-full flex flex-col items-center">
              
              {/* Apple Studio Hero Header */}
              <div className="max-w-3xl mx-auto text-center space-y-4 pt-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1d1d1f] leading-[1.08]">
                  Everything PDF. <span className="text-[#0071e3]">Zero Uploads.</span>
                </h1>
                
                <p className="text-sm sm:text-base text-[#6e6e73] max-w-xl mx-auto leading-relaxed font-normal">
                  Edit, sign, convert, and protect documents with autonomous AI instructions and {ALL_TOOLS.length} free tools. Runs entirely in your browser—fast, private, and secure.
                </p>
              </div>

              {/* Apple Studio Frosted Dropzone Card */}
              <div className="max-w-2xl mx-auto w-full">
                <div className="bg-white/80 border border-black/[0.06] backdrop-blur-2xl p-3.5 sm:p-4 rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)] transition-all duration-300">
                  <DefensiveDropZone
                    acceptTypes={[".pdf", "application/pdf"]}
                    maxBytes={150 * 1024 * 1024}
                    label="Drop a PDF to launch Autonomous Studio Workspace"
                    sublabel="Client-side WebAssembly sandbox • Max 150MB local allocation"
                    onValidPayload={handleFilesSelected}
                  />
                </div>
              </div>

              {/* Apple Spotlight Search Bar */}
              <div className="w-full max-w-2xl mx-auto px-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 size-4.5 text-[#86868b] pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools (e.g. compress, invoice, mortgage, base64, watermark, ocr...)"
                    className="w-full h-13 pl-12 pr-10 bg-white border border-black/[0.08] hover:border-black/[0.14] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 rounded-2xl text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none transition shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 p-1 text-[#86868b] hover:text-[#1d1d1f] rounded-lg text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Apple Segmented Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto animate-fade-in px-2">
                {[
                  { label: "All Tools", id: "all", count: ALL_TOOLS.length },
                  { label: "PDF Suite", id: "pdf", count: CATEGORY_METADATA.pdf.count },
                  { label: "Image Studio", id: "image", count: CATEGORY_METADATA.image.count },
                  { label: "Converters & Dev", id: "converter", count: CATEGORY_METADATA.converter.count },
                  { label: "Calculators", id: "calculator", count: CATEGORY_METADATA.calculator.count },
                  { label: "Business & Docs", id: "marketing", count: CATEGORY_METADATA.marketing.count },
                  { label: "Design & Fun", id: "fun", count: CATEGORY_METADATA.fun.count },
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`h-8.5 px-3.5 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? "bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-md scale-[1.02]"
                        : "bg-white/80 border-black/[0.06] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white shadow-xs"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedCategory === category.id ? "bg-white/20 text-white" : "bg-black/[0.05] text-[#86868b]"}`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic Grid */}
              <div className="space-y-6 pt-2 w-full flex flex-col items-center">
                <div className="border-b border-black/[0.06] pb-3 flex items-center justify-between w-full max-w-6xl px-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-[#1d1d1f] tracking-wider uppercase">
                      {selectedCategory === "all" ? "All Tools" : CATEGORY_METADATA[selectedCategory]?.name}
                    </h2>
                    <span className="text-[11px] text-[#86868b] font-medium">
                      ({ALL_TOOLS.filter((t) => {
                        const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
                        if (!matchesCat) return false;
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase().trim();
                        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q));
                      }).length} available)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#28a745] bg-[#34c759]/10 border border-[#34c759]/20 px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase">
                    100% Client-Side • No Signup
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
            /* macOS Studio Workbench (When file is open) */
            <div className="w-full space-y-6">
              {/* macOS Window Titlebar Header */}
              <div className="bg-white/90 border border-black/[0.08] backdrop-blur-2xl rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40" />
                  </div>
                  <span className="text-xs font-semibold text-[#1d1d1f] truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </span>
                  {pageCount && (
                    <span className="text-[11px] text-[#86868b] bg-black/[0.04] px-2 py-0.5 rounded-full font-medium">
                      {pageCount} pages
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerDownload}
                    className="h-8.5 px-4 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98] border-0 cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    Export Document
                  </button>
                  <button
                    onClick={clearAll}
                    className="h-8.5 px-3.5 bg-black/[0.04] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium rounded-full transition-colors cursor-pointer border border-black/[0.06]"
                  >
                    Close File
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-16rem)] w-full">
                
                {/* Left Column - Document Canvas Viewport */}
                <div className="lg:col-span-7 flex flex-col h-full min-h-[400px]">
                  <div className="flex-grow min-h-0 bg-white border border-black/[0.08] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 flex items-center justify-center relative overflow-hidden">
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
                    <div className="flex justify-between items-center bg-white border border-black/[0.06] rounded-2xl px-5 py-2.5 mt-3 shrink-0 shadow-xs">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                        className="text-xs font-semibold px-3 py-1 bg-black/[0.04] hover:bg-black/[0.08] disabled:opacity-30 rounded-lg transition-colors border border-black/[0.04] cursor-pointer text-[#1d1d1f] disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>
                      <span className="text-xs font-medium text-[#6e6e73]">
                        Page {currentPage} of {pageCount}
                      </span>
                      <button
                        disabled={currentPage === pageCount}
                        onClick={() => setCurrentPage(c => Math.min(pageCount, c + 1))}
                        className="text-xs font-semibold px-3 py-1 bg-black/[0.04] hover:bg-black/[0.08] disabled:opacity-30 rounded-lg transition-colors border border-black/[0.04] cursor-pointer text-[#1d1d1f] disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column - Controls Console */}
                <div className="lg:col-span-5 flex flex-col h-full min-h-[400px] gap-4">
                  
                  {/* Tab Controls Panel */}
                  <div className="bg-white border border-black/[0.08] rounded-3xl p-5 flex flex-col min-h-0 flex-1 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                    
                    {/* macOS Segmented Switcher */}
                    <div className="flex bg-[#f5f5f7] border border-black/[0.04] p-1 rounded-2xl mb-4 gap-1 shrink-0">
                      {[
                        { label: "AI Prompt", id: "agent" },
                        { label: "Redact", id: "redact" },
                        { label: "Macro Console", id: "script" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex-1 text-[11px] font-semibold py-1.5 rounded-xl transition-all cursor-pointer border-0 ${
                            activeTab === tab.id
                              ? "bg-white text-[#1d1d1f] shadow-sm font-bold"
                              : "bg-transparent text-[#6e6e73] hover:text-[#1d1d1f]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Active Tab Panel Body */}
                    <div className="flex-grow overflow-y-auto pr-1 min-h-0 text-xs">
                      
                      {activeTab === "agent" && (
                        <div className="space-y-4 h-full flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">
                              AI Natural Language Action
                            </span>
                            <p className="text-[#6e6e73] text-xs leading-relaxed font-normal">
                              Instruct the local agent to edit this PDF (e.g. &quot;rotate first page 90 degrees&quot;, &quot;watermark confidential&quot;, &quot;redact emails&quot;).
                            </p>
                          </div>

                          <form onSubmit={runAgentPrompt} className="space-y-3 pt-2">
                            <textarea
                              rows={4}
                              value={agentPrompt}
                              onChange={(e) => setAgentPrompt(e.target.value)}
                              placeholder="e.g. rotate page 1 by 180 degrees and stamp DRAFT..."
                              className="w-full bg-[#fbfbfd] border border-black/[0.08] text-[#1d1d1f] rounded-2xl p-3 text-xs focus:outline-none focus:border-[#0071e3] focus:ring-3 focus:ring-[#0071e3]/10 placeholder-[#86868b] resize-none font-mono leading-relaxed"
                            />
                            <button
                              type="submit"
                              disabled={!agentPrompt.trim() || isProcessing}
                              className="w-full h-10 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-30 text-white font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all border-0 cursor-pointer disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
                            >
                              Execute Local AI Prompt
                            </button>
                          </form>
                        </div>
                      )}

                      {activeTab === "redact" && (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">
                              Canvas Redaction Controller
                            </span>
                            <p className="text-[#6e6e73] text-xs leading-relaxed font-normal">
                              Click and drag redaction boxes over the PDF viewport on the left, then bake them permanently to black out sensitive data.
                            </p>
                          </div>

                          <div className="flex gap-2 bg-[#f5f5f7] p-1 rounded-2xl border border-black/[0.04]">
                            <button
                              onClick={() => setActiveTool("redact")}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-0 ${
                                activeTool === "redact"
                                  ? "bg-white text-[#ff3b30] shadow-sm font-bold"
                                  : "bg-transparent text-[#6e6e73] hover:text-[#1d1d1f]"
                              }`}
                            >
                              Redact mode
                            </button>
                            <button
                              onClick={() => setActiveTool("select")}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-0 ${
                                activeTool === "select"
                                  ? "bg-white text-[#1d1d1f] shadow-sm font-bold"
                                  : "bg-transparent text-[#6e6e73] hover:text-[#1d1d1f]"
                              }`}
                            >
                              Select mode
                            </button>
                          </div>

                          <button
                            onClick={applyRedactionBake}
                            disabled={isProcessing}
                            className="w-full h-10 bg-[#ff3b30] hover:bg-[#d70015] text-white font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-colors border-0 cursor-pointer shadow-sm shadow-red-500/10"
                          >
                            <ShieldCheck className="size-4" />
                            Bake Redactions into PDF
                          </button>
                        </div>
                      )}

                      {activeTab === "script" && (
                        <div className="space-y-4 h-full flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">
                              JavaScript Sandbox Macro
                            </span>
                            <p className="text-[#6e6e73] text-xs leading-relaxed font-normal">
                              Run custom scripts directly inside your browser container using the programmatic `pdf-lib` document API.
                            </p>
                          </div>

                          <div className="flex-grow pt-1">
                            <textarea
                              rows={8}
                              value={macroScript}
                              onChange={(e) => setMacroScript(e.target.value)}
                              className="w-full bg-[#fbfbfd] border border-black/[0.08] text-[#1d1d1f] rounded-2xl p-3 text-xs font-mono focus:outline-none focus:border-[#0071e3] resize-none leading-relaxed"
                            />
                          </div>

                          <button
                            onClick={runMacroScript}
                            disabled={isProcessing}
                            className="w-full h-10 bg-[#34c759] hover:bg-[#28a745] text-white font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-colors mt-2 border-0 cursor-pointer shadow-sm shadow-green-500/10"
                          >
                            Run JavaScript Macro
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Terminal Logs Panel (Apple Console Style) */}
                  <div className="bg-[#1c1c1e] border border-black/[0.08] rounded-3xl p-4.5 h-48 flex flex-col shrink-0 shadow-xl text-white">
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 mb-2 shrink-0">
                      <Terminal className="size-3.5 text-[#30d158]" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#30d158]">
                        Local Console Stream
                      </span>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto font-mono text-[10px] space-y-1.5 pr-1 text-[#a1a1aa] leading-relaxed">
                      {terminalLogs.map((log, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="text-[#71717a] shrink-0">[{log.timestamp}]</span>
                          <span className={log.type === "success" ? "text-[#30d158]" : log.type === "warn" ? "text-[#ffd60a]" : log.type === "error" ? "text-[#ff453a] font-semibold" : "text-[#e4e4e7]"}>
                            {log.message}
                          </span>
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}