"use client";

import React, { useState, useEffect } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import ChallengePortfolio from "@/components/ChallengePortfolio";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { apiRequest } from "@/lib/api";
import { UserProfile } from "@/types/User";
import { Loader2, User } from "lucide-react";

export default function PortfolioPage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        Object.keys(SKILL_LABELS).forEach(key => maxRatings[key] = "F-");

        records.forEach(record => {
            if (record.ratings) {
                Object.entries(record.ratings).forEach(([skillId, rating]) => {
                    const currentRating = rating as string;
                    const bestSoFar = maxRatings[skillId];
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
        const loadData = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const uid = user.id.toString();
                const [profileData, recordsData] = await Promise.all([
                    userService.getUserProfile(uid),
                    apiRequest<any[]>(`/gym-challenge-records/user/${uid}`)
                ]);

                setProfile(profileData);
                if (Array.isArray(recordsData)) {
                    const filteredRecords = recordsData.filter(r => r.reviewedAt != null || r.status === 'SUCCESS');
                    setStats(calculateMaxStats(filteredRecords));
                }
            } catch (error) {
                console.error("Error loading portfolio data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user?.id]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="bg-[#161b22] border border-border-ui rounded-2xl p-8 max-w-md w-full text-center">
                    <User className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">請先登入</h2>
                    <p className="text-gray-400 mb-6">您需要登入後才能查看挑戰歷程作品集</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PortfolioHeader profile={profile} stats={stats} hideBanner={true} />
            <ChallengePortfolio
                targetUserId={user.id.toString()}
                onRecordsLoaded={(count: number) => console.log(`Loaded ${count} records`)}
            />
        </div>
    );
}
