"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      
      {/* ===== CLEAN HEADER ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition"
          >
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-sm font-black">P</div>
            <span>PDFZero</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/compress-pdf" className="hover:text-blue-400 transition">Compress</Link>
            <Link href="/" className="hover:text-blue-400 transition">All Tools</Link>
          </nav>

          <div className="text-xs text-slate-500">100% Private</div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-800 px-6 py-3 space-y-2">
            <Link href="/compress-pdf" className="block text-sm hover:text-blue-400 transition">Compress PDF</Link>
            <Link href="/" className="block text-sm hover:text-blue-400 transition">All Tools</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ===== SIMPLE FOOTER ===== */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800 text-sm">
            
            <div>
              <h4 className="font-bold mb-3">PDFZero</h4>
              <p className="text-xs text-slate-400">Professional PDF tools for everyone.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">Features</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li><Link href="/compress-pdf" className="hover:text-white transition">Compress</Link></li>
                <li><Link href="/merge-pdf" className="hover:text-white transition">Merge</Link></li>
                <li><Link href="/split-pdf" className="hover:text-white transition">Split</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">Security</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>✓ No uploads</li>
                <li>✓ 100% private</li>
                <li>✓ Always free</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">About</h4>
              <p className="text-xs text-slate-400">Enterprise-grade PDF tools in your browser.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <span>&copy; {new Date().getFullYear()} PDFZero. All rights reserved.</span>
            <div className="flex gap-6">
              <span>No Server Uploads</span>
              <span>Always Private</span>
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
