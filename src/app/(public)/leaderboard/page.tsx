import { getLeaderboard, getAnnouncement } from '@/lib/api';
import AnnouncementBar from '@/components/home/AnnouncementBar';

export const metadata = {
  title: '學員排行榜 - 水球軟體學院',
};

export default async function LeaderboardPage() {
  // 1. 並行獲取資料
  const [leaderboard, announcement] = await Promise.all([
    getLeaderboard(),
    getAnnouncement(),
  ]);

  return (
    <div className="pb-10 max-w-5xl mx-auto">
      {/* 2. 頂部廣告條 */}
      <div className="mb-8">
        <AnnouncementBar data={announcement} />
      </div>

      {/* 3. 排行榜主要容器 (包覆 Tab 與 列表) */}
      <div className="bg-[#0f1623] border border-slate-800 rounded-2xl p-6 shadow-xl">
        
        {/* A. Tabs 切換區塊 (位於容器內部上方) */}
        <div className="flex items-center gap-1 mb-6">
          <button className="px-6 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg text-sm shadow hover:bg-yellow-300 transition-colors">
            學習排行榜
          </button>
          <button className="px-6 py-2 bg-transparent text-slate-500 hover:text-slate-300 font-bold rounded-lg text-sm transition-colors">
            本週成長榜
          </button>
        </div>

        {/* B. 可捲動的列表區域 (限制高度 + overflow-y-auto) */}
        {/* h-[500px] 大約是可以顯示 5 個項目 + 一點點露出的高度，讓使用者知道可以捲動 */}
        <div className="h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {leaderboard.map((user, index) => {
            const avatarDisplay = user.avatar || user.name.charAt(0);
            // 為了演示捲動效果，如果資料少於 5 筆，您可以去 mock/index.ts 多複製幾份資料
            
            return (
              <div 
                key={user.id} 
                className="flex items-center p-4 bg-[#1E293B] rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all group"
              >
                {/* 排名 */}
                <div className="w-16 flex-shrink-0 text-center">
                  <span className={`font-mono font-bold text-2xl ${
                    user.rank <= 3 ? 'text-white scale-110 inline-block' : 'text-slate-500'
                  }`}>
                    {user.rank}
                  </span>
                </div>

                {/* 頭像與名稱 */}
                <div className="flex-1 flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border-2 border-slate-600 overflow-hidden flex-shrink-0 group-hover:border-slate-400 transition-colors">
                    {avatarDisplay.length === 1 ? (
                      <span className="text-xl">{avatarDisplay}</span>
                    ) : (
                      <img src={avatarDisplay} alt={user.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="text-white font-bold text-lg truncate group-hover:text-yellow-400 transition-colors">
                      {user.name}
                    </div>
                    <div className="text-slate-400 text-xs md:text-sm">{user.title}</div>
                  </div>
                </div>

                {/* 等級與分數 */}
                <div className="flex items-center gap-4 md:gap-8 ml-4">
                  <div className="px-3 py-1 bg-slate-200/10 text-slate-300 rounded text-xs md:text-sm font-bold font-mono whitespace-nowrap border border-slate-700">
                    Lv.{user.level}
                  </div>
                  <div className="w-20 md:w-24 text-right text-xl md:text-2xl font-medium text-slate-200 font-mono">
                    {user.score.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* 空狀態 (如果沒資料時顯示) */}
          {leaderboard.length === 0 && (
             <div className="h-full flex items-center justify-center text-slate-500">
                暫無排名資料
             </div>
          )}
        </div>
      </div>
    </div>
  );
}