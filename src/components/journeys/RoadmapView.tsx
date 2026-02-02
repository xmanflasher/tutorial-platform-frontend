"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Lock, Star, CheckCircle, PlayCircle, Loader2, Sword, Clock, Trophy, TrendingUp, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useJourney } from '@/context/JourneyContext';
import { Chapter, Gym } from '@/types';
import { gymService } from '@/services/gymService';

// --- GymNode Component ---
const GymNode = ({ gym, isLast, onClick }: { gym: Gym; isLast: boolean; onClick: () => void }) => {
    const { isLocked, type, code, name, difficulty, reward, currentStars } = gym;
    const isCompleted = (currentStars || 0) > 0;
    const isUnlocked = !isLocked && !isCompleted;
    const isBoss = type === 'BOSS';

    return (
        <div className="relative flex items-start group min-h-[120px]">
            {/* 左側連接線 */}
            {!isLast && (
                <div className="absolute left-[22px] top-12 bottom-[-24px] w-0.5 bg-gray-800 group-hover:bg-gray-700 transition-colors" />
            )}

            {/* 左側圖示節點 */}
            <div
                className={`
          relative z-10 flex items-center justify-center rounded-full border-4 shadow-xl transition-transform duration-300 group-hover:scale-110 cursor-pointer
          ${isBoss ? 'w-16 h-16 -ml-2 border-red-900/50 bg-[#1a1111]' : 'w-12 h-12 border-gray-800 bg-[#0d0e11]'}
          ${isLocked ? 'opacity-60 border-gray-700' : ''}
          ${isCompleted ? 'border-green-500/30' : ''}
          ${isUnlocked ? 'animate-pulse-slow ' + (isBoss ? 'border-red-500/50' : 'border-blue-500/50') : ''}
        `}
                onClick={!isLocked ? onClick : undefined}
            >
                {isLocked ? (
                    <Lock size={isBoss ? 24 : 16} className="text-gray-600" />
                ) : isCompleted ? (
                    <CheckCircle size={isBoss ? 28 : 20} className="text-green-500" />
                ) : isBoss ? (
                    <Sword size={28} className="text-red-500" />
                ) : (
                    <Target size={20} className="text-blue-400" />
                )}
            </div>

            {/* 右側卡片 */}
            <div
                className={`
          flex-1 ml-6 mb-8 p-5 rounded-xl border transition-all duration-200 cursor-pointer
          ${isLocked
                        ? 'bg-gray-900/30 border-gray-800/50 opacity-50'
                        : 'bg-gray-900/80 border-gray-800 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1'}
          ${isBoss && !isLocked ? 'border-red-900/30 hover:border-red-500/50 bg-red-950/10' : ''}
        `}
                onClick={!isLocked ? onClick : undefined}
            >
                <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-lg font-bold flex items-center gap-2 ${isLocked ? 'text-gray-500' : 'text-gray-100'}`}>
                        <span className={`font-mono text-sm px-2 py-0.5 rounded border ${isBoss ? 'bg-red-950/50 text-red-300 border-red-900/50' : 'bg-blue-950/50 text-blue-300 border-blue-900/50'}`}>
                            {code}
                        </span>
                        {name}
                    </h4>
                    <div className="flex gap-0.5">
                        {[...Array(difficulty || 1)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" className="text-yellow-600" />
                        ))}
                    </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {gym.description || "準備好接受挑戰了嗎？"}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                        <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">EXP +{reward?.exp || 0}</span>
                        {isUnlocked && (
                            <span className="text-blue-400 flex items-center gap-1 font-medium animate-pulse">
                                <PlayCircle size={12} /> 點擊開始
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
                        <span className={`text-sm font-mono ${(currentStars || 0) > 0 ? 'text-yellow-400' : 'text-gray-600'}`}>
                            {currentStars || 0}
                        </span>
                        <Star size={14} className={(currentStars || 0) > 0 ? "text-yellow-500 fill-current" : "text-gray-700"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Roadmap Component ---
export default function RoadmapView() {
    const router = useRouter();
    const { activeJourney, isLoading: journeyLoading } = useJourney();
    const [gymsWithProgress, setGymsWithProgress] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'MAIN' | 'SIDE'>('MAIN');

    useEffect(() => {
        // 確保有旅程資料後才開始合併進度
        if (!activeJourney?.gyms) return;

        const loadData = async () => {
            try {
                setLoading(true);
                // 直接使用封裝好的 Service 方法
                const mergedData = await gymService.getMergedGyms(activeJourney.gyms);
                setGymsWithProgress(mergedData);
            } catch (error) {
                console.error("載入 Roadmap 失敗:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [activeJourney]);

    // 使用 useMemo 優化計算統計資料
    const stats = useMemo(() => {
        const completed = gymsWithProgress.filter(g => (g.currentStars || 0) > 0);
        return {
            total: gymsWithProgress.length,
            cleared: completed.length,
            exp: completed.reduce((acc, g) => acc + (g.reward?.exp || 0), 0)
        };
    }, [gymsWithProgress]);

    const filteredGyms = useMemo(() =>
        gymsWithProgress.filter(gym =>
            activeTab === 'MAIN' ? !gym.code.includes('.') : gym.code.includes('.')
        ), [gymsWithProgress, activeTab]);

    const renderBeltSection = (title: string, belt: 'WHITE' | 'BLACK') => {
        const beltChapters = activeJourney?.chapters?.filter(c => c.belt === belt) || [];
        const sectionGyms = filteredGyms.filter(g => beltChapters.some(c => Number(c.id) === Number(g.chapterId)));

        if (sectionGyms.length === 0) return null;

        return (
            <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-center text-gray-400 mb-10 relative flex items-center justify-center">
                    <div className="h-px bg-gray-800 w-full absolute left-0" />
                    <span className="bg-[#0d0e11] px-6 py-1 z-10 border border-gray-800 rounded-full text-sm font-medium text-gray-300 shadow-xl">
                        {title}
                    </span>
                </h2>
                <div className="pl-4 md:pl-8">
                    {sectionGyms.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
                        .map((gym, idx) => (
                            <GymNode key={gym.id} gym={gym} isLast={idx === sectionGyms.length - 1} onClick={() => router.push(`/journeys/${activeJourney?.slug}/gyms/${gym.id}`)} />
                        ))}
                </div>
            </div>
        );
    };

    if (journeyLoading || loading) return (
        <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center text-white">
            <Loader2 className="animate-spin w-10 h-10 text-yellow-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0d0e11] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto pb-20">
                <div className="text-center mb-10 pt-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-6">{activeJourney?.title}</h1>
                    <div className="grid grid-cols-3 gap-4 bg-[#161b22] border border-gray-800 rounded-xl p-4 max-w-2xl mx-auto">
                        <StatItem label="DAYS LEFT" value="∞" icon={<Clock size={12} />} />
                        <StatItem label="CLEARED" value={`${stats.cleared} / ${stats.total}`} icon={<Trophy size={12} />} />
                        <StatItem label="XP EARNED" value={`${stats.exp} XP`} icon={<TrendingUp size={12} />} color="text-yellow-500" />
                    </div>
                </div>

                <div className="flex justify-center mb-16">
                    <div className="bg-[#161b22] p-1 rounded-lg border border-gray-800 flex w-full max-w-lg">
                        {['MAIN', 'SIDE'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-gray-200'}`}>
                                {tab === 'MAIN' ? '主線任務' : '支線任務'}
                            </button>
                        ))}
                    </div>
                </div>

                {renderBeltSection("白段道館", "WHITE")}
                {renderBeltSection("黑段道館", "BLACK")}
            </div>
        </div>
    );
}

function StatItem({ label, value, icon, color = "text-white" }: { label: string; value: string; icon: React.ReactNode; color?: string }) {
    return (
        <div className="flex flex-col items-center border-r last:border-0 border-gray-800">
            <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">{icon} {label}</span>
            <span className={`text-xl font-mono ${color}`}>{value}</span>
        </div>
    );
}