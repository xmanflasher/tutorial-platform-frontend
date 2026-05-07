'use client';

const DEFINITIONS = [
    { name: "邏輯思維 (Logic)", desc: "問題拆解與演算法核心邏輯。" },
    { name: "程式設計 (Design)", desc: "代碼品質、潔淨程度與實作力。" },
    { name: "架構設計 (Arch)", desc: "模組化設計、解耦與擴展性。" },
    { name: "溝通協作 (Comm)", desc: "回饋表達、意圖傳遞與團隊契合。" },
    { name: "問題解決 (Solv)", desc: "偵錯能力、應變力與查閱資料力。" }
];

/**
 * 技能維度定義清單組件
 */
export const DimensionDefinitions = () => (
    <div className="bg-card/30 border border-border-ui rounded-2xl p-8">
        <h3 className="text-foreground font-black text-lg mb-8 uppercase tracking-tight">評級維度定義</h3>
        <ul className="space-y-6">
            {DEFINITIONS.map((dim, i) => (
                <li key={i} className="flex gap-5 group/item">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-border-ui group-hover/item:border-primary/30 transition-colors">
                        <span className="text-primary font-mono text-sm font-black">0{i+1}</span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-foreground mb-1 group-hover/item:text-primary transition-colors">{dim.name}</p>
                        <p className="text-xs text-foreground/40 leading-tight">{dim.desc}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);
