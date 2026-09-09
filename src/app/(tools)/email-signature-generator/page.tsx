"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Copy, Check, Sparkles, Phone, Globe } from "lucide-react";

export default function EmailSignatureGenerator() {
  const [fullName, setFullName] = useState("Sarah Jenkins");
  const [jobTitle, setJobTitle] = useState("Head of Product Marketing");
  const [company, setCompany] = useState("VentureWave Studio");
  const [email, setEmail] = useState("sarah.j@venturewave.io");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [website, setWebsite] = useState("venturewave.io");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [copiedHtml, setCopiedHtml] = useState(false);

  const rawHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #1e293b;">
  <tr>
    <td style="vertical-align: top; padding-right: 16px;">
      <img src="${avatarUrl}" alt="${fullName}" width="80" height="80" style="border-radius: 50%; display: block; object-fit: cover; border: 2px solid ${themeColor};" />
    </td>
    <td style="vertical-align: top; border-left: 2px solid ${themeColor}; padding-left: 16px;">
      <div style="font-weight: 700; font-size: 16px; color: #0f172a;">${fullName}</div>
      <div style="font-size: 13px; color: ${themeColor}; font-weight: 600; margin-bottom: 6px;">${jobTitle} | ${company}</div>
      <div style="font-size: 12px; color: #475569; margin-bottom: 2px;">
        ✉️ <a href="mailto:${email}" style="color: #475569; text-decoration: none;">${email}</a>
      </div>
      <div style="font-size: 12px; color: #475569; margin-bottom: 2px;">
        📞 <a href="tel:${phone}" style="color: #475569; text-decoration: none;">${phone}</a>
      </div>
      <div style="font-size: 12px; color: #475569;">
        🌐 <a href="https://${website}" style="color: ${themeColor}; text-decoration: none; font-weight: 500;">${website}</a>
      </div>
    </td>
  </tr>
</table>
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
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
            Email Signature Generator
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Create beautiful, responsive HTML email signatures for Gmail, Outlook, Apple Mail, and Yahoo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Personal Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-10 h-9 p-0.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Photo / Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview & Code */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Client Preview</div>
              {/* Actual rendered table */}
              <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Raw HTML Code</span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
                >
                  {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedHtml ? "Copied HTML Code!" : "Copy HTML Code"}
                </button>
              </div>
              <textarea
                readOnly
                value={rawHtml}
                rows={6}
                aria-label="Generated HTML Code"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
