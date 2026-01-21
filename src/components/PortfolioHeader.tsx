"use client";

import React from "react";

interface UserProfile {
    id: number;
    name: string;
    nickName: string;
    jobTitle: string;
    avatar: string;
}

// 模擬的能力值數據 (依照你的參考圖 SSS 等級)
const MOCK_STATS = [
    { label: "需求結構化分析", value: "SSS" },
    { label: "區分結構與行為", value: "SSS" },
    { label: "抽象/萃取能力", value: "SSS" },
    { label: "建立 Well-Defined Context", value: "SSS" },
    { label: "熟悉設計模式的 Form", value: "SSS" },
    { label: "游刃有餘的開發能力", value: "SSS" },
];

export default function PortfolioHeader({ profile }: { profile: UserProfile | null }) {
    if (!profile) return null;

    return (
        <div className="relative w-full mb-12">
            {/* 上半部：背景與個人資料 */}
            <div className="relative overflow-hidden rounded-t-lg border border-gray-800 bg-[#161b22] shadow-lg">

                {/* 1. 背景特效 (漸層 + 網格) */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black">
                    {/* 模擬 bg-grid-white/[0.03] 的網格效果 */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}>
                    </div>
                </div>

                <div className="relative z-10 p-6 sm:p-8 backdrop-blur-[2px]">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-x-8 sm:space-y-0 container mx-auto">

                        {/* 2. 大頭貼與徽章 */}
                        <div className="relative flex-shrink-0 w-24 h-24">
                            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-[#0d0e11] shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={profile.avatar || "https://lh3.googleusercontent.com/a/ACg8ocLmBvxLuD4JuMNsBGXZfdlfE7vJBfGn25GK4v_CEnc0lLhg=s96-c"}
                                    alt="Profile avatar"
                                    className="block h-full w-full object-cover"
                                />
                            </div>
                            {/* 等級徽章 (右下角) */}
                            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full overflow-hidden z-10 border-2 border-[#0d0e11] bg-[#1c2128]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://cdn.waterballsa.tw/software-design-pattern/gym-badges/14.png"
                                    alt="Level badge"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* 3. 姓名與職稱 */}
                        <div className="flex flex-col flex-grow justify-center h-24">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
                                    {profile.nickName}
                                </h2>
                                <p className="text-gray-400 text-sm font-mono">
                                    #{profile.id} <span className="mx-2">|</span> {profile.jobTitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 下半部：六維能力值 Grid */}
            <div className="grid grid-cols-2 gap-px bg-gray-800 border-x border-b border-gray-800 sm:grid-cols-6 rounded-b-lg overflow-hidden">
                {MOCK_STATS.map((stat, index) => (
                    <div key={index} className="p-4 text-center bg-[#161b22] hover:bg-[#1c2128] transition-colors group cursor-default">
                        <div className="text-xl font-bold text-yellow-500 mb-1 group-hover:scale-110 transition-transform duration-300">
                            {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                            <span className="block">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}