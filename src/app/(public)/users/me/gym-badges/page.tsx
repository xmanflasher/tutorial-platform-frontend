"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Medal, Lock } from "lucide-react";

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
            {/* 徽章圖片容器 */}
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

                {/* 如果未解鎖，顯示一個鎖頭 Icon 覆蓋在上面 */}
                {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[1px]">
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            {/* 徽章名稱標籤 */}
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
    const [patternBadges, setPatternBadges] = useState<GymBadge[]>([]);
    const [bddBadges, setBddBadges] = useState<GymBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 並行請求：同時撈取 Journey 0 (設計模式) 與 Journey 4 (BDD) 的徽章
                const [patternRes, bddRes] = await Promise.all([
                    fetch("http://localhost:8080/api/journeys/0/gym-badges"),
                    fetch("http://localhost:8080/api/journeys/4/gym-badges"),
                ]);

                if (!patternRes.ok || !bddRes.ok) {
                    console.error("部分 API 請求失敗");
                }

                const patternData = await patternRes.json();
                const bddData = await bddRes.json();

                // Debug 用：看看現在拿回來的資料是不是變多了？
                console.log("Journey 0 Badges:", patternData);
                console.log("Journey 4 Badges:", bddData);

                setPatternBadges(patternData);
                setBddBadges(bddData);
            } catch (error) {
                console.error("Failed to fetch badges", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Section 1: 軟體設計模式精通之旅 */}
            <section>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-2">
                    <Medal className="text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">軟體設計模式精通之旅</h2>
                </div>

                {patternBadges.length === 0 ? (
                    <p className="text-gray-500 italic">尚無徽章資料</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {patternBadges.map((badge) => (
                            <BadgeCard key={badge.id} name={badge.name} imageUrl={badge.imageUrl} unlocked={badge.unlocked} />
                        ))}
                    </div>
                )}
            </section>

            {/* Section 2: AI x BDD */}
            <section>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-2">
                    <Medal className="text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">AI x BDD : 規格驅動全自動開發術</h2>
                </div>

                {bddBadges.length === 0 ? (
                    <p className="text-gray-500 italic">尚無徽章資料</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {bddBadges.map((badge) => (
                            <BadgeCard key={badge.id} name={badge.name} imageUrl={badge.imageUrl} unlocked={badge.unlocked} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}