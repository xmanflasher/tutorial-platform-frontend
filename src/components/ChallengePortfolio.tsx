"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ScrollText, Calendar, MousePointerClick } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { ChallengeRecord } from "@/types/Record";
import { GymData } from "@/types/Gym";
import { recordService } from "@/services/recordService";
import SubmissionGallery from "./portfolio/SubmissionGallery";
import FeedbackCard from "./portfolio/Feedback/FeedbackCard";
import { useJourney } from "@/context/JourneyContext";
import { gymService } from "@/services/gymService";

interface ChallengePortfolioProps {
    targetUserId: string;
    onRecordsLoaded?: (count: number) => void;
}

const RATING_LABELS: Record<string, string> = {
    "1": "需求結構化分析",
    "2": "區分結構與行為",
    "3": "抽象/萃取能力",
    "4": "建立 Well-Defined Context",
    "5": "熟悉設計模式的 Form",
    "6": "游刃有餘的開發能力"
};

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        dateStr: `${date.getMonth() + 1}/${date.getDate()}`
    };
};

export default function ChallengePortfolio({ targetUserId, onRecordsLoaded }: ChallengePortfolioProps) {
    const { activeJourney } = useJourney();
    const [records, setRecords] = useState<ChallengeRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<ChallengeRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFeedbackCollapsed, setIsFeedbackCollapsed] = useState(false);
    const [gymMap, setGymMap] = useState<Record<number, string>>({});

    // 1. 取得道館對照表
    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const gyms = await apiRequest<GymData[]>('/gyms');
                const map: Record<number, string> = {};
                gyms.forEach(g => map[g.id] = g.name);
                setGymMap(map);
            } catch (e) {
                console.error("Failed to fetch gyms", e);
            }
        };
        fetchGyms();
    }, []);

    // 2. 取得並過濾挑戰紀錄
    useEffect(() => {
        const fetchData = async () => {
            if (!targetUserId) return;
            try {
                setLoading(true);
                // 使用 recordService 統整後的介面 (支援本地暫存)
                const data = await recordService.getUserGymRecords();

                if (Array.isArray(data)) {
                    // 1. 正規化與過濾
                    const filtered = data
                        .filter((r) => {
                            // 1. 僅顯示實作挑戰 (PRACTICAL_CHALLENGE)，排除快速測試
                            if (r.challengeType && r.challengeType !== 'PRACTICAL_CHALLENGE') {
                                return false;
                            }

                            // 2. 必須是有效狀態
                            const status = r.status as string;
                            const isValidStatus = r.reviewedAt != null || 
                                ['SUCCESS', 'PASSED', 'SUBMITTED', 'REVIEWING', 'COMPLETED'].includes(status);
                            if (!isValidStatus) return false;

                            // 3. 必須屬於當前選擇的課程 (activeJourney)
                            if (r.journeyId && activeJourney?.id) {
                                return Number(r.journeyId) === Number(activeJourney.id);
                            }
                            return activeJourney?.gyms?.some((g: any) => Number(g.id) === Number(r.gymId));
                        });

                    // 2. 分組去重：每個 (gymId, gymChallengeId) 僅保留最新的一筆
                    const latestMap = new Map<string, any>();
                    filtered.forEach(r => {
                        const key = `${r.gymId}_${r.gymChallengeId}`;
                        const existing = latestMap.get(key);
                        if (!existing || (r.createdAt || 0) > (existing.createdAt || 0)) {
                            latestMap.set(key, r);
                        }
                    });

                    // 3. 映射到 UI 格式
                    const normalized: ChallengeRecord[] = Array.from(latestMap.values())
                        .map(r => {
                            const status = r.status as string;
                            let mappedStatus: "SUCCESS" | "FAILED" | "SUBMITTED" | "IN_PROGRESS" | "PASSED" | "REVIEWING" = "IN_PROGRESS";
                            
                            if (status === 'SUCCESS' || status === 'PASSED' || status === 'COMPLETED') mappedStatus = 'SUCCESS';
                            else if (status === 'FAILED') mappedStatus = 'FAILED';
                            else if (status === 'REVIEWING' || status === 'SUBMITTED') mappedStatus = 'REVIEWING';

                            return {
                                id: r.id,
                                gymId: r.gymId,
                                gymName: r.gymName || gymMap[r.gymId] || `挑戰 #${r.gymId}`,
                                gymChallengeId: r.gymChallengeId,
                                challengeType: r.challengeType,
                                status: mappedStatus,
                                feedback: r.feedback,
                                submission: typeof r.submission === 'object' ? r.submission : {},
                                ratings: typeof r.ratings === 'object' ? r.ratings : {},
                                createdAt: r.createdAt,
                                reviewedAt: r.reviewedAt
                            };
                        })
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

                    setRecords(normalized);
                    // 如果目前沒選，或原本選的已經不在清單中，則選第一筆
                    if (normalized.length > 0 && (!selectedRecord || !normalized.find(r => r.id === selectedRecord.id))) {
                        setSelectedRecord(normalized[0]);
                    } else if (normalized.length === 0) {
                        setSelectedRecord(null);
                    }
                    onRecordsLoaded?.(normalized.length);
                } else {
                    setRecords([]);
                    setSelectedRecord(null);
                    onRecordsLoaded?.(0);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setRecords([]);
                setSelectedRecord(null);
                onRecordsLoaded?.(0);
            }
            finally { setLoading(false); }
        };
        
        fetchData();
    }, [targetUserId, activeJourney?.id, gymMap, onRecordsLoaded]);

    if (loading) return <div className="h-96 flex items-center justify-center text-white"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;

    return (
        <div className="mt-8 container mx-auto px-4 lg:px-8 pb-12 flex flex-col">

            {/* --- Block A: 上方展示區 (Master Detail View) --- */}
            <div className="mb-8 shrink-0">
                {selectedRecord ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-row gap-4 h-[500px] lg:h-[600px] transition-all duration-500">

                            {/* 左: 圖片 */}
                            <div className={`transition-all duration-500 ease-in-out h-full
                                ${isFeedbackCollapsed ? 'w-[95%]' : 'w-1/2 lg:w-2/3'}
                            `}>
                                <SubmissionGallery
                                    submission={selectedRecord.submission}
                                    title={selectedRecord.gymName || gymMap[selectedRecord.gymId] || `挑戰 #${selectedRecord.gymId}`}
                                />
                            </div>

                            {/* 右: 評語 */}
                            <div className={`transition-all duration-500 ease-in-out h-full
                                ${isFeedbackCollapsed ? 'w-[5%]' : 'w-1/2 lg:w-1/3'}
                            `}>
                                <FeedbackCard
                                    feedback={selectedRecord.feedback}
                                    title={selectedRecord.gymName || gymMap[selectedRecord.gymId] || `挑戰 #${selectedRecord.gymId}`}
                                    isCollapsed={isFeedbackCollapsed}
                                    onToggleCollapse={() => setIsFeedbackCollapsed(!isFeedbackCollapsed)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[500px] flex flex-col items-center justify-center border border-border-ui border-dashed rounded-xl bg-[#161b22]/50">
                        <p className="text-gray-500 text-lg">目前沒有挑戰紀錄</p>
                    </div>
                )}
            </div>

            {/* --- Block B: 下方時間軸列表 --- */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 pl-4 border-l-4 border-primary flex items-center gap-3 shrink-0">
                    <ScrollText className="w-5 h-5" />
                    挑戰紀錄
                </h3>

                <div className="relative h-[600px] overflow-y-auto pr-2 custom-scrollbar">

                    <div className="relative min-h-full">

                        {/* 貫穿線條 (固定在左側 103px) */}
                        <div className="absolute left-[103px] top-4 bottom-4 w-0.5 bg-gray-700 hidden md:block"></div>

                        <div className="space-y-6 pb-4">
                            {records.map((record) => {
                                const { year, dateStr } = formatDate(record.createdAt);
                                const isSelected = selectedRecord?.id === record.id;
                                const displayName = record.gymName || gymMap[record.gymId] || `挑戰 #${record.gymId}`;

                                return (
                                    <div
                                        key={record.id}
                                        className={`flex flex-col md:flex-row gap-4 md:gap-8 group cursor-pointer`}
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        {/* 日期區 */}
                                        <div className="hidden md:flex flex-col items-end w-[100px] shrink-0 pt-1 text-right">
                                            <span className={`text-2xl font-bold leading-none transition-colors ${isSelected ? 'text-primary' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                {dateStr}
                                            </span>
                                            <span className="text-sm text-gray-600 font-mono mt-1">{year}</span>
                                        </div>

                                        {/* 時間軸節點 (位於線條上) */}
                                        <div className="hidden md:flex absolute left-[97px] items-center justify-center mt-2.5">
                                            <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10
                                                ${isSelected
                                                    ? 'bg-primary border-primary shadow-[0_0_10px_rgba(250,204,21,0.6)] scale-125'
                                                    : 'bg-background border-gray-600 group-hover:border-gray-400'
                                                }`}>
                                            </div>
                                        </div>

                                        {/* 卡片本體 */}
                                        <div className={`flex-1 transition-all duration-300 transform ${isSelected ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>
                                            <div className={`bg-[#161b22] border rounded-lg p-4 shadow-md transition-all
                                                ${isSelected
                                                    ? 'border-primary/50 ring-1 ring-yellow-500/20 bg-[#1c2128]'
                                                    : 'border-border-ui hover:border-gray-600 hover:bg-[#1f242c]'
                                                }`}>

                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                        {displayName}
                                                    </h4>
                                                    <div className="md:hidden flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3" /> {year}/{dateStr}
                                                    </div>
                                                </div>

                                                {/* 內容摘要 (一行 + ...) */}
                                                {record.feedback && (
                                                    <div className="text-xs text-gray-500 mb-3 line-clamp-1">
                                                        {record.feedback.replace(/[#*`]/g, '')}
                                                    </div>
                                                )}

                                                {/* Ratings Tags */}
                                                {record.ratings && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {Object.entries(record.ratings).map(([key, value]) => (
                                                            <span key={key} className={`text-[10px] px-2 py-0.5 rounded border font-mono
                                                                ${isSelected
                                                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                                                    : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                                                                {RATING_LABELS[key] || `維度 ${key}`}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className={`mt-2 text-[10px] flex items-center gap-1 transition-opacity ${isSelected ? 'text-primary' : 'text-gray-600 opacity-0 group-hover:opacity-100'}`}>
                                                    <MousePointerClick className="w-3 h-3" />
                                                    {isSelected ? '正在檢視中' : '點擊查看詳情'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}