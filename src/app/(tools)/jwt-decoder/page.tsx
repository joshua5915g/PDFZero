"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, CheckCircle, AlertTriangle, Clock, Sparkles } from "lucide-react";

export default function JwtDecoder() {
  const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImFkbWluIjp0cnVlfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const [token, setToken] = useState(sampleJwt);

  const { header, payload, signature, isExpired, expDate, error } = useMemo(() => {
    if (!token.trim()) {
      return { header: null, payload: null, signature: null, isExpired: false, expDate: null, error: null };
    }

    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) {
        throw new Error("JWT must contain exactly 3 segments separated by dots.");
      }

      const decodeSegment = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        const json = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(json);
      };

      const decodedHeader = decodeSegment(parts[0]);
      const decodedPayload = decodeSegment(parts[1]);
      const sig = parts[2];

      let expired = false;
      let expFormatted = null;

      if (decodedPayload.exp) {
        const expTime = decodedPayload.exp * 1000;
        expired = Date.now() > expTime;
        expFormatted = new Date(expTime).toLocaleString();
      }

      return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: sig,
        isExpired: expired,
        expDate: expFormatted,
        error: null
      };
    } catch (err: any) {
      return { header: null, payload: null, signature: null, isExpired: false, expDate: null, error: err.message };
    }
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All 160 Free Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Converters & Dev</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <Sparkles className="size-3" />
          Offline Token Inspection
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <KeyRound className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">JWT Token Decoder</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Decode and inspect JSON Web Token headers, claims payload, and expiration timestamps securely in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider">Encoded JWT Token</span>
          <button
            onClick={() => setToken("")}
            className="text-slate-400 hover:text-red-400 transition"
          >
            Clear
          </button>
        </div>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste eyJhbGci... token here"
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 break-all resize-none"
        />
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle className="size-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Decoded Inspector */}
      {header && payload && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header */}
          <div className="bg-slate-900/40 border border-rose-500/30 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-rose-500/10 border-b border-rose-500/20 text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
              <span>Header: Algorithm & Token Type</span>
              <span className="font-mono text-[10px] text-rose-300">ALG: {header.alg}</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 bg-slate-950/60 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-slate-900/40 border border-purple-500/30 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-purple-500/10 border-b border-purple-500/20 text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
              <span>Payload: Data Claims</span>
              {expDate && (
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isExpired ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  <Clock className="size-3" /> {isExpired ? "Expired" : "Active"}
                </span>
              )}
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 bg-slate-950/60 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(payload, null, 2)}
            </pre>
            {expDate && (
              <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <span className="font-bold text-purple-300">Expiration (exp):</span>
                <span>{expDate}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
