// src/app/journeys/[slug]/(player)/chapters/[chapterId]/lessons/[lessonId]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { usePlayerUI } from "@/context/PlayerUIContext";
import ReactMarkdown from "react-markdown";
import { Loader2, AlertCircle, CheckCircle, Lock, ShoppingCart } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { lessonService } from "@/services"; // 統一從 services 匯入
import { LessonDetail } from "@/types";    // 統一從 types 匯入
import { apiRequest } from "@/lib/api";
import { orderStore } from "@/lib/orderStore";
import { cn } from "@/lib/utils";

export default function LessonPage({
    params
}: {
    params: Promise<{ slug: string; chapterId: string; lessonId: string }>
}) {
    // 取得動態路由參數 (注意：這裡名稱已改為 lessonId 配合資料夾命名)
    const { lessonId, slug } = use(params);
    const { isSidebarOpen, finishedLessonIds, addFinishedId } = usePlayerUI();
    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwned, setIsOwned] = useState(false);
    
    // 從 Context 判斷完成狀態
    const isFinished = finishedLessonIds.includes(Number(lessonId));

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 檢查購買狀態
                setIsOwned(orderStore.isCourseOwned(slug));

                const data = await lessonService.getLessonDetail(lessonId);
                setLesson(data);
            } catch (error) {
                console.warn('無法載入單元資料', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [lessonId]);

    const markAsComplete = async () => {
        // 樂觀更新 Context
        addFinishedId(Number(lessonId));

        try {
            await apiRequest(`/learning-records/lessons/${lessonId}/complete`, {
                method: 'POST',
                silent: true
            });
        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                console.warn('訪客模式：尚未登入，無法把課程進度記錄到資料庫。');
            } else {
                console.error('儲存進度失敗', error);
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center p-10 h-[60vh] items-center">
            <Loader2 className="animate-spin text-white w-10 h-10" />
        </div>
    );

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <AlertCircle className="mb-4 w-12 h-12" />
                <p className="text-xl">找不到單元資料 (ID: {lessonId})</p>
            </div>
        );
    }

    // 解析資料邏輯
    const firstContent = lesson.content?.[0] || null;
    const videoUrl = firstContent?.url;
    const markdownContent = firstContent?.content;
    const type = lesson.type?.toLowerCase();
    
    // 支援多種影片類型關鍵字
    const isVideo = type === "video" || 
                    firstContent?.type?.toLowerCase() === "video" || 
                    !!videoUrl;
    
    // 支援多種文章類型關鍵字
    const isArticle = type === "scroll" || 
                      type === "markdown" || 
                      type === "article" || 
                      type === "text" ||
                      !!markdownContent;

    // 權限檢查：如果是收費課程且尚未購買
    const isLocked = lesson.premiumOnly && !isOwned;

    return (
        <div className="max-w-5xl mx-auto w-full pb-20 px-4 pt-6">
            {/* 標題區域 */}
            <div className="mb-8 border-b border-gray-800 pb-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">{lesson.name}</h1>
                            {isFinished && (
                                <span className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                                    <CheckCircle size={16} /> 已完成
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed">{lesson.description}</p>
                    </div>
                    {lesson.videoLength && (
                        <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-slate-300 font-mono">
                            {lesson.videoLength}
                        </span>
                    )}
                </div>
            </div>

            {/* 內容顯示區 */}
            <div className={cn(
                "bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl min-h-[500px]",
                isLocked ? "flex flex-col items-center justify-center" : "block"
            )}>
                {isLocked ? (
                    <div className="p-12 text-center space-y-6 max-w-md animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto border border-yellow-400/20">
                            <Lock className="w-10 h-10 text-yellow-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">尚未購買此課程</h3>
                            <p className="text-gray-400 leading-relaxed">
                                此單元為正式版專屬內容，購買後即可永久觀看並獲得專屬導師指導。
                            </p>
                        </div>
                        <Link 
                            href={`/journeys/${slug}`}
                            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-lg transition-all shadow-lg shadow-yellow-400/20 active:scale-[0.98]"
                        >
                            <ShoppingCart size={20} />
                            立即加入課程
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* 1. 影片模式 */}
                        {isVideo && videoUrl ? (
                            <VideoPlayer 
                                url={videoUrl} 
                                onProgress={() => { }} 
                                onEnded={markAsComplete}
                            />
                        ) : isVideo && (
                            <div className="p-10 text-center text-red-400">
                                偵測到影片類型，但 URL 為空。
                            </div>
                        )}

                        {/* 2. 文章模式 */}
                        {isArticle && markdownContent ? (
                            <div className="p-10 w-full">
                                <article className="prose prose-invert max-w-none prose-yellow">
                                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                                </article>
                                
                                {!isFinished && (
                                    <div className="mt-12 text-center">
                                        <button
                                            onClick={markAsComplete}
                                            className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-600/20"
                                        >
                                            我已閱讀完畢
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : !isVideo && (
                            <div className="p-20 text-center text-gray-500 flex flex-col items-center gap-4">
                                <AlertCircle size={48} className="text-gray-700" />
                                <div>
                                    <p className="text-lg font-bold">目前無單元內容</p>
                                    <p className="text-sm">此單元可能尚未上傳教材或是類型不正確 (ID: {lessonId})</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}