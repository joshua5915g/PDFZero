"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Search, Layers, FileText, Image as ImageIcon, Code, Calculator, Briefcase, Smile } from "lucide-react";
import AirGapHUD from "@/components/ui/AirGapHUD";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          <Link 
            href="/" 
            className="flex items-center gap-2.5 font-extrabold text-lg hover:opacity-90 transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="flex flex-col">
              <span className="leading-tight tracking-tight">PDFZero</span>
              <span className="text-[10px] text-blue-400 font-medium">160 Free Tools</span>
            </div>
          </Link>

          {/* Category Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <Link href="/?category=pdf" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 hover:text-white transition">
              PDF Suite
            </Link>
            <Link href="/?category=image" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 hover:text-white transition">
              Image Studio
            </Link>
            <Link href="/?category=converter" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 hover:text-white transition">
              Dev & Converters
            </Link>
            <Link href="/?category=calculator" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 hover:text-white transition">
              Calculators
            </Link>
            <Link href="/?category=marketing" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 hover:text-white transition">
              Business & Docs
            </Link>
            <Link href="/?category=fun" className="px-3 py-1.5 rounded-lg hover:bg-slate-800/60 hover:text-white transition">
              Design & Fun
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden md:flex px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-300 items-center gap-2 transition"
            >
              <Search className="size-3.5 text-slate-400" />
              <span>Search 160 tools</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">/</kbd>
            </Link>
            <AirGapHUD />
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 px-6 py-4 space-y-2 bg-slate-950/95 backdrop-blur-xl">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              All 160 Tools
            </Link>
            <Link 
              href="/?category=pdf" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              PDF Tools (36)
            </Link>
            <Link 
              href="/?category=image" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Image Studio (30)
            </Link>
            <Link 
              href="/?category=converter" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Dev & Converters (29)
            </Link>
            <Link 
              href="/?category=calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Calculators & Units (42)
            </Link>
            <Link 
              href="/?category=marketing" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Business & Marketing (12)
            </Link>
            <Link 
              href="/?category=fun" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Design & Web Fun (15)
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ===== COMPREHENSIVE FOOTER ===== */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12 pb-12 border-b border-slate-800/80 text-sm">
            
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">P</div>
                <span>PDFZero</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                160 essential web tools, PDF suites, image studios, developer utilities, and calculators. 100% free, private, client-side, with zero tracking or watermarks.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">100% Free</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">No Signup</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">No Watermark</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Private</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">PDF Tools</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link href="/compress-pdf" className="hover:text-white transition">Compress PDF</Link></li>
                <li><Link href="/merge-pdf" className="hover:text-white transition">Merge PDF</Link></li>
                <li><Link href="/split-pdf" className="hover:text-white transition">Split PDF</Link></li>
                <li><Link href="/edit-pdf" className="hover:text-white transition">Edit PDF</Link></li>
                <li><Link href="/sign-pdf" className="hover:text-white transition">Sign PDF</Link></li>
                <li><Link href="/pdf-to-word" className="hover:text-white transition">PDF to Word</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Image Tools</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link href="/image-compressor" className="hover:text-white transition">Compress Image</Link></li>
                <li><Link href="/image-resizer" className="hover:text-white transition">Resize Image</Link></li>
                <li><Link href="/format-converter" className="hover:text-white transition">WebP / JPG / PNG</Link></li>
                <li><Link href="/image-color-picker" className="hover:text-white transition">Color Picker</Link></li>
                <li><Link href="/heic-to-jpg" className="hover:text-white transition">HEIC to JPG</Link></li>
                <li><Link href="/image-flipper" className="hover:text-white transition">Flip Image</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Dev & Converters</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link href="/json-validator" className="hover:text-white transition">JSON Validator</Link></li>
                <li><Link href="/base64-encoder" className="hover:text-white transition">Base64 Encoder</Link></li>
                <li><Link href="/regex-tester" className="hover:text-white transition">Regex Tester</Link></li>
                <li><Link href="/jwt-decoder" className="hover:text-white transition">JWT Decoder</Link></li>
                <li><Link href="/uuid-generator" className="hover:text-white transition">UUID Generator</Link></li>
                <li><Link href="/password-generator" className="hover:text-white transition">Password Gen</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Business & Calc</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link href="/invoice-generator" className="hover:text-white transition">Invoice Generator</Link></li>
                <li><Link href="/resume-builder" className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link href="/mortgage-calculator" className="hover:text-white transition">Mortgage Calc</Link></li>
                <li><Link href="/salary-calculator" className="hover:text-white transition">Salary Calculator</Link></li>
                <li><Link href="/unit-converter" className="hover:text-white transition">Unit Converter</Link></li>
                <li><Link href="/barcode-generator" className="hover:text-white transition">Barcode Generator</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <span>&copy; {new Date().getFullYear()} PDFZero • Powered by Client-Side Edge Computing.</span>
            <div className="flex gap-6">
              <span>All 160 Tools Free</span>
              <span>100% Private</span>
              <span>Zero Server Uploads</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
