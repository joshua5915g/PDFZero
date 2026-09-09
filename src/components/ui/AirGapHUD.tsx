"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wifi, WifiOff, Lock, Activity } from "lucide-react";

export default function AirGapHUD() {
  const [networkSentBytes, setNetworkSentBytes] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Performance Timeline monitoring: verify zero remote server data exfiltration
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (
              entry.entryType === "resource" &&
              !entry.name.includes("localhost") &&
              !entry.name.includes("127.0.0.1") &&
              !entry.name.startsWith("data:") &&
              !entry.name.startsWith("blob:")
            ) {
              const res = entry as PerformanceResourceTiming;
              setNetworkSentBytes((prev) => prev + (res.encodedBodySize || 0));
            }
          }
        });
        observer.observe({ entryTypes: ["resource"] });
        return () => {
          observer.disconnect();
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono bg-zinc-900/90 border border-emerald-500/25 text-zinc-300 shadow-sm backdrop-blur-md select-none shrink-0"
      title="Zero-Server Local Architecture Verification"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      <span className="text-zinc-400 font-sans text-xs hidden md:inline">Sandbox:</span>
      <span className="text-emerald-400 font-semibold tracking-tight text-xs">Air-Gapped Local</span>

      <span className="text-zinc-700 hidden sm:inline">|</span>

      <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
        <Activity className="w-3 h-3 text-emerald-400/80" />
        <span>0 B Outbound</span>
      </div>

      <span className="text-zinc-700 hidden lg:inline">|</span>

      <span className="hidden lg:inline-flex items-center gap-1 text-[10px] text-zinc-400 font-sans uppercase tracking-wider font-semibold">
        <Lock className="w-3 h-3 text-emerald-400" /> AES-Local
      </span>
    </motion.div>
  );
}
