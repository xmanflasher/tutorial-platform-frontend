// src/components/journeys/PlayerHeader.tsx
'use client';

import { Menu, ArrowLeft } from 'lucide-react'; // 引入需要的 Icon
import Link from 'next/link';
import { usePlayerUI } from '@/context/PlayerUIContext'; // 引入 UI 控制 Context
import UserMenu from '@/components/layout/Header/UserMenu'; // 複用現有的 UserMenu (很棒！)
import { useAuth } from '@/context/AuthContext';

interface PlayerHeaderProps {
    title: string; // 接收課程標題
}

export default function PlayerHeader({ title }: PlayerHeaderProps) {
    const { toggleSidebar } = usePlayerUI();
    const { user } = useAuth();

    return (
        <header className="h-16 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-40">

            {/* 左側：控制區 */}
            <div className="flex items-center gap-4 overflow-hidden">
                {/* 1. 漢堡按鈕：控制 Sidebar 開關 */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="切換目錄"
                >
                    <Menu size={24} />
                </button>

                {/* 2. 分隔線 (Optional) */}
                <div className="h-6 w-px bg-gray-700 hidden md:block"></div>

                {/* 3. 課程標題 (限制一行，超出省略) */}
                <h1 className="font-bold text-gray-200 text-sm md:text-base truncate max-w-[200px] md:max-w-md">
                    {title}
                </h1>
            </div>

            {/* 右側：功能區 */}
            <div className="flex items-center gap-4 flex-shrink-0">

                {/* 返回首頁按鈕 (電腦版顯示文字，手機版顯示 Icon) */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={18} />
                    <span className="hidden md:inline">回到首頁</span>
                </Link>

                {/* 複用既有的 UserMenu，保持體驗一致 */}
                {user && <UserMenu />}
            </div>

        </header>
    );
}