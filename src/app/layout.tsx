import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDFZero - Browser-first PDF toolkit",
  description: "PDFZero is the browser-native PDF editor and converter with client-side privacy, fast WebAssembly workflows, and zero uploads.",
  manifest: "/manifest.json",
  themeColor: "#0F172A",
  openGraph: {
    title: "PDFZero - Browser-first PDF toolkit",
    description: "Fix, convert, and optimize PDFs in the browser with zero upload.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDFZero — browser-native PDF tool suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFZero - Browser-first PDF toolkit",
    description: "Fast, private, client-side PDF editing and conversion.",
  },
};

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
