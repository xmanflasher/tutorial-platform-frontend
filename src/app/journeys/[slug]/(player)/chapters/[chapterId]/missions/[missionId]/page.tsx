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
    // ★★★ 修正：這裡必須是陣列，因為 JSON 是 content: [ { ... } ] ★★★
    content: MissionContent[];
    reward?: {
        exp: number;
        coin: number;
    };
    videoLength?: string;
}

async function fetchMissionData(missionId: string): Promise<MissionData | null> {
    try {
        const res = await fetch(`http://localhost:8080/api/lessons/${missionId}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`API Error: ${res.status} ${res.statusText}`);
            return null;
        }
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Network Error:", e);
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
            try {
                const data = await fetchMissionData(missionId);
                console.log("API Data:", data); // 方便除錯用
                setMission(data);
            } catch (error) {
                console.error("Failed to fetch mission", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [missionId]);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>;

    if (!mission) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
                <AlertCircle className="mb-2 w-10 h-10" />
                <p>找不到單元資料 (ID: {missionId})</p>
            </div>
        );
    }

    // ★★★ 關鍵修正：從陣列中取出第一筆資料 ★★★
    // JSON: "content": [ { "url": "..." } ]
    const firstContent = mission.content && mission.content.length > 0 ? mission.content[0] : null;

    // 取得 url
    const videoUrl = firstContent?.url;
    const markdownContent = firstContent?.content;
    const missionType = mission.type?.toLowerCase();

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="mb-6 border-b border-gray-800 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{mission.name}</h1>
                        <p className="text-gray-400">{mission.description}</p>
                    </div>
                    {/* 顯示影片長度 (如果有) */}
                    {mission.videoLength && (
                        <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300">
                            {mission.videoLength}
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 shadow-xl min-h-[400px]">

                {/* 1. 影片播放器 */}
                {missionType === "video" && videoUrl ? (
                    <VideoPlayer
                        url={videoUrl}
                        // 這裡可以加上 onEnded 處理任務完成邏輯
                        onProgress={(p) => { }}
                    />
                ) : null}

                {/* 2. 文章閱讀器 */}
                {missionType === "scroll" && markdownContent ? (
                    <div className="p-8 bg-[#111827]">
                        <article className="prose prose-invert max-w-none">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </article>
                    </div>
                ) : null}

                {/* 3. 錯誤提示 (如果有 type 是 video 但沒 url) */}
                {missionType === "video" && !videoUrl && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 gap-4">
                        <AlertCircle className="w-12 h-12" />
                        <p className="text-lg">無法讀取影片連結</p>
                        <div className="text-xs font-mono bg-black/30 p-4 rounded text-left max-w-md break-all">
                            DEBUG: content array is {mission.content?.length ? 'present' : 'empty'}
                            <br />
                            Data: {JSON.stringify(mission.content)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}