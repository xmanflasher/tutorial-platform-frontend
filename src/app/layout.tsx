// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // 1. 確認有引入這行

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
        <AuthProvider>
          <JourneyProvider>
            {children}

            {/* ★★★ 2. 必須加上這一行，Sonner 的提示視窗才會出現 ★★★ */}
            {/* position: 設定出現位置 (top-center, bottom-right 等) */}
            {/* richColors: 讓成功變綠色、失敗變紅色 */}
            {/* closeButton: 顯示關閉按鈕 */}
            <Toaster position="top-center" richColors closeButton />

          </JourneyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}