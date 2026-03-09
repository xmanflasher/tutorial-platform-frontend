// src/app/(public)/users/[userId]/portfolio/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import ChallengePortfolio from "@/components/ChallengePortfolio";
import PortfolioHeader from "@/components/PortfolioHeader";
import MarketingBanner from "@/components/MarketingBanner";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/userService"; // 匯入 Service
import { UserProfile } from "@/types/User";
import { useAuth } from "@/context/AuthContext"; // ★ 新增


import { apiRequest } from "@/lib/api"; // ★ 修正路徑

export default function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
    const { user: authUser } = useAuth(); // ★ 引入登入資訊
    const [userId, setUserId] = useState<string>("");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);

    const RATING_ORDER = ["SSS", "SS+", "SS", "S+", "S", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "E+", "E", "F+", "F", "F-"];
    const SKILL_LABELS: Record<string, string> = {
        "1": "需求結構化分析",
        "2": "區分結構與行為",
        "3": "抽象/萃取能力",
        "4": "建立 Well-Defined Context",
        "5": "熟悉設計模式的 Form",
        "6": "游刃有餘的開發能力"
    };

    const calculateMaxStats = (records: any[]) => {
        const maxRatings: Record<string, string> = {};

        // 初始化為 F-
        Object.keys(SKILL_LABELS).forEach(key => {
            maxRatings[key] = "F-";
        });

        records.forEach(record => {
            if (record.ratings) {
                Object.entries(record.ratings).forEach(([skillId, rating]) => {
                    const currentRating = rating as string;
                    const bestSoFar = maxRatings[skillId];

                    // 比較等級 (索引越小等級越高)
                    const currentIndex = RATING_ORDER.indexOf(currentRating);
                    const bestIndex = RATING_ORDER.indexOf(bestSoFar);

                    if (currentIndex !== -1 && (bestIndex === -1 || currentIndex < bestIndex)) {
                        maxRatings[skillId] = currentRating;
                    }
                });
            }
        });

        return Object.entries(SKILL_LABELS).map(([id, label]) => ({
            label,
            value: maxRatings[id] || "F-"
        }));
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true); // Ensure loading is true at the start of init
            const resolvedParams = await params;
            let uid = resolvedParams.userId;

            if (uid === 'me' && authUser?.id) {
                uid = authUser.id.toString();
            } else if (uid === 'me') {
                console.warn("[PortfolioPage] Cannot resolve 'me' without authenticated user id");
                setLoading(false);
                return;
            }

            setUserId(uid);

            try {
                const [profileData, recordsData] = await Promise.all([
                    userService.getUserProfile(uid),
                    apiRequest<any[]>(`/gym-challenge-records/user/${uid}`)
                ]);

                setProfile(profileData);

                if (Array.isArray(recordsData)) {
                    const filteredRecords = recordsData.filter(r => r.reviewedAt != null || r.status === 'SUCCESS');
                    setStats(calculateMaxStats(filteredRecords));
                    // setHasRecords(filteredRecords.length > 0); // This state is no longer used directly
                }
            } catch (error) {
                console.error("Error loading portfolio data:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [params, authUser]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-white">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );
    }

    return (
        // ★★★ 外層容器已移至 layout.tsx，這裡直接開始排版內容 ★★★
        <div className="max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-4">

            {/* 1. 行銷 Banner */}
            <MarketingBanner />

            {/* 2. 個人檔案頭部 (Header + Stats) */}
            <PortfolioHeader profile={profile} stats={stats} />

            {/* 3. 挑戰歷程 (Timeline) */}
            {userId && (
                <ChallengePortfolio
                    targetUserId={userId}
                    onRecordsLoaded={(count) => { /* setHasRecords(count > 0) */ }} // This callback is still here but the state is not used
                />
            )}

        </div>
    );
}