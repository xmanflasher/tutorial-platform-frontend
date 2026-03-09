// src/app/journeys/[slug]/(player)/chapters/[chapterId]/lessons/[lessonId]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, AlertCircle } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { lessonService } from "@/services"; // 統一從 services 匯入
import { LessonDetail } from "@/types";    // 統一從 types 匯入

export default function LessonPage({
    params
}: {
    params: Promise<{ slug: string; chapterId: string; lessonId: string }>
}) {
    // 取得動態路由參數 (注意：這裡名稱已改為 lessonId 配合資料夾命名)
    const { lessonId } = use(params);
    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await lessonService.getLessonDetail(lessonId);
            setLesson(data);
            setLoading(false);
        };
        loadData();
    }, [lessonId]);

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
    const isVideo = type === "video" || firstContent?.type?.toLowerCase() === "video";

    return (
        <div className="max-w-5xl mx-auto w-full pb-20 px-4 pt-6">
            {/* 標題區域 */}
            <div className="mb-8 border-b border-gray-800 pb-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white">{lesson.name}</h1>
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
            <div className="bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl min-h-[500px]">
                {/* 1. 影片模式 */}
                {isVideo && videoUrl ? (
                    <VideoPlayer url={videoUrl} onProgress={() => { }} />
                ) : isVideo && (
                    <div className="p-10 text-center text-red-400">
                        偵測到影片類型，但 URL 為空。
                    </div>
                )}

                {/* 2. 文章模式 */}
                {(type === "scroll" || type === "markdown") && markdownContent ? (
                    <div className="p-10">
                        <article className="prose prose-invert max-w-none prose-yellow">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </article>
                    </div>
                ) : null}
            </div>
        </div>
    );
}