// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ★★★ 1. 這一行絕對不能少！這是 Tailwind 的命脈 ★★★

import { AuthProvider } from "@/context/AuthContext";
import { JourneyProvider } from "@/context/JourneyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "水球軟體學院",
  description: "軟體設計模式精通之旅",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {/* 2. 這裡只放 Providers，不要放任何 Sidebar 或 Header */}
        <AuthProvider>
          <JourneyProvider>
            {children}
          </JourneyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}