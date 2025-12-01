// components/Footer.jsx
// 這個組件預設為 Server Component，不需要 'use client'

import Link from 'next/link';

// 假設這就是您的網站名稱
const SITE_NAME = '水球軟體學院';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white mt-12">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">

                    {/* 關於我們 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">關於 {SITE_NAME}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">學院宗旨</Link></li>
                            <li><Link href="/team" className="hover:text-blue-400 transition-colors">我們的團隊</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">聯絡我們</Link></li>
                        </ul>
                    </div>

                    {/* 快速連結 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">快速連結</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/courses" className="hover:text-blue-400 transition-colors">所有課程</Link></li>
                            <li><Link href="/journeys" className="hover:text-blue-400 transition-colors">學習旅程</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">技術部落格</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-blue-400 transition-colors">排行榜</Link></li>
                        </ul>
                    </div>

                    {/* 資源 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">資源</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/faq" className="hover:text-blue-400 transition-colors">常見問題</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">隱私權政策</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">服務條款</Link></li>
                        </ul>
                    </div>

                    {/* 社群 (水球軟體學院可能有的社群連結) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">追蹤我們</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://github.com/waterballsa" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a></li>
                            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Facebook</a></li>
                            <li><a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Discord 社群</a></li>
                        </ul>
                    </div>

                </div>

                {/* 版權信息 */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    © {currentYear} {SITE_NAME}. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;