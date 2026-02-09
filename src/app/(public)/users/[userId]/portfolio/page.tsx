// src/app/(public)/users/[userId]/portfolio/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import ChallengePortfolio from "@/components/ChallengePortfolio";
import PortfolioHeader from "@/components/PortfolioHeader";
import MarketingBanner from "@/components/MarketingBanner";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/userService"; // 匯入 Service
import { UserProfile } from "@/types/User";



export default function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
    const [userId, setUserId] = useState<string>("");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            const uid = resolvedParams.userId;
            setUserId(uid);

            const data = await userService.getUserProfile(uid);
            setProfile(data);
            setLoading(false);
        };
        init();
    }, [params]);

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
            <PortfolioHeader profile={profile} />

            {/* 3. 挑戰歷程 (Timeline) */}
            {userId && <ChallengePortfolio targetUserId={userId} />}

        </div>
    );
}