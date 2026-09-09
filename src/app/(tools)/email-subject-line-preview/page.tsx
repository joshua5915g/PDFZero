"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Smartphone, Monitor, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EmailSubjectLinePreviewPage() {
  const [senderName, setSenderName] = useState("Venture Studio Team");
  const [subjectLine, setSubjectLine] = useState("🚀 Your quarterly product launch checklist is ready");
  const [previewText, setPreviewText] = useState("Open to download the full PDF roadmap and templates before tomorrow's all-hands meeting.");

  const subjectLen = subjectLine.length;
  const isMobileTruncated = subjectLen > 38;
  const isDesktopTruncated = subjectLen > 60;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            Business & Marketing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Email Subject Line Tester & Preview
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Check character limits and simulate how subject lines appear in mobile and desktop inboxes.
          </p>
        </div>

        {/* Inputs */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Sender / Company Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subject Line Length
                </label>
                <span className={`text-xs font-mono font-bold ${subjectLen > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                  {subjectLen} chars
                </span>
              </div>
              <input
                type="text"
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Preheader / Preview Snippet Text
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
            />
          </div>

          {/* Status Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              {isMobileTruncated ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div className="text-xs">
                <div className="font-bold text-white">Mobile Viewport (~38 chars)</div>
                <div className="text-slate-400">
                  {isMobileTruncated ? "Will likely truncate on iPhone / Android Mail." : "Fits fully on mobile screens."}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              {isDesktopTruncated ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div className="text-xs">
                <div className="font-bold text-white">Desktop Viewport (~60 chars)</div>
                <div className="text-slate-400">
                  {isDesktopTruncated ? "Will truncate on Gmail desktop view." : "Fits completely on desktop inboxes."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mock Previews */}
        <div className="space-y-6">
          {/* Mobile Mockup */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" /> Mobile Email Client Preview (iPhone Mail)
            </div>
            <div className="max-w-md p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-950 truncate max-w-[240px]">{senderName}</span>
                <span className="text-slate-400 text-[11px]">9:41 AM</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 truncate">
                {subjectLine}
              </div>
              <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {previewText}
              </div>
            </div>
          </div>

          {/* Desktop Mockup */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-400" /> Desktop Gmail Row Preview
            </div>
            <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-md flex items-center gap-4 text-xs overflow-hidden">
              <span className="font-bold text-slate-950 w-40 shrink-0 truncate">{senderName}</span>
              <div className="flex-1 truncate">
                <span className="font-bold text-slate-900">{subjectLine}</span>
                <span className="text-slate-500 ml-2">— {previewText}</span>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">10:14 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
