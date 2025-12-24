// src/app/journeys/[slug]/(main)/layout.tsx

import React from "react";
import Sidebar from "@/components/layout/Sidebar"; // ★ 這是你的主選單元件
import Header from "@/components/layout/Header";   // ★ 這是你的主標題元件 (可選)

export default function MainJourneyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0d0e11] text-white">
            {/* 1. 左側固定主選單 */}
            <Sidebar className="w-64 h-screen fixed left-0 top-0 z-50 hidden md:flex" />

            {/* 2. 右側內容區域 (需留出左邊 Sidebar 的寬度) */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

                {/* 如果你有全站共用的 Header，可以放這裡；如果沒有，可以直接刪掉這一行 */}
                <Header />

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}