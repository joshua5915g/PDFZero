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
  title: "PDFZero — Apple Studio Document Suite",
  description: "160+ free tools for PDF, images, dev conversions, and business documents. 100% private, client-side, zero-upload WebAssembly processing.",
  manifest: "/manifest.json",
  themeColor: "#fbfbfd",
  openGraph: {
    title: "PDFZero — Apple Studio Document Suite",
    description: "Fast, private, client-side PDF editing and 160 free offline tools.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDFZero — Apple Studio Document Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFZero — Apple Studio Document Suite",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-[#1d1d1f]" suppressHydrationWarning>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
