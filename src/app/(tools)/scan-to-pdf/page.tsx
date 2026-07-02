"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Trash2, CheckCircle, VideoOff } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function ScanToPdf() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  // List available video input devices (cameras)
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request temporary permission to enumerate devices fully
        await navigator.mediaDevices.getUserMedia({ video: true });
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err: any) {
        console.warn("Could not list video inputs: ", err);
      }
    };
    getDevices();
  }, []);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setErrorMsg("");
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Camera access denied. Please grant webcam permissions or verify device connections.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePage = () => {
    const video = videoRef.current;
    if (!video || !stream) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Draw current video frame onto offscreen canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL("image/png");

      setCapturedImages((prev) => [...prev, imgData]);
    } catch (err: any) {
      console.error(err);
      alert("Failed to capture snapshot frame.");
    }
  };

  const deleteSnapshot = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const compileScanPdf = async () => {
    if (capturedImages.length === 0) return;
    setIsProcessing(true);
    setStatus("Generating PDF pages...");

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < capturedImages.length; i++) {
        setStatus(`Embedding page image ${i + 1} of ${capturedImages.length}...`);
        const dataUrl = capturedImages[i];
        
        // Convert image base64 data to bytes
        const imageBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
        const embeddedImg = await pdfDoc.embedPng(imageBytes);

        // Add page matching image dimensions
        const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: embeddedImg.width,
          height: embeddedImg.height,
        });
      }

      setStatus("Saving scanned document...");
      const pdfBytes = await pdfDoc.save();

      setStatus("Triggering download...");
      const scanBlob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(scanBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfghost_scanned_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 2000);

      setStatus("Done!");
      setCapturedImages([]);
      stopCamera();
    } catch (err: any) {
      console.error(err);
      alert(`Scanned document compilation failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 text-zinc-900 dark:text-zinc-50 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black dark:border-white pb-6 space-y-4 sm:space-y-0">
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 text-sm font-bold border-2 border-black dark:border-zinc-300 px-3 py-1 bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HOME</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tighter">
              SCAN-TO-PDF
            </h1>
          </div>
          <div className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(120,120,120,1)]">
            CLIENT-SIDE CAMERA SCANNER
          </div>
        </div>

        {/* Camera stream display split layout */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Stream Window */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 flex flex-col items-center">
            
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-[4/3] bg-black border-2 border-black dark:border-zinc-700"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-950 border-2 border-dashed border-zinc-400 flex flex-col items-center justify-center text-zinc-400">
                <VideoOff className="w-12 h-12 mb-2" />
                <span className="text-xs font-bold uppercase">Camera Stream Offline</span>
              </div>
            )}

            {/* Selector and start controls */}
            <div className="w-full space-y-4">
              {devices.length > 1 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  disabled={!!stream}
                  className="w-full px-3 py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-950 font-bold focus:outline-none focus:border-red-500 rounded-none text-black dark:text-white"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.substring(0, 5)}`}
                    </option>
                  ))}
                </select>
              )}

              <div className="grid grid-cols-2 gap-4">
                {!stream ? (
                  <button
                    onClick={startCamera}
                    className="w-full py-2 border-2 border-black dark:border-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-black uppercase"
                  >
                    Start Webcam
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="w-full py-2 border-2 border-black dark:border-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-black uppercase"
                  >
                    Stop Webcam
                  </button>
                )}

                <button
                  onClick={capturePage}
                  disabled={!stream}
                  className="w-full py-2 border-2 border-black dark:border-zinc-300 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 text-xs font-black uppercase"
                >
                  Capture Page
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="w-full p-3 border-2 border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-bold">
                {errorMsg}
              </div>
            )}

          </div>

          {/* Captured Pages View */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-black dark:text-white border-b-2 border-zinc-200 pb-2">
                Captured Snapshots ({capturedImages.length})
              </label>

              {capturedImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-auto p-1">
                  {capturedImages.map((img, idx) => (
                    <div key={idx} className="relative group border border-black dark:border-zinc-700">
                      <img src={img} alt={`page ${idx}`} className="w-full aspect-[3/4] object-cover" />
                      <button
                        onClick={() => deleteSnapshot(idx)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] px-1 font-bold">
                        P.{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-xs uppercase font-bold">
                  No pages captured yet
                </div>
              )}
            </div>

            {/* Scan Progress */}
            {isProcessing && (
              <div className="border-2 border-black p-3 bg-zinc-50 dark:bg-zinc-950 space-y-2">
                <span className="text-[10px] font-black uppercase block">{status}</span>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 overflow-hidden relative">
                  <div className="bg-black dark:bg-white h-full w-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Compile Scans */}
            <button
              onClick={compileScanPdf}
              disabled={capturedImages.length === 0 || isProcessing}
              className="w-full py-3 border-4 border-black dark:border-zinc-300 bg-black text-white dark:bg-white dark:text-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)] active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>FINISH SCAN & DOWNLOAD</span>
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}
