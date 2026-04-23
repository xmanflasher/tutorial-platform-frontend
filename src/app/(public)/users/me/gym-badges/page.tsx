"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Medal, Lock } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { apiRequest } from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import BadgeCelebrationOverlay from "@/components/common/BadgeCelebrationOverlay";

// 定義徽章介面
interface GymBadge {
    id: number;
    name: string;
    imageUrl: string;
    gymId: number;
    unlocked: boolean;
}

// 徽章卡片組件
function BadgeCard({ name, imageUrl, unlocked, onClick }: { name: string; imageUrl: string; unlocked: boolean; onClick?: () => void }) {
    return (
        <div
            onClick={unlocked ? onClick : undefined}
            className={`
                relative flex flex-col items-center justify-center p-4 border rounded-xl h-52 transition-all duration-300
                ${unlocked
                    ? 'bg-card/50 border-gray-700 group hover:border-primary/50 hover:-translate-y-2 cursor-pointer shadow-xl hover:shadow-primary/5'
                    : 'bg-[#0f1218] border-border-ui grayscale opacity-60 cursor-not-allowed'
                }
            `}
        >
            <div className={`
                relative w-28 h-28 mb-4 transition-transform duration-500
                ${unlocked ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.15)] group-hover:scale-110 group-hover:rotate-6' : ''}
            `}>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 120px, 180px"
                />

                {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[1px]">
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            <span className={`
                px-3 py-1.5 text-xs font-black rounded-full text-center transition-colors uppercase tracking-tight
                ${unlocked
                    ? 'bg-primary text-black'
                    : 'bg-gray-800 text-gray-500'
                }
            `}>
                {name}
            </span>
            
            {unlocked && (
                <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-primary/60 font-medium">
                    點擊重溫榮耀
                </div>
            )}
        </div>
    );
}

export default function GymBadgesPage() {
    const { activeJourney, isLoading: isJourneyLoading } = useJourney();
    const [badges, setBadges] = useState<GymBadge[]>([]);
    const [loading, setLoading] = useState(true);
    const [celebratingBadge, setCelebratingBadge] = useState<GymBadge | null>(null);

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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            <AnimatePresence>
                {celebratingBadge && (
                    <BadgeCelebrationOverlay 
                        badgeId={celebratingBadge.id}
                        badgeName={celebratingBadge.name}
                        imageUrl={celebratingBadge.imageUrl}
                        onClose={() => setCelebratingBadge(null)} 
                    />
                )}
            </AnimatePresence>

            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border-ui pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                            <Medal className="text-primary w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase">{activeJourney.title}</h2>
                            <p className="text-gray-500 text-sm mt-1 font-medium">榮譽勳章收納盒</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                        <div className="text-center">
                            <div className="text-gray-500 mb-1 font-bold text-[10px] uppercase">已解鎖</div>
                            <div className="text-primary font-black text-2xl leading-none">
                                {badges.filter(b => b.unlocked).length}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-700"></div>
                        <div className="text-center">
                            <div className="text-gray-500 mb-1 font-bold text-[10px] uppercase">總數</div>
                            <div className="text-white font-black text-2xl leading-none">
                                {badges.length}
                            </div>
                        </div>
                    </div>
                </div>

                {badges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-card/20 rounded-2xl border border-dashed border-border-ui">
                        <Medal size={48} className="text-gray-700 mb-4 opacity-20" />
                        <p className="text-gray-500 italic font-medium">此旅程目前尚未配置榮譽徽章</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {badges.map((badge) => (
                            <BadgeCard 
                                key={badge.id} 
                                name={badge.name} 
                                imageUrl={badge.imageUrl} 
                                unlocked={badge.unlocked} 
                                onClick={() => setCelebratingBadge(badge)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}