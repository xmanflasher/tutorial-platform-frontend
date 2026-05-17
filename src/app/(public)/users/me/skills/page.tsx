'use client';

import React, { useEffect, useState } from 'react';
import { achievementService } from '@/services';
import { MemberAchievements } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import { AlertCircle } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { SkillsHeader } from '@/components/profile/skills/SkillsHeader';
import { RadarSection } from '@/components/profile/skills/RadarSection';
import { GrowthAnalysis } from '@/components/profile/skills/GrowthAnalysis';
import { DimensionDefinitions } from '@/components/profile/skills/DimensionDefinitions';

export default function SkillsPage() {
    const { user, loading: authLoading } = useAuth();
    const { activeJourney } = useJourney();
    const { setIsLoading } = useLoading();
    const [achievements, setAchievements] = useState<MemberAchievements | null>(null);
    const [globalAchievements, setGlobalAchievements] = useState<MemberAchievements | null>(null);
    const [showGlobal, setShowGlobal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        setIsLoading(true);
        // 並行請求：當前課程數據 與 全站綜合數據
        Promise.all([
            achievementService.getMyAchievements(activeJourney?.id),
            achievementService.getMyAchievements(0)
        ]).then(([specific, global]) => {
            setAchievements(specific);
            setGlobalAchievements(global);
        }).catch(err => {
            console.error("Failed to load achievements", err);
            setError('無法取得資料，請稍後再試');
        }).finally(() => {
            setLoading(false);
            setIsLoading(false);
        });
    }, [user, authLoading, activeJourney, setIsLoading]);

    // 加載中狀態
    if (authLoading || loading) return null;

    // 錯誤或未登入狀態
    if (!user || error) return (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-4 text-foreground/40 bg-card/20 border border-dashed border-border-ui rounded-3xl">
            <AlertCircle size={48} className="opacity-10" />
            <p className="font-medium text-sm">{error || '請先登入後查看您的專業數據'}</p>
        </div>
    );

    const skillData = achievements?.skillRating || {};
    const globalSkillData = globalAchievements?.skillRating || {};
    const journeySlug = activeJourney?.slug?.toUpperCase() || "COURSE";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            {/* 左側：雷達圖核心區塊 */}
            <div className="lg:col-span-7">
                <RadarSection 
                    title={`${journeySlug} SKILL RADAR`} 
                    subtitle="COURSE SPECIFIC PROFICIENCY"
                    skillData={skillData} 
                    comparisonData={globalSkillData}
                    showComparison={showGlobal}
                    onToggleChange={setShowGlobal}
                />
            </div>

            {/* 右側：說明與定義 */}
            <section className="lg:col-span-5 space-y-6">
                <GrowthAnalysis />
                <DimensionDefinitions />
            </section>
        </div>
    );
}