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
import { orderStore } from "@/lib/orderStore";
import { apiRequest } from "@/lib/api";
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
    const { isSidebarOpen, finishedLessonIds } = usePlayerUI();
    // const { activeJourney } = useJourney(); // 移除
    const safeSlug = journey?.slug || "software-design-pattern";
    
    // 狀態：是否擁有該課程
    const [isOwned, setIsOwned] = useState(false);
    
    // 控制哪些章節是展開的
    const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([]);

    // 初始化：檢查購買狀態
    useEffect(() => {
        if (!journey) return;
        
        // 檢查購買
        setIsOwned(orderStore.isCourseOwned(safeSlug));
    }, [safeSlug, journey]);

    // ★ 自動展開邏輯：依賴傳入的 journey
    useEffect(() => {
        if (!journey || !journey.chapters) return;

        journey.chapters.forEach((chapter) => {
            const hasActiveMission = chapter.lessons.some((lesson) =>
                pathname.includes(`/lessons/${lesson.id}`)
            );
            if (hasActiveMission) {
                setExpandedChapterIds((prev) =>
                    prev.includes(chapter.id) ? prev : [...prev, chapter.id]
                );
            }
        });
    }, [pathname, journey]);

    const toggleChapter = (id: number) => {
        setExpandedChapterIds((prev: number[]) =>
            prev.includes(id) ? prev.filter((cId: number) => cId !== id) : [...prev, id]
        );
    };

    if (!journey) return null;

    return (
        <aside
            className={cn(
                "bg-card border-r border-border-ui h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0",
                // 根據 Context 決定寬度：開的時候 80 (320px)，關的時候 0
                isSidebarOpen ? "w-80 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0"
            )}
        >
            {/* 內層容器：固定寬度，防止文字在 sidebar 縮小時換行擠壓 */}
            <div className="w-80 h-full flex flex-col">

                {/* 標題區 */}
                <div className="p-4 border-b border-border-ui flex items-center justify-between">
                    <h2 className="font-bold text-white text-base">課程目錄</h2>
                    <span className="text-xs text-gray-500">
                        {journey.totalVideos ? `共 ${journey.totalVideos} 單元` : ''}
                    </span>
                </div>

                {/* 列表區 (可捲動) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                    {journey.chapters?.map((chapter, idx) => {
                        const isExpanded = expandedChapterIds.includes(chapter.id);

                        return (
                            <div key={chapter.id} className="border-b border-border-ui/50">
                                {/* 章節標題 */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-800 transition-colors group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                                            {chapter.name}
                                            {idx === 0 && (
                                                <span className="ml-2 text-[10px] bg-green-500/10 text-green-500 px-1 py-0.5 rounded border border-green-500/20 font-bold">
                                                    試看
                                                </span>
                                            )}
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
                                        "bg-background/40 overflow-hidden transition-all duration-300 ease-in-out",
                                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                    )}
                                >
                                    {chapter.lessons.map((lesson) => {
                                        // 判斷是否為當前頁面
                                        const isActive = pathname.includes(`/lessons/${lesson.id}`);

                                        // 判斷是否完成
                                        const isCompleted = finishedLessonIds.includes(Number(lesson.id));

                                        return (
                                            <Link
                                                key={lesson.id}
                                                // 組裝 URL：這裡使用 props 傳進來的 journey.slug
                                                href={`/journeys/${safeSlug}/chapters/${chapter.id}/lessons/${lesson.id}`}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-[3px]",
                                                    isActive
                                                        ? "border-primary bg-primary/10 text-primary"
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

                                                {/* ★ 修正：右側狀態顯示邏輯 (已完成 > 試看 > 鎖頭) */}
                                                <div className="text-xs text-slate-500 shrink-0 ml-1">
                                                    {isCompleted ? (
                                                        <CheckCircle size={14} className="text-green-500" />
                                                    ) : (idx === 0 && lesson.premiumOnly !== true) ? (
                                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/20 font-bold text-[10px]">
                                                            試看
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            {lesson.videoLength && (
                                                                <span className="text-[11px]">{lesson.videoLength}</span>
                                                            )}
                                                            {!isActive && !isOwned && <Lock size={12} className="text-gray-500" />}
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