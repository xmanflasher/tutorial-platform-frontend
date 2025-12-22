import Link from 'next/link';

function CertificateCard({ title }: { title: string }) {
    return (
        <div className="bg-[#1e1f24] border border-gray-800 rounded-lg p-8 flex flex-col md:flex-row items-center gap-8">
            {/* 左側吉祥物 Placeholder */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <span className="text-4xl">🎓</span>
            </div>

            {/* 右側內容 */}
            <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-2xl font-bold text-yellow-400">{title}</h3>
                <p className="text-gray-400">取得所有徽章，就能獲得你的證書！</p>
                <Link href="/challenges" className="inline-block px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded transition-colors">
                    挑戰取得徽章
                </Link>
            </div>
        </div>
    )
}

export default function CertificatesPage() {
    return (
        <div className="space-y-6">
            <CertificateCard title="軟體設計模式精通之旅" />
            <CertificateCard title="AI x BDD : 規格驅動全自動開發術" />
        </div>
    );
}