// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WaterballSA 軟體學院",
  description: "軟體設計模式精通之旅",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      {/* 這裡乾乾淨淨，只負責顯示裡面的內容 */}
      <body>{children}</body>
    </html>
  );
}