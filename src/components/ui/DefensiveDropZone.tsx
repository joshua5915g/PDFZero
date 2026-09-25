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
        tabIndex={0}
        role="button"
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        whileHover={{ scale: 1.006 }}
        whileTap={{ scale: 0.994 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 ${
          dragState === "valid_drag"
            ? "border-[#0071e3] bg-[#0071e3]/5 shadow-[0_8px_32px_rgba(0,113,227,0.1)] scale-[1.01]"
            : errorMessage
            ? "border-[#ff3b30]/60 bg-[#ff3b30]/5"
            : "border-black/[0.1] bg-white hover:border-[#0071e3]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
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
          <div className="p-3.5 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] shadow-xs">
            <UploadCloud className="w-7 h-7 text-[#0071e3]" />
          </div>

          <div>
            <div className="text-sm sm:text-base font-bold text-[#1d1d1f] tracking-tight">{label}</div>
            <div className="text-xs text-[#6e6e73] mt-1 font-normal">{sublabel}</div>
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
            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#d70015] text-xs font-medium"
          >
            <AlertOctagon className="w-4 h-4 text-[#d70015] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
