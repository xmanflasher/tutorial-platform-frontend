"use client";

import React, { useState, useEffect } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import ChallengePortfolio from "@/components/ChallengePortfolio";
import { useAuth } from "@/context/AuthContext";
import { useJourney } from "@/context/JourneyContext";
import { userService } from "@/services/userService";
import { apiRequest } from "@/lib/api";
import { UserProfile } from "@/types/User";
import { User } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

export default function PortfolioPage() {
    const { user, loading: authLoading } = useAuth();
    const { activeJourney } = useJourney();
    const { setIsLoading } = useLoading();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            if (!user?.id) return;
            try {
                setIsLoading(true);
                // 1. 獲取個人檔案
                const profileData = await userService.getUserProfile(user.id.toString());
                setProfile(profileData);

                // 2. [ARCH-FIX-02] 獲取後端計算好的技能統計 (SSOT)
                const skillStats = await userService.getSkillStats(activeJourney?.id);
                setStats(skillStats);

            } catch (error) {
                console.error("Failed to load portfolio data", error);
            } finally {
                setLoading(false);
                setIsLoading(false);
            }
        };

        fetchPortfolioData();
    }, [user, activeJourney, setIsLoading]);

    if (authLoading || loading) return null;

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
            <PortfolioHeader profile={profile} stats={stats} hideBanner={true} journeyId={activeJourney?.id} />
            <ChallengePortfolio
                targetUserId={user.id.toString()}
                onRecordsLoaded={(count: number) => console.log(`Loaded ${count} records`)}
            />
        </div>
    );
}
