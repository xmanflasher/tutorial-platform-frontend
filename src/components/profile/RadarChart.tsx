'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
    data: Record<string, number>; // Dimension -> Score (0-100)
    comparisonData?: Record<string, number>; // 對比數據 (如全站平均)
    showComparison?: boolean;
    dimensions?: Record<string, string>; // Dimension ID -> Name
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
    data, 
    comparisonData, 
    showComparison = false,
    dimensions = {} 
}) => {
    // 預設維度名稱 (對應後端 SkillMapper 輸出的 Key)
    const dimensionList = [
        { id: "Logic", name: dimensions["Logic"] || "邏輯思維" },
        { id: "Design", name: dimensions["Design"] || "程式設計" },
        { id: "Arch", name: dimensions["Arch"] || "架構設計" },
        { id: "Comm", name: dimensions["Comm"] || "溝通協作" },
        { id: "Solv", name: dimensions["Solv"] || "問題解決" },
    ];

    const size = 300;
    const center = size / 2;
    const radius = size * 0.35;
    const angleStep = (Math.PI * 2) / dimensionList.length;

    // 座標計算工具
    const getCoords = (angle: number, value: number) => {
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.sin(angle),
            y: center - r * Math.cos(angle)
        };
    };

    // 計算主數據頂點
    const points = dimensionList.map((dim, i) => {
        const score = data[dim.id] || 0;
        const coords = getCoords(i * angleStep, Math.max(5, score));
        return `${coords.x},${coords.y}`;
    }).join(' ');

    // 計算對比數據頂點
    const comparisonPoints = comparisonData ? dimensionList.map((dim, i) => {
        const score = comparisonData[dim.id] || 0;
        const coords = getCoords(i * angleStep, Math.max(5, score));
        return `${coords.x},${coords.y}`;
    }).join(' ') : null;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="filter drop-shadow-[0_0_20px_var(--primary)]/10">
                {/* 背景圓圈 (格線) */}
                {[25, 50, 75, 100].map(v => (
                    <circle 
                        key={v} 
                        cx={center} 
                        cy={center} 
                        r={(v / 100) * radius} 
                        fill="none" 
                        stroke="currentColor" 
                        className="text-foreground/5"
                        strokeWidth="1" 
                    />
                ))}

                {/* 軸線 */}
                {dimensionList.map((_, i) => {
                    const outer = getCoords(i * angleStep, 100);
                    return (
                        <line 
                            key={i} 
                            x1={center} 
                            y1={center} 
                            x2={outer.x} 
                            y2={outer.y} 
                            stroke="currentColor" 
                            className="text-foreground/10"
                            strokeWidth="1" 
                        />
                    );
                })}
                
                {/* [對比數據] 線框多邊形 (虛線) */}
                {comparisonPoints && (
                    <motion.polygon
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showComparison ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        points={comparisonPoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="text-foreground/20"
                    />
                )}

                {/* [主數據] 分數多邊形 (動畫) */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    points={points}
                    fill="url(#radarGradient)"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="opacity-40"
                />

                {/* 漸層定義：對齊主題色 */}
                <defs>
                    <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                </defs>

                {/* 維度標籤 */}
                {dimensionList.map((dim, i) => {
                    const labelPos = getCoords(i * angleStep, 125);
                    return (
                        <text
                            key={dim.id}
                            x={labelPos.x}
                            y={labelPos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground/40 text-[11px] font-black tracking-widest uppercase"
                        >
                            {dim.name}
                        </text>
                    );
                })}
            </svg>

            {/* 中央飾點 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"></div>
        </div>
    );
};
