"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, AlertOctagon, FileCheck, ShieldCheck, HardDrive } from "lucide-react";

export interface DefensiveDropZoneProps {
  acceptTypes?: string[];
  maxBytes?: number; // default 100MB
  onValidPayload: (files: File[]) => void;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function DefensiveDropZone({
  acceptTypes = ["application/pdf", ".pdf"],
  maxBytes = 100 * 1024 * 1024, // 100MB budget
  onValidPayload,
  label = "Select or drop documents here",
  sublabel = "100% processed in local browser RAM",
  className = ""
}: DefensiveDropZoneProps) {
  const [dragState, setDragState] = useState<"idle" | "valid_drag" | "invalid_drag">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inspectFiles = useCallback(
    async (files: File[]) => {
      setErrorMessage(null);
      if (!files.length) return;

      const file = files[0];

      // 1. Hard Memory Budget Check
      if (file.size > maxBytes) {
        setErrorMessage(
          `Memory budget exceeded: ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds local browser RAM allocation ceiling of ${(maxBytes / (1024 * 1024)).toFixed(0)}MB.`
        );
        return;
      }

      // 2. MIME & Signature Extension Check
      const matchesType = acceptTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes("/*")) {
          const base = type.split("/")[0];
          return file.type.startsWith(base + "/");
        }
        return file.type === type;
      });

      if (!matchesType && acceptTypes.length > 0) {
        setErrorMessage(
          `Security reject: File signature [${file.type || "unknown binary"}] does not match accepted [${acceptTypes.join(", ")}].`
        );
        return;
      }

      // 3. Magic-Byte Verification for PDFs
      if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
        try {
          const slice = file.slice(0, 8);
          const buffer = await slice.arrayBuffer();
          const header = String.fromCharCode(...new Uint8Array(buffer).slice(0, 4));
          if (header !== "%PDF") {
            setErrorMessage("Malformed payload: Binary header lacks standard '%PDF-' magic bytes.");
            return;
          }
        } catch {
          setErrorMessage("System lock: Unable to allocate local buffer slice for inspection.");
          return;
        }
      }

      setStagedFile(file);
      onValidPayload(files);
    },
    [acceptTypes, maxBytes, onValidPayload]
  );

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragState("valid_drag");
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragState("idle");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragState("idle");
          const droppedFiles = Array.from(e.dataTransfer.files || []);
          if (droppedFiles.length > 0) inspectFiles(droppedFiles);
        }}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.006 }}
        whileTap={{ scale: 0.994 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors duration-200 select-none ${
          dragState === "valid_drag"
            ? "border-emerald-500/80 bg-emerald-950/20"
            : errorMessage
            ? "border-rose-500/50 bg-rose-950/15"
            : "border-zinc-800 bg-[#0c0d10] hover:border-zinc-700"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = Array.from(e.target.files || []);
            if (f.length > 0) inspectFiles(f);
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800/80 text-zinc-300 shadow-inner">
            <UploadCloud className="w-6 h-6 text-zinc-400" />
          </div>

          <div>
            <div className="text-sm font-semibold text-[#e2e4e9] tracking-tight">{label}</div>
            <div className="text-xs text-[#8c929d] mt-1">{sublabel}</div>
          </div>

          <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-[#5e636e]">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-zinc-500" />
              Budget: {(maxBytes / (1024 * 1024)).toFixed(0)}MB RAM
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400/90 font-sans font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Air-Gapped Local
            </span>
          </div>
        </div>
      </motion.div>

      {/* Error HUD */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
