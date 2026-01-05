"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Clock, Gift, Lock, CheckCircle2, Swords, Loader2, Calendar } from "lucide-react";
// ★ 請確認 @/types 裡的 MemberMission 介面已經包含 duration: number
import { MemberMission } from "@/types";
import { missionService } from "@/services/missionService";

export default function MissionsPage() {
    const params = useParams();
    const journeySlug = params.slug as string;

    const [missions, setMissions] = useState<MemberMission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"AVAILABLE" | "IN_PROGRESS" | "PAST">("AVAILABLE");

    useEffect(() => {
        if (journeySlug) {
            missionService.getMissionsByJourneySlug(journeySlug)
                .then((data) => {
                    setMissions(data);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [journeySlug]);

    const displayMissions = missions.filter(m => {
        const status = m.status || "AVAILABLE";

        if (activeTab === "AVAILABLE") {
            return status === "AVAILABLE" || status === "LOCKED";
        }
        if (activeTab === "IN_PROGRESS") {
            return status === "IN_PROGRESS";
        }
        if (activeTab === "PAST") {
            return status === "COMPLETED" || status === "CLAIMED";
        }
        return false;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0e11] text-white p-8">
            {/* Banner (保持不變) */}
            <div className="mb-8 p-6 rounded-xl border border-gray-700 bg-[#15171b] flex items-center justify-between">
                <div className="text-gray-300">
                    將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 <span className="text-white font-bold">3000 元課程折價券！</span>
                </div>
                <button className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition-colors">
                    前往
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-6">獎勵任務</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
                <TabButton label="可接任務" active={activeTab === "AVAILABLE"} onClick={() => setActiveTab("AVAILABLE")} />
                <TabButton label="進行中的任務" active={activeTab === "IN_PROGRESS"} onClick={() => setActiveTab("IN_PROGRESS")} />
                <TabButton label="過去的任務" active={activeTab === "PAST"} onClick={() => setActiveTab("PAST")} />
            </div>

            {/* Grid */}
            {displayMissions.length === 0 ? (
                <div className="text-gray-500 text-center py-10">目前沒有此類別的任務</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {displayMissions.map((mission) => (
                        <MissionCard key={mission.missionId} mission={mission} />
                    ))}
                </div>
            )}
        </div>
    );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded font-medium transition-all ${active ? "bg-yellow-400 text-black" : "text-gray-400 hover:text-white bg-[#1c1f26]"}`}
        >
            {label}
        </button>
    );
}

// ★ 修正後的 MissionCard
function MissionCard({ mission }: { mission: MemberMission }) {
    const isLocked = mission.status === "LOCKED";
    const isInProgress = mission.status === "IN_PROGRESS";
    const isCompleted = mission.status === "COMPLETED";

    return (
        <div className={`p-6 rounded-xl border ${isLocked ? 'border-gray-800 bg-[#121418] opacity-70' : 'border-gray-700 bg-[#161b22]'} flex flex-col justify-between h-full`}>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Swords className="w-5 h-5 text-gray-400" />
                        <h3 className="text-xl font-bold text-gray-100">{mission.name}</h3>
                    </div>
                    {/* 顯示狀態標籤 */}
                    <span className={`text-xs px-2 py-1 rounded ${isLocked ? 'bg-gray-800 text-gray-500' :
                        isInProgress ? 'bg-blue-900 text-blue-200' :
                            isCompleted ? 'bg-green-900 text-green-200' : 'bg-gray-700'
                        }`}>
                        {mission.status}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-400 mt-3 border-gray-700 pt-3">
                    {/* 1. 開啟條件 */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">開啟條件:</span>
                        {isLocked ? <Lock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3 text-green-500" />}
                        {/* 加入 || "無" 避免空值 */}
                        <span>{mission.unlockConditionDescription || "無"}</span>
                    </div>

                    {/* 2. 時限 (顯示 duration) */}
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {/* 判斷 duration 是否有值 (大於0) */}
                        <span>時限: {mission.duration ? `${mission.duration} 天` : "無限制"}</span>
                    </div>

                    {/* 截止日期 (僅在進行中且有設定時顯示) */}
                    {mission.deadline && (
                        <div className="flex items-center gap-2 text-yellow-500">
                            <Calendar className="w-4 h-4" />
                            <span>截止: {new Date(mission.deadline).toLocaleDateString()}</span>
                        </div>
                    )}

                    {/* 3. 獎勵 */}
                    <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-gray-500" />
                        {/* 加入 || "無" 避免空值 */}
                        <span>獎勵: {mission.rewardDescription || "無"}</span>
                    </div>
                </div>

                {/* 進度條 (若在進行中) */}
                {isInProgress && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span>進度</span>
                            <span>{mission.currentProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${mission.currentProgress}%` }}></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                {isLocked ? (
                    <button disabled className="w-full py-3 rounded bg-[#2d333b] text-gray-500 font-bold cursor-not-allowed border border-gray-700">
                        尚未達成開啟條件
                    </button>
                ) : isInProgress ? (
                    <button className="w-full py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors">
                        繼續任務
                    </button>
                ) : isCompleted ? (
                    <button className="w-full py-3 rounded bg-green-600 text-white font-bold hover:bg-green-500 transition-colors animate-bounce">
                        領取獎勵
                    </button>
                ) : (
                    <button className="w-full py-3 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/10">
                        接受任務
                    </button>
                )}
            </div>
        </div>
    );
}