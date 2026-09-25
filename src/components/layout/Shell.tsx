"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { ALL_TOOLS, CATEGORY_METADATA } from "@/lib/toolsRegistry";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3]/20 selection:text-[#0071e3]">
      
      {/* ===== APPLE STUDIO HEADER ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          <Link 
            href="/" 
            className="flex items-center gap-2.5 font-bold text-base hover:opacity-90 transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-xl px-1"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#42a5f5] flex items-center justify-center text-white text-sm font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="leading-tight tracking-tight font-bold text-lg text-[#1d1d1f]">PDFZero</span>
          </Link>

          {/* Category Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[#4b4b4e]">
            <Link href="/?category=pdf" className="px-3 py-1.5 rounded-full hover:bg-black/[0.04] hover:text-[#1d1d1f] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]">
              PDF Suite
            </Link>
            <Link href="/?category=image" className="px-3 py-1.5 rounded-full hover:bg-black/[0.04] hover:text-[#1d1d1f] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]">
              Image Studio
            </Link>
            <Link href="/?category=converter" className="px-3 py-1.5 rounded-full hover:bg-black/[0.04] hover:text-[#1d1d1f] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]">
              Dev & Converters
            </Link>
            <Link href="/?category=calculator" className="px-3 py-1.5 rounded-full hover:bg-black/[0.04] hover:text-[#1d1d1f] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]">
              Calculators
            </Link>
            <Link href="/?category=marketing" className="px-3 py-1.5 rounded-full hover:bg-black/[0.04] hover:text-[#1d1d1f] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]">
              Business & Docs
            </Link>
            <Link href="/?category=fun" className="px-3 py-1.5 rounded-full hover:bg-black/[0.04] hover:text-[#1d1d1f] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]">
              Design & Fun
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden md:flex px-3.5 py-1.5 bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] rounded-full text-xs text-[#4b4b4e] hover:text-[#1d1d1f] items-center gap-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
            >
              <Search className="size-3.5 text-[#6e6e73]" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 bg-black/[0.06] rounded-md text-[10px] text-[#4b4b4e] font-mono font-medium">/</kbd>
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-black/[0.05] rounded-xl transition text-[#1d1d1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/[0.06] px-6 py-4 space-y-2 bg-white/95 backdrop-blur-2xl shadow-xl">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#1d1d1f] font-semibold hover:text-[#0071e3]"
            >
              All Tools ({ALL_TOOLS.length})
            </Link>
            <Link 
              href="/?category=pdf" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#4b4b4e] hover:text-[#1d1d1f]"
            >
              PDF Tools ({CATEGORY_METADATA.pdf.count})
            </Link>
            <Link 
              href="/?category=image" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#4b4b4e] hover:text-[#1d1d1f]"
            >
              Image Studio ({CATEGORY_METADATA.image.count})
            </Link>
            <Link 
              href="/?category=converter" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#4b4b4e] hover:text-[#1d1d1f]"
            >
              Dev & Converters ({CATEGORY_METADATA.converter.count})
            </Link>
            <Link 
              href="/?category=calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#4b4b4e] hover:text-[#1d1d1f]"
            >
              Calculators & Units ({CATEGORY_METADATA.calculator.count})
            </Link>
            <Link 
              href="/?category=marketing" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#4b4b4e] hover:text-[#1d1d1f]"
            >
              Business & Marketing ({CATEGORY_METADATA.marketing.count})
            </Link>
            <Link 
              href="/?category=fun" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#4b4b4e] hover:text-[#1d1d1f]"
            >
              Design & Web Fun ({CATEGORY_METADATA.fun.count})
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ===== APPLE STUDIO FOOTER ===== */}
      <footer className="border-t border-black/[0.06] bg-[#f5f5f7] py-12 mt-auto text-[#4b4b4e]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12 pb-12 border-b border-black/[0.06] text-sm">
            
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#1d1d1f]">
                <div className="w-6 h-6 rounded-lg bg-[#0071e3] flex items-center justify-center text-white text-xs font-black">P</div>
                <span>PDFZero Studio</span>
              </div>
              <p className="text-xs text-[#52525b] max-w-sm leading-relaxed font-normal">
                {ALL_TOOLS.length} essential tools for documents, PDF management, images, and developer workflows. Built with client-side WebAssembly—your files never upload to a cloud server.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#4b4b4e]">
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] shadow-xs">100% Client-Side</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] shadow-xs">No Signup</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] shadow-xs">Zero Tracking</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] shadow-xs">Air-Gapped</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1d1d1f] mb-3">PDF Suite</h4>
              <ul className="space-y-1.5 text-xs text-[#6e6e73]">
                <li><Link href="/compress-pdf" className="hover:text-[#0071e3] transition">Compress PDF</Link></li>
                <li><Link href="/merge-pdf" className="hover:text-[#0071e3] transition">Merge PDF</Link></li>
                <li><Link href="/split-pdf" className="hover:text-[#0071e3] transition">Split PDF</Link></li>
                <li><Link href="/edit-pdf" className="hover:text-[#0071e3] transition">Edit PDF</Link></li>
                <li><Link href="/sign-pdf" className="hover:text-[#0071e3] transition">Sign PDF</Link></li>
                <li><Link href="/pdf-to-word" className="hover:text-[#0071e3] transition">PDF to Word</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1d1d1f] mb-3">Image Studio</h4>
              <ul className="space-y-1.5 text-xs text-[#6e6e73]">
                <li><Link href="/image-compressor" className="hover:text-[#0071e3] transition">Compress Image</Link></li>
                <li><Link href="/image-resizer" className="hover:text-[#0071e3] transition">Resize Image</Link></li>
                <li><Link href="/format-converter" className="hover:text-[#0071e3] transition">WebP / JPG / PNG</Link></li>
                <li><Link href="/image-color-picker" className="hover:text-[#0071e3] transition">Color Picker</Link></li>
                <li><Link href="/heic-to-jpg" className="hover:text-[#0071e3] transition">HEIC to JPG</Link></li>
                <li><Link href="/image-flipper" className="hover:text-[#0071e3] transition">Flip Image</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1d1d1f] mb-3">Dev Utilities</h4>
              <ul className="space-y-1.5 text-xs text-[#6e6e73]">
                <li><Link href="/json-validator" className="hover:text-[#0071e3] transition">JSON Validator</Link></li>
                <li><Link href="/base64-encoder" className="hover:text-[#0071e3] transition">Base64 Encoder</Link></li>
                <li><Link href="/regex-tester" className="hover:text-[#0071e3] transition">Regex Tester</Link></li>
                <li><Link href="/jwt-decoder" className="hover:text-[#0071e3] transition">JWT Decoder</Link></li>
                <li><Link href="/uuid-generator" className="hover:text-[#0071e3] transition">UUID Generator</Link></li>
                <li><Link href="/password-generator" className="hover:text-[#0071e3] transition">Password Gen</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1d1d1f] mb-3">Business & Calc</h4>
              <ul className="space-y-1.5 text-xs text-[#6e6e73]">
                <li><Link href="/invoice-generator" className="hover:text-[#0071e3] transition">Invoice Generator</Link></li>
                <li><Link href="/resume-builder" className="hover:text-[#0071e3] transition">Resume Builder</Link></li>
                <li><Link href="/mortgage-calculator" className="hover:text-[#0071e3] transition">Mortgage Calc</Link></li>
                <li><Link href="/salary-calculator" className="hover:text-[#0071e3] transition">Salary Calculator</Link></li>
                <li><Link href="/unit-converter" className="hover:text-[#0071e3] transition">Unit Converter</Link></li>
                <li><Link href="/barcode-generator" className="hover:text-[#0071e3] transition">Barcode Generator</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#86868b] gap-4">
            <span>&copy; {new Date().getFullYear()} PDFZero Studio • 100% Client-Side Privacy</span>
            <div className="flex gap-6">
              <span>Zero Cloud Uploads</span>
              <span>WebAssembly Engine</span>
              <span>Air-Gapped In-Browser</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
