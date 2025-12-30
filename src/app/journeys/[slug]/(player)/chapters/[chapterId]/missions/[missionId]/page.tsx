"use client";

import { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, AlertCircle } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

// 1. 定義單一內容物件
interface MissionContent {
    type: 'video' | 'markdown' | 'VIDEO' | 'MARKDOWN';
    url?: string;
    id?: number;
    content?: string;
}

// 2. 定義整體回傳結構
interface MissionData {
    id: number;
    name: string;
    description: string;
    type: 'video' | 'scroll' | 'VIDEO' | 'SCROLL';
    createdAt: number;
    content: MissionContent[];
    reward?: {
        exp: number;
        coin: number;
    };
    videoLength?: string;
}

async function fetchMissionData(missionId: string): Promise<MissionData | null> {
    try {
        console.log(`[Fetch] 開始請求 Mission ID: ${missionId}`);
        const res = await fetch(`http://localhost:8080/api/lessons/${missionId}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`[Fetch Error] Status: ${res.status} ${res.statusText}`);
            return null;
        }
        const data = await res.json();
        console.log(`[Fetch Success] 取得資料:`, data);
        return data;
    } catch (e) {
        console.error("[Fetch Error] Network:", e);
        return null;
    }
}

export default function MissionPage({
    params
}: {
    params: Promise<{ slug: string; chapterId: string; missionId: string }>
}) {
    const { missionId } = use(params);
    const [mission, setMission] = useState<MissionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchMissionData(missionId);
            setMission(data);
            setLoading(false);
        };
        loadData();
    }, [missionId]);

    // Debug Log: 監控渲染時的資料狀態
    console.log("--- Render MissionPage ---");
    console.log("Mission State:", mission);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>;

    if (!mission) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
                <AlertCircle className="mb-2 w-10 h-10" />
                <p>找不到單元資料 (ID: {missionId})</p>
            </div>
        );
    }

    // 解析資料
    const firstContent = mission.content && mission.content.length > 0 ? mission.content[0] : null;
    const videoUrl = firstContent?.url;
    const markdownContent = firstContent?.content;
    const missionType = mission.type?.toLowerCase();

    // 判斷邏輯
    const isVideo = missionType === "video" || firstContent?.type?.toLowerCase() === "video";

    console.log("解析結果:", {
        videoUrl,
        missionType,
        isVideo,
        firstContent
    });

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="mb-6 border-b border-gray-800 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{mission.name}</h1>
                        <p className="text-gray-400">{mission.description}</p>
                    </div>
                    {mission.videoLength && (
                        <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300">
                            {mission.videoLength}
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 shadow-xl min-h-[400px]">

                {/* 1. 影片播放器 */}
                {isVideo && videoUrl ? (
                    <>
                        {/* 這裡加一個額外的 Log 區塊，確保有進到這裡 */}
                        <div className="hidden">Debug: Rendering Player for {videoUrl}</div>
                        <VideoPlayer
                            url={videoUrl}
                            onProgress={(p) => {
                                // console.log("Progress:", p.playedSeconds); 
                            }}
                        />
                    </>
                ) : (
                    isVideo && (
                        <div className="p-10 text-red-500">
                            偵測到影片類型，但 URL 為空。
                            <pre>{JSON.stringify(firstContent, null, 2)}</pre>
                        </div>
                    )
                )}

                {/* 2. 文章閱讀器 */}
                {missionType === "scroll" && markdownContent ? (
                    <div className="p-8 bg-[#111827]">
                        <article className="prose prose-invert max-w-none">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </article>
                    </div>
                ) : null}
            </div>
        </div>
    );
}