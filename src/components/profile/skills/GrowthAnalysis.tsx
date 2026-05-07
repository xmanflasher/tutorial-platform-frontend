'use client';
import { Zap } from 'lucide-react';

/**
 * 成長分析說明組件
 */
export const GrowthAnalysis = () => (
    <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-16 h-16 text-primary" />
        </div>
        <h3 className="text-primary font-black text-lg mb-4 flex items-center gap-2 uppercase tracking-tight">
            能力值成長說明
        </h3>
        <p className="text-sm text-foreground/60 leading-relaxed mb-4">
            您的技能數據並非簡單的算術平均，而是採用專業的 <span className="text-foreground font-bold italic">EMA (Exponential Moving Average)</span> 系統。
        </p>
        <div className="space-y-3 text-xs text-foreground/50">
            <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <p><span className="text-foreground/80 font-bold">重視近期表現：</span>最近一次挑戰的評級權重更高，幫助您快速脫離新手期。</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                <p><span className="text-foreground/80 font-bold">平滑成長曲線：</span>避免單次失誤造成數值劇烈跳動，維持專業公信力。</p>
            </div>
        </div>
    </div>
);
