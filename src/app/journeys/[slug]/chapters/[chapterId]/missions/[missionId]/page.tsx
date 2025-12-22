// src/app/journeys/[slug]/chapters/[chapterId]/missions/[missionId]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, AlertCircle } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";

// 定義資料介面 (對應後端回傳的 JSON 結構)
interface MissionContent {
    type: 'video' | 'markdown' | 'VIDEO' | 'MARKDOWN'; // 相容後端可能回傳大寫
    url?: string;
    id?: number;
    content?: string;
}

interface MissionData {
    id: number;
    name: string;      // 若後端回傳 title，下面需做轉換
    description: string;
    type: 'video' | 'scroll' | 'VIDEO' | 'SCROLL'; // 相容大小寫
    content: MissionContent[];
    reward?: {         // 設為 optional，以免後端沒回傳這欄位導致報錯
        exp: number;
        coin: number;
    };
}

// ★★★ 真實 API 呼叫 ★★★
async function fetchMissionData(missionId: string): Promise<MissionData | null> {
    try {
        // 假設您的後端 Controller 路徑是 /api/lessons/{id} 或 /api/missions/{id}
        // 請根據您 Spring Boot 的 @GetMapping 路徑調整這裡
        const res = await fetch(`http://localhost:8080/api/lessons/${missionId}`, {
            cache: 'no-store' // 確保不快取，每次都拿最新資料
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
    // 1. 解包 params
    const { missionId } = use(params);

    const [mission, setMission] = useState<MissionData | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. 載入資料
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchMissionData(missionId);
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
                <p className="text-sm mt-2 text-gray-600">請確認後端是否已啟動，且資料庫有該 ID 資料。</p>
            </div>
        );
    }

    // 取得第一個內容 (通常是影片)
    const firstContent = mission.content?.[0];
    const videoUrl = firstContent?.url;
    const markdownContent = firstContent?.content;

    // 判斷類型 (轉為小寫以防後端回傳大寫)
    const missionType = mission.type?.toLowerCase();

    return (
        <div className="max-w-5xl mx-auto w-full pb-20">
            <div className="mb-6 border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-white mb-2">{mission.name}</h1>
                <p className="text-gray-400">{mission.description}</p>
            </div>

            <div className="bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 shadow-xl min-h-[400px]">

                {/* VIDEO 類型 */}
                {missionType === "video" && videoUrl ? (
                    <VideoPlayer
                        url={videoUrl}
                        onProgress={(p) => console.log('進度:', p.played)}
                    />
                ) : null}

                {/* SCROLL (Markdown) 類型 */}
                {missionType === "scroll" && markdownContent ? (
                    <div className="p-8 bg-[#111827]">
                        <article className="prose prose-invert max-w-none">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </article>
                    </div>
                ) : null}

                {/* 若資料異常顯示提示 */}
                {missionType === "video" && !videoUrl && (
                    <div className="p-10 text-center text-gray-500">影片連結遺失</div>
                )}

            </div>
        </div>
    );
}