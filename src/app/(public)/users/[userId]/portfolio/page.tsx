"use client";

import React, { useEffect, useState } from "react";
import ChallengePortfolio from "@/components/ChallengePortfolio";
import PortfolioHeader from "@/components/PortfolioHeader";
import MarketingBanner from "@/components/MarketingBanner";
import { Loader2 } from "lucide-react";

interface UserProfile {
    id: number;
    name: string;
    nickName: string;
    jobTitle: string;
    avatar: string;
}

export default function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
    const [userId, setUserId] = useState<string>("");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            setUserId(resolvedParams.userId);

            try {
                // 這裡 fetch User 基本資料
                const res = await fetch(`http://localhost:8080/api/users?ids=${resolvedParams.userId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const user = data[0];
                        setProfile({
                            id: user.id,
                            name: user.name,
                            nickName: user.nickName,
                            jobTitle: user.jobTitle,
                            avatar: user.pictureUrl || user.avatar
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
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