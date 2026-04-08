// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // 1. 確認有引入這行

import { AuthProvider } from "@/context/AuthContext";
import { JourneyProvider } from "@/context/JourneyContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import OnboardingOverlay from "@/components/layout/OnboardingOverlay";

const inter = Inter({ subsets: ["latin"] });

// 全域 SEO 配置
export const metadata: Metadata = {
  title: {
    default: "Σ-Codeatl | 軟體技術實戰學習地圖",
    template: "%s | Σ-Codeatl",
  },
  description: "Σ-Codeatl：專業領航，透過遊戲化的方式精通軟體架構、設計模式與實戰開發技巧。讓學習軟體設計不再枯燥。台北最具深度的軟體技術學習平網。",
  keywords: ["軟體設計", "設計模式", "Software Patterns", "Clean Code", "Σ-Codeatl", "程式教學"],
  authors: [{ name: "Ray" }, { name: "Waterball Pan" }],
  creator: "Σ-Codeatl Team",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://codeatl.tw",
    siteName: "Σ-Codeatl",
    title: "Σ-Codeatl | 軟體開發者的神話修煉場",
    description: "開啟你的軟體設計大師之路，透過羽蛇神 (Quetzalcoatl) 傳說主題與實戰挑戰，精通現代開發技術。",
    images: [
      {
        url: "/images/og-main.png",
        width: 1200,
        height: 630,
        alt: "Σ-Codeatl - 遊戲化學習地圖",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Σ-Codeatl | 軟體開發者的神話修煉場",
    description: "透過遊戲化挑戰與羽蛇神視覺體驗，精通軟體架構與跨端技術。",
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
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <JourneyProvider>
              <NotificationProvider>
                <OnboardingOverlay />
                {children}

                {/* ★★★ 2. 必須加上這一行，Sonner 的提示視窗才會出現 ★★★ */}
                <Toaster position="top-center" richColors closeButton />
              </NotificationProvider>
            </JourneyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}