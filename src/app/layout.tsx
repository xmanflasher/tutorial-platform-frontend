// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // 1. 確認有引入這行

import { AuthProvider } from "@/context/AuthContext";
import { JourneyProvider } from "@/context/JourneyContext";
import { NotificationProvider } from "@/context/NotificationContext"; // 新增
import OnboardingOverlay from "@/components/layout/OnboardingOverlay";

const inter = Inter({ subsets: ["latin"] });

// 全域 SEO 配置
export const metadata: Metadata = {
  title: {
    default: "水球軟體學院 | 軟體設計模式精通之旅",
    template: "%s | 水球軟體學院",
  },
  description: "專業大師領航，透過遊戲化的方式精通軟體架構、設計模式與實戰開發技巧。讓學習軟體設計不再枯燥。台北最具深度的軟體學院專案。",
  keywords: ["軟體設計", "設計模式", "Software Patterns", "Clean Code", "水球軟體學院", "程式教學"],
  authors: [{ name: "水球潘 (Waterball Pan)" }],
  creator: "Waterball Academy",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://waterballsa.tw",
    siteName: "水球軟體學院",
    title: "水球軟體學院 | 軟體設計模式精通之旅",
    description: "開啟你的軟體設計大師之路，透過遊戲化地圖與實戰挑戰，精通設計模式。",
    images: [
      {
        url: "/images/og-main.png",
        width: 1200,
        height: 630,
        alt: "水球軟體學院 - 遊戲化學習地圖",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "水球軟體學院 | 軟體設計模式精通之旅",
    description: "透過遊戲化挑戰，精通軟體架構與設計模式。",
    images: ["/images/og-main.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
            <NotificationProvider> {/* 新增 */}
              <OnboardingOverlay />
              {children}

              {/* ★★★ 2. 必須加上這一行，Sonner 的提示視窗才會出現 ★★★ */}
              {/* position: 設定出現位置 (top-center, bottom-right 等) */}
              {/* richColors: 讓成功變綠色、失敗變紅色 */}
              {/* closeButton: 顯示關閉按鈕 */}
              <Toaster position="top-center" richColors closeButton />
            </NotificationProvider>
          </JourneyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}