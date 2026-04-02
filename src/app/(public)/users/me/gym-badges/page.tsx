"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Medal, Lock } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { apiRequest } from "@/lib/api";

// 定義徽章介面
interface GymBadge {
    id: number;
    name: string;
    imageUrl: string;
    gymId: number;
    unlocked: boolean;
}

// 徽章卡片組件
function BadgeCard({ name, imageUrl, unlocked }: { name: string; imageUrl: string; unlocked: boolean }) {
    return (
        <div
            className={`
                relative flex flex-col items-center justify-center p-4 border rounded-lg h-48 transition-all duration-300
                ${unlocked
                    ? 'bg-[#111827] border-gray-700 group hover:border-yellow-400/50 hover:-translate-y-1'
                    : 'bg-[#0f1218] border-gray-800 grayscale opacity-60 cursor-not-allowed'
                }
            `}
        >
            <div className={`
                relative w-24 h-24 mb-4 transition-transform duration-300
                ${unlocked ? 'drop-shadow-[0_0_10px_rgba(250,204,21,0.2)] group-hover:scale-110' : ''}
            `}>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100px, 150px"
                />

                {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[1px]">
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            <span className={`
                px-3 py-1 text-xs font-bold rounded-full text-center transition-colors
                ${unlocked
                    ? 'bg-yellow-400 text-slate-900'
                    : 'bg-gray-700 text-gray-400'
                }
            `}>
                {name}
            </span>
        </div>
    );
}

export default function GymBadgesPage() {
    const { activeJourney, isLoading: isJourneyLoading } = useJourney();
    const [badges, setBadges] = useState<GymBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            if (!activeJourney?.id) return;
            
            try {
                setLoading(true);
                // 使用 apiRequest 取代原生的 fetch 以確保帶上 Token
                const data = await apiRequest(`/journeys/${activeJourney.id}/gym-badges`);
                
                if (Array.isArray(data)) {
                    setBadges(data);
                } else {
                    setBadges([]);
                }
            } catch (error) {
                console.error("Failed to fetch badges", error);
                setBadges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, [activeJourney?.id, activeJourney?.slug]);

    if (isJourneyLoading || loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400/10 rounded-lg">
                            <Medal className="text-yellow-400 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{activeJourney.title}</h2>
                            <p className="text-gray-500 text-sm mt-1">目前旅程的徽章蒐集進度</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <div className="text-gray-500 mb-1">已解鎖</div>
                            <div className="text-yellow-400 font-bold text-xl">{badges.filter(b => b.unlocked).length}</div>
                        </div>
                        <div className="w-px h-8 bg-gray-800"></div>
                        <div className="text-center">
                            <div className="text-gray-500 mb-1">總數</div>
                            <div className="text-white font-bold text-xl">{badges.length}</div>
                        </div>
                    </div>
                </div>

                {badges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-[#111827]/50 rounded-xl border border-dashed border-gray-800">
                        <Medal size={48} className="text-gray-700 mb-4" />
                        <p className="text-gray-500 italic">此旅程目前尚無設定徽章資料</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {badges.map((badge) => (
                            <BadgeCard key={badge.id} name={badge.name} imageUrl={badge.imageUrl} unlocked={badge.unlocked} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}