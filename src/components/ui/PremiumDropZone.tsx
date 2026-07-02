"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";

export interface DropZoneProps {
  accept: string[];
  label: string;
  description?: string;
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

export default function PremiumDropZone({
  accept,
  label,
  description,
  onFilesSelected,
  maxFiles = 10,
  maxSizeMB = 20,
  className = "",
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const validateFiles = (files: File[]) => {
    setError(null);
    const validFiles: File[] = [];

    if (files.length > maxFiles) {
      setError(`Maximum of ${maxFiles} files allowed.`);
      return;
    }

    for (const file of files) {
      const isAccepted = accept.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes("/*")) {
          const baseType = type.split("/")[0];
          return file.type.startsWith(baseType + "/");
        }
        return file.type === type;
      });

      if (!isAccepted) {
        setError(`Invalid file type: ${file.name}. Only ${accept.join(", ")} accepted.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds ${maxSizeMB}MB size limit.`);
        return;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateFiles(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full py-12 px-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-[#151824]/40 hover:bg-[#1C1F2E]/60 border border-dashed ${
          isDragging ? "border-[#6366F1] bg-[#6366F1]/5" : "border-white/10 hover:border-white/20"
        } ${className}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          multiple={maxFiles > 1}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4 text-center">
          <div className={`p-4 rounded-full transition-colors duration-300 ${
            isDragging ? "bg-[#6366F1]/20 text-[#818cf8]" : "bg-[#6366F1]/10 text-[#6366F1]"
          }`}>
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-semibold tracking-tight text-[#F1F3F9]">
              {label}
            </span>
            {description && (
              <span className="text-xs text-[#7E84A3] block">
                {description}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl flex items-start space-x-3 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cloud Integrations Mock Import Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Or import from:</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            alert("Connecting to Google Drive OAuth flow... Success!");
            const mockFile = new File(["mock pdf stream"], "google_drive_import.pdf", { type: "application/pdf" });
            onFilesSelected([mockFile]);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#F1F3F9] text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer"
        >
          <span className="size-2 rounded-full bg-blue-500" />
          Google Drive
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            alert("Connecting to Dropbox OAuth flow... Success!");
            const mockFile = new File(["mock pdf stream"], "dropbox_import.pdf", { type: "application/pdf" });
            onFilesSelected([mockFile]);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#F1F3F9] text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer"
        >
          <span className="size-2 rounded-full bg-indigo-500" />
          Dropbox
        </button>
      </div>
    </div>
  );
}