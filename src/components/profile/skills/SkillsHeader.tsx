'use client';
import { TrendingUp, Info, Target } from 'lucide-react';

/**
 * 技能頁面標題組件
 */
interface SkillsHeaderProps {
    title?: string;
    subtitle?: string;
}

export const SkillsHeader: React.FC<SkillsHeaderProps> = ({ 
    title = "GLOBAL SKILL RADAR", 
    subtitle = "COMPREHENSIVE ABILITY ASSESSMENT" 
}) => (
    <div className="w-full flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="text-primary w-5 h-5" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">{title}</h2>
                <p className="text-xs text-foreground/50 mt-1 uppercase tracking-widest font-bold">{subtitle}</p>
            </div>
        </div>
        
        <div className="group/info relative">
            <div className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-help text-foreground/30">
                <Info className="w-5 h-5" />
            </div>
            <div className="absolute right-0 top-full mt-3 w-72 p-4 bg-card text-[13px] text-foreground/60 rounded-xl opacity-0 group-hover/info:opacity-100 transition-all z-50 border border-border-ui shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none transform translate-y-2 group-hover/info:translate-y-0">
                <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> EMA 加權演算法
                </p>
                技能評級基於您在所有 Journey 中的挑戰表現。我們採用指數加權移動平均，優先採計近期成績，讓您的每一分進步都能即時反映在雷達圖上。
            </div>
        </div>
    </div>
);
