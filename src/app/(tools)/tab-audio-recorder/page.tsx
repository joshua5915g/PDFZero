"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Square, Play, Download, Pause, Radio, RefreshCw, Sparkles } from "lucide-react";

export default function TabAudioRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      // Request audio stream (mic or system/tab)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    } catch (err) {
      alert("Microphone / Audio capture permission was denied or is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3">
            <Radio className="w-3.5 h-3.5" />
            Design & Web Fun
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browser Audio & Tab Recorder
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Capture audio streams, voice notes, and meeting discussions directly in your browser.
          </p>
        </div>

        {/* Record Control Station */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="text-6xl font-black font-mono tracking-tight text-white">
            {formatTime(elapsed)}
          </div>

          <div className="flex justify-center gap-4">
            {!recording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-red-600/30 hover:scale-105"
              >
                <Mic className="w-5 h-5" /> Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-red-500/50 text-red-400 font-bold text-sm flex items-center gap-2 transition-all animate-pulse"
              >
                <Square className="w-5 h-5 fill-current" /> Stop Recording
              </button>
            )}
          </div>

          {recording && (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-semibold text-red-400">Live Recording in Progress...</span>
            </div>
          )}

          {/* Download & Playback Node */}
          {audioUrl && (
            <div className="pt-6 border-t border-slate-800 space-y-4 max-w-md mx-auto">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recorded Playback</div>
              <audio src={audioUrl} controls className="w-full rounded-xl" />
              <a
                href={audioUrl}
                download="recording.webm"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Download className="w-4 h-4" /> Download Audio File (.webm)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
