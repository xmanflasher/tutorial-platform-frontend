'use client';

import { useEffect, useState } from 'react';
import { homeService } from '@/services/homeService';
import { LeaderboardMember } from '@/types';

export default function LeaderboardPage() {
  const [members, setMembers] = useState<LeaderboardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await homeService.getLeaderboard(); // 透過 Service 拿資料
        setMembers(data);
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Helper: 產生隨機背景色 (根據名字計算 Hash)
  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">學習排行榜</h1>
        <p className="text-gray-400">看看誰是目前最強的學習者！</p>
      </div>

      {/* ★ 1. 設定固定高度 (h-[600px]) 並使用 flex-col 佈局 */}
      <div className="bg-[#1e1f24] rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[600px]">

        {/* ★ 2. 表頭固定 (flex-none) */}
        <div className="flex-none flex items-center p-4 border-b border-gray-700 bg-gray-900/90 text-gray-400 text-sm font-medium z-10 backdrop-blur-sm">
          <div className="w-16 text-center">排名</div>
          <div className="flex-1">學員</div>
          <div className="w-24 text-center">等級</div>
          <div className="w-32 text-right pr-4">經驗值</div>
        </div>

        {/* ★ 3. 列表區域可捲動 (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">載入中...</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center p-4 hover:bg-gray-800/50 transition-colors"
                >
                  {/* 排名 */}
                  <div className={`w-16 text-center text-xl font-bold ${index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' : 'text-gray-500'
                    }`}>
                    {index + 1}
                  </div>

                  {/* 頭像與資訊 */}
                  <div className="flex-1 flex items-center gap-4">

                    {/* ★ 4. 純 CSS 文字頭像 (解決圖片載入問題) */}
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center 
                      text-white font-bold text-lg border-2 border-gray-700 shrink-0
                      ${getAvatarColor(member.name)}
                    `}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0"> {/* min-w-0 確保文字過長時會 truncate */}
                      <div className="font-bold text-white text-lg truncate">{member.name}</div>
                      <div className="text-xs text-gray-400 truncate">{member.jobTitle || '熱愛學習的工程師'}</div>
                    </div>
                  </div>

                  {/* 等級徽章 */}
                  <div className="w-24 flex justify-center">
                    <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
                      Lv.{member.level}
                    </span>
                  </div>

                  {/* 經驗值 */}
                  <div className="w-32 text-right pr-4 font-mono text-yellow-400 font-bold">
                    {member.exp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}