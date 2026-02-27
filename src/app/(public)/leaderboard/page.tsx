'use client';

import { useEffect, useState } from 'react';
import { homeService } from '@/services/homeService';
import { LeaderboardMember } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<LeaderboardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await homeService.getLeaderboard();
        setMembers(data);
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const currentUserRank = members.findIndex(m => m.id === user?.id) + 1;

  // Helper: 產生隨機背景色
  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
      <div className="mb-8 pl-4 border-l-4 border-yellow-400">
        <h1 className="text-3xl font-bold text-white mb-2">學習排行榜</h1>
        <p className="text-gray-400">看看誰是目前最強的學習者！</p>
      </div>

      <div className="bg-[#1e1f24] rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[600px] shadow-2xl shadow-black/50">
        <div className="flex-none flex items-center p-4 border-b border-gray-700 bg-gray-900/90 text-gray-400 text-sm font-medium z-10 backdrop-blur-sm">
          <div className="w-16 text-center">排名</div>
          <div className="flex-1">學員</div>
          <div className="w-24 text-center">等級</div>
          <div className="w-32 text-right pr-4">經驗值</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center flex-col gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
              <span>正在載入資料...</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-800 relative">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  id={`member-${member.id}`}
                  className={`flex items-center p-4 hover:bg-gray-800/50 transition-colors ${member.id === user?.id ? 'bg-yellow-400/10' : ''}`}
                >
                  <div className={`w-16 text-center text-xl font-bold ${index === 0 ? 'text-yellow-400 scale-110' :
                    index === 1 ? 'text-slate-300' :
                      index === 2 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center 
                      text-white font-bold text-lg border-2 border-gray-700 shrink-0
                      ${getAvatarColor(member.name)}
                    `}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-white text-lg truncate flex items-center gap-2">
                        {member.name}
                        {member.id === user?.id && <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-bold">YOU</span>}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{member.jobTitle || '熱愛學習的工程師'}</div>
                    </div>
                  </div>

                  <div className="w-24 flex justify-center">
                    <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded border border-gray-600">
                      Lv.{member.level}
                    </span>
                  </div>

                  <div className="w-32 text-right pr-4 font-mono text-yellow-400 font-bold">
                    {member.exp.toLocaleString()}
                  </div>
                </div>
              ))}

              {/* ★ 底部浮動排名區 (改為 Sticky) ★ */}
              {!loading && user && (
                <div className="sticky bottom-0 z-20 p-2 bg-gray-900 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                  <div className="bg-slate-900 border border-yellow-500/30 rounded-xl shadow-2xl p-4 flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">我的排名</div>
                        <div className="text-lg font-black text-yellow-400 leading-tight">
                          #{currentUserRank > 0 ? currentUserRank : '-'}
                        </div>
                      </div>

                      <div className="h-8 w-[1px] bg-gray-700 mx-1" />

                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-yellow-400/30 ${getAvatarColor(user.name)}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="flex gap-2 text-[10px]">
                            <span className="text-yellow-400 font-bold">Lv.{user.level}</span>
                            <span className="text-gray-500">{user.exp.toLocaleString()} EXP</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const el = document.getElementById(`member-${user.id}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-gray-700"
                    >
                      在榜中查看
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}