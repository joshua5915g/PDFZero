"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Copy, RefreshCw } from "lucide-react";

const generatePassword = (length: number, includeSymbols: boolean): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  let chars = uppercase + lowercase + numbers;
  if (includeSymbols) chars += symbols;
  
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState("PDFZero!2024");
  const [length, setLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const newPassword = generatePassword(length, includeSymbols);
    setPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#6366F1] transition-colors gap-2">
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="bg-[#151824]/40 border border-white/[0.06] p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <Lock className="size-6 text-[#E25B45]" />
          <h1 className="text-xl font-bold text-[#F1F3F9]">Password Generator</h1>
        </div>
        <p className="text-sm text-[#7E84A3]">
          Generate strong, secure passwords for your PDFs and applications.
        </p>
      </div>

      <div className="bg-[#121420]/30 border border-white/[0.06] backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
        <div className="space-y-4">
          {/* Password Display */}
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-gray-800 flex items-center">
              {password}
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                copied 
                  ? "bg-green-500 text-white" 
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <Copy className="size-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-green-600">Copied to clipboard!</p>}

          {/* Settings */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Include symbols (!@#$%^&*)</span>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full bg-[#6366F1] text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-4" />
            Generate Password
          </button>
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✓ Use passwords at least 12 characters long</li>
            <li>✓ Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>✓ Never reuse passwords across different PDFs</li>
            <li>✓ Store passwords securely</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
