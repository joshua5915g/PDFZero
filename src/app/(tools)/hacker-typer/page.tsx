"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Maximize2, ShieldAlert, CheckCircle2 } from "lucide-react";

const KERNEL_SNIPPET = `/*
 * Linux Kernel memory virtualization and direct DMA streaming subsystem
 */
static int __init mem_sys_init(void) {
    struct page *page_entry;
    unsigned long flags;
    int ret = 0;

    printk(KERN_INFO "[SYS] Initializing cryptographic hardware RNG subsystem...\\n");
    if (!pci_enable_device(dev)) {
        pr_err("[ERR] Failed to allocate high-mem memory mapping.\\n");
        return -EIO;
    }

    raw_spin_lock_irqsave(&kernel_buffer_lock, flags);
    alloc_dma_coherent(&dev->dev, PAGE_SIZE * 64, &dma_handle, GFP_KERNEL);
    page_entry = alloc_pages(GFP_HIGHUSER_MOVABLE, 4);

    if (unlikely(!page_entry)) {
        ret = -ENOMEM;
        goto unlock_err;
    }

    pr_info("[OK] Injected cryptographic root vector 0x7FFF98A210F\\n");
    return 0;

unlock_err:
    raw_spin_unlock_irqrestore(&kernel_buffer_lock, flags);
    return ret;
}

void stream_cipher_encrypt(u8 *out, const u8 *in, size_t len, const u8 *key) {
    u32 state[16];
    int i;
    for (i = 0; i < 16; i++) {
        state[i] = ((u32*)key)[i % 8] ^ 0x61707865;
    }
    // 20-round ChaCha stream matrix
    for (i = 0; i < 10; i++) {
        QR(state[0], state[4], state[8],  state[12]);
        QR(state[1], state[5], state[9],  state[13]);
        QR(state[2], state[6], state[10], state[14]);
        QR(state[3], state[7], state[11], state[15]);
    }
    mem_xor_output(out, in, state, len);
}
`;

export default function HackerTyperPage() {
  const [typedChars, setTypedChars] = useState(120);
  const [modalStatus, setModalStatus] = useState<"granted" | "denied" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedCode = KERNEL_SNIPPET.slice(0, typedChars % KERNEL_SNIPPET.length);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setModalStatus(null);
      return;
    }
    if (e.altKey) {
      setModalStatus("denied");
      return;
    }
    if (e.key === "Enter") {
      setModalStatus("granted");
      return;
    }

    setTypedChars((c) => c + Math.floor(Math.random() * 4) + 3);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [typedChars]);

  return (
    <div className="min-h-screen bg-black text-emerald-400 py-6 px-4 font-mono select-none flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-emerald-950 pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> [EXIT MATRIX / BACK TO TOOLS]
          </Link>
          <div className="text-emerald-600">
            TYPE ANY KEYS RAPIDLY • [ENTER] = ACCESS GRANTED • [ALT] = DENIED
          </div>
        </div>

        {/* Terminal Screen */}
        <div
          ref={containerRef}
          onClick={() => setTypedChars((c) => c + 15)}
          className="flex-1 bg-black/90 p-6 rounded-2xl border-2 border-emerald-500/30 overflow-y-auto whitespace-pre-wrap leading-relaxed text-sm shadow-[0_0_50px_rgba(16,185,129,0.1)] cursor-text relative"
        >
          {displayedCode}
          <span className="inline-block w-2.5 h-4 bg-emerald-400 ml-1 animate-pulse" />

          {/* ACCESS GRANTED MODAL */}
          {modalStatus === "granted" && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-950 border-4 border-emerald-500 p-8 rounded-3xl text-center space-y-4 shadow-[0_0_80px_rgba(16,185,129,0.5)] max-w-sm">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">ACCESS GRANTED</h2>
                <p className="text-xs text-emerald-400">Root authorization token unlocked. Secure session initiated.</p>
                <button
                  onClick={() => setModalStatus(null)}
                  className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  CONTINUE TERMINAL [ESC]
                </button>
              </div>
            </div>
          )}

          {/* ACCESS DENIED MODAL */}
          {modalStatus === "denied" && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-950 border-4 border-red-500 p-8 rounded-3xl text-center space-y-4 shadow-[0_0_80px_rgba(239,68,68,0.5)] max-w-sm">
                <ShieldAlert className="w-16 h-16 text-red-400 mx-auto animate-pulse" />
                <h2 className="text-2xl font-black text-red-500 tracking-widest uppercase">ACCESS DENIED</h2>
                <p className="text-xs text-red-300">Intrusion countermeasure activated. IP logged.</p>
                <button
                  onClick={() => setModalStatus(null)}
                  className="px-6 py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
                >
                  DISMISS [ESC]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
