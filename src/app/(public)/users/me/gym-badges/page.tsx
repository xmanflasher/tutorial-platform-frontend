import { Medal } from 'lucide-react';

// 模擬資料
const PATTERN_BADGES = [
    { name: '水球流徽章' }, { name: '問就是策略徽章' }, { name: '留同存異徽章' }, { name: '最強開閉徽章' },
    { name: '不再靠直覺徽章' }, { name: '事件響應徽章' }, { name: '指令徽章' }, { name: '狀態徽章' },
    { name: '白段徽章' }, { name: '架構與門面徽章' }, { name: '依賴反轉徽章' }, { name: '代理徽章' }
];

const BDD_BADGES = [
    { name: '協作開發徽章' }, { name: 'TDD 開發徽章' }, { name: 'BDD 開發徽章' }, { name: '指令集架構徽章' },
    { name: 'BDD Agent 徽章' }, { name: '超 AI 化徽章' }, { name: 'DevOps 整合徽章' }
];

function BadgeCard({ name }: { name: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg bg-[#111827] h-40 group hover:border-yellow-400/50 transition-colors">
            {/* 徽章圖示 (暫時用 Icon 代替) */}
            <div className="mb-3 text-gray-600 group-hover:text-yellow-400 transition-colors">
                <Medal size={48} strokeWidth={1} />
            </div>
            <span className="px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full">
                {name}
            </span>
        </div>
    );
}

export default function GymBadgesPage() {
    return (
        <div className="space-y-8">
            {/* Section 1: 軟體設計模式精通之旅 */}
            <section>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">軟體設計模式精通之旅</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {PATTERN_BADGES.map((badge, idx) => (
                        <BadgeCard key={idx} name={badge.name} />
                    ))}
                </div>
            </section>

            {/* Section 2: AI x BDD */}
            <section>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">AI x BDD : 規格驅動全自動開發術</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {BDD_BADGES.map((badge, idx) => (
                        <BadgeCard key={idx} name={badge.name} />
                    ))}
                </div>
            </section>
        </div>
    );
}