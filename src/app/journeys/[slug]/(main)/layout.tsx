// src/app/journeys/[slug]/(main)/layout.tsx
'use client'; // ★ 1. 必須加上這行，因為用到了 Context Hook

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useJourney } from "@/context/JourneyContext"; // ★ 2. 引入 Context Hook

export default function MainJourneyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ★ 3. 從 Context 取得當前旅程資料
    const { activeJourney } = useJourney();

    // ★ 4. 管理手機版 Sidebar 開關狀態 (為了滿足 onClose 屬性)
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0d0e11] text-white">
            {/* 1. 左側固定主選單 */}
            <Sidebar
                // ★ 5. 關鍵修正：把資料傳進去！
                onClose={() => setSidebarOpen(false)} // ★ 6. 補上必要屬性
                className={`
                    w-64 h-screen fixed left-0 top-0 z-50 
                    md:flex 
                    ${isSidebarOpen ? 'flex' : 'hidden'} // 簡單的手機版顯示邏輯
                `}
            />

            {/* 手機版遮罩 (可選，提升體驗) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 2. 右側內容區域 */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

                {/* Header 通常也需要控制 Sidebar 開關 */}
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                // 如果 Header 需要登入功能，也可以在這裡補上 onLoginClick
                />

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}