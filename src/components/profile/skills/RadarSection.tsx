'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart } from '@/components/profile/RadarChart';
import { SkillsHeader } from './SkillsHeader';

interface RadarSectionProps {
    title: string;
    subtitle?: string;
    skillData: Record<string, number>;
    comparisonData?: Record<string, number>;
    showComparison?: boolean;
    onToggleChange?: (show: boolean) => void;
}

const DIMENSIONS = [
    { id: "Logic", name: "邏輯" },
    { id: "Design", name: "設計" },
    { id: "Arch", name: "架構" },
    { id: "Comm", name: "溝通" },
    { id: "Solv", name: "解題" }
];

export const RadarSection: React.FC<RadarSectionProps> = ({ 
    title, 
    subtitle, 
    skillData, 
    comparisonData,
    showComparison = false,
    onToggleChange
}) => (
    <div className="bg-card/50 backdrop-blur-xl border border-border-ui rounded-3xl p-8 lg:p-10 flex flex-col items-center shadow-2xl relative overflow-hidden group mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        {/* 標題區域：保持置左 */}
        <div className="w-full mb-8 relative z-20">
            <SkillsHeader title={title} subtitle={subtitle} />
        </div>
        
        {/* 圖形區域：雷達圖置中，開關靠右 */}
        <div className="w-full py-4 relative z-10 flex items-center justify-center min-h-[340px]">
            <RadarChart 
                data={skillData} 
                comparisonData={comparisonData} 
                showComparison={showComparison} 
            />
            
            {/* 右側交互開關：絕對定位於右側 */}
            <div className="absolute right-0 top-0 flex flex-col items-end space-y-2 group/toggle">
                <div className="flex items-center space-x-3 bg-foreground/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-border-ui hover:bg-foreground/10 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 whitespace-nowrap">
                        全站
                    </span>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={showComparison}
                                onChange={(e) => onToggleChange?.(e.target.checked)}
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors ${showComparison ? 'bg-primary' : 'bg-foreground/20'}`}></div>
                            <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform ${showComparison ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {DIMENSIONS.map((dim) => {
                const score = skillData[dim.id] || 0;
                const compareScore = comparisonData?.[dim.id] || 0;
                
                return (
                    <div key={dim.id} className="bg-foreground/5 border border-border-ui rounded-2xl p-4 flex flex-col items-center group/card hover:bg-foreground/10 transition-all">
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">{dim.name}</span>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-black text-foreground group-hover/card:text-primary transition-colors">
                                {score}
                            </span>
                            {showComparison && (
                                <span className="text-xs font-bold text-foreground/30">
                                    ({compareScore})
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);
