import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { SmartFooter } from "@/components/layout/smart-footer";
import { NewsTicker } from "@/components/layout/news-ticker";
import { SchemaOrg } from "@/components/schema-org";
import dynamic from "next/dynamic";

const AIChatbot = dynamic(() => import("@/components/chat/ai-chatbot").then(mod => mod.AIChatbot), { 
  loading: () => null // Don't block render with a loader
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JCMCSIIT - Engineering the Intelligence of Tomorrow",
  description: "John Cox Memorial CSI Institute of Technology. A premium futuristic technology university platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* Fontshare for Satoshi (Headings) and Clash Display (Subheadings) */}
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&f[]=clash-display@200,400,700,500,600,300&display=swap" rel="stylesheet" />
        <SchemaOrg />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans pt-20">
        <NewsTicker />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <SmartFooter />
        <AIChatbot />
      </body>
    </html>
  );
}
