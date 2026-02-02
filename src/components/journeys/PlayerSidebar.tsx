// src/components/journeys/PlayerSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    PlayCircle,
    FileText,
    CheckCircle,
    Lock,
    ScrollText,
    Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerUI } from "@/context/PlayerUIContext";
// import { useJourney } from "@/context/JourneyContext"; // 移除：不再依賴 Context
import { JourneyDetail } from "@/types"; // 引入型別

// 根據單元類型回傳對應 Icon
const getMissionIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle size={16} className="text-green-500" />;

    switch (type) {
        case 'video': return <PlayCircle size={16} />;
        case 'scroll': return <ScrollText size={16} />;
        case 'google-form': return <FileText size={16} />;
        default: return <Type size={16} />;
    }
};

// ★ 1. 定義介面
interface PlayerSidebarProps {
    journey: JourneyDetail;
}

// ★ 2. 接收 journey prop
export default function PlayerSidebar({ journey }: PlayerSidebarProps) {
    const pathname = usePathname();
    const { isSidebarOpen } = usePlayerUI();
    // const { activeJourney } = useJourney(); // 移除
    const safeSlug = journey?.slug || "software-design-pattern";
    // 控制哪些章節是展開的
    const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([]);

    // ★ 自動展開邏輯：依賴傳入的 journey
    useEffect(() => {
        if (!journey || !journey.chapters) return;

        journey.chapters.forEach((chapter) => {
            const hasActiveMission = chapter.lessons.some((lesson) =>
                pathname.includes(`/missions/${lesson.id}`)
            );
            if (hasActiveMission) {
                setExpandedChapterIds((prev) =>
                    prev.includes(chapter.id) ? prev : [...prev, chapter.id]
                );
            }
        });
    }, [pathname, journey]);

    const toggleChapter = (id: number) => {
        setExpandedChapterIds((prev) =>
            prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
        );
    };

    if (!journey) return null;

    return (
        <aside
            className={cn(
                "bg-[#111827] border-r border-gray-800 h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0",
                // 根據 Context 決定寬度：開的時候 80 (320px)，關的時候 0
                isSidebarOpen ? "w-80 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0"
            )}
        >
            {/* 內層容器：固定寬度，防止文字在 sidebar 縮小時換行擠壓 */}
            <div className="w-80 h-full flex flex-col">

                {/* 標題區 */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="font-bold text-white text-base">課程目錄</h2>
                    <span className="text-xs text-gray-500">
                        {journey.totalVideos ? `共 ${journey.totalVideos} 單元` : ''}
                    </span>
                </div>

                {/* 列表區 (可捲動) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                    {journey.chapters?.map((chapter) => {
                        const isExpanded = expandedChapterIds.includes(chapter.id);

                        return (
                            <div key={chapter.id} className="border-b border-gray-800/50">
                                {/* 章節標題 */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-800 transition-colors group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                                            {chapter.name}
                                        </div>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown size={16} className="text-gray-500" />
                                    ) : (
                                        <ChevronRight size={16} className="text-gray-500" />
                                    )}
                                </button>

                                {/* 單元列表 */}
                                <div
                                    className={cn(
                                        "bg-[#0b1120] overflow-hidden transition-all duration-300 ease-in-out",
                                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                    )}
                                >
                                    {chapter.lessons.map((lesson) => {
                                        // 判斷是否為當前頁面
                                        const isActive = pathname.includes(`/missions/${lesson.id}`);

                                        // 這裡先假定還沒有 isCompleted 欄位
                                        const isCompleted = false;

                                        return (
                                            <Link
                                                key={lesson.id}
                                                // 組裝 URL：這裡使用 props 傳進來的 journey.slug
                                                href={`/journeys/${safeSlug}/chapters/${chapter.id}/missions/${lesson.id}`}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-[3px]",
                                                    isActive
                                                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                        : "border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                                )}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {getMissionIcon(lesson.type, isCompleted)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={cn("truncate leading-relaxed", isActive && "font-medium")}>
                                                        {lesson.name}
                                                    </div>
                                                </div>

                                                {/* ★ 修正：右側狀態顯示邏輯 (試看 vs 鎖頭) */}
                                                <div className="text-xs text-slate-500 shrink-0 ml-1">
                                                    {!lesson.premiumOnly ? (
                                                        <span className="px-1.5 py-0.5 bg-yellow-400/10 text-yellow-400 rounded border border-yellow-400/20 font-bold text-[10px]">
                                                            試看
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            {lesson.videoLength && (
                                                                <span className="text-[11px]">{lesson.videoLength}</span>
                                                            )}
                                                            {!isActive && <Lock size={12} className="text-gray-500" />}
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}