import { getJourneyBySlug } from '@/lib/api';
import ChapterList from '@/components/journeys/ChapterList';
import SidebarWidget from '@/components/journeys/SidebarWidget';
import { Video, CheckCircle2, ArrowRight } from 'lucide-react';

// ★★★ 1. 修改 Props 定義：params 是一個 Promise ★★★
export default async function JourneyDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  
  // ★★★ 2. 關鍵修正：必須先 await params 才能拿到 slug ★★★
  const { slug } = await params;

  // 3. 現在 slug 已經正確取到了，再傳入 API
  const journey = await getJourneyBySlug(slug);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 pt-6">
      
      {/* (選用) 頂部 Banner：如果你希望像第一張圖那樣有活動通知，可以保留這塊 */}
      <div className="bg-[#1e1f24] border border-gray-800 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-black/20">
        <p className="text-gray-200 text-sm md:text-base font-medium text-center sm:text-left">
          將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！
        </p>
        <button className="bg-yellow-400 text-black font-bold px-6 py-2 rounded hover:bg-yellow-500 transition-colors shrink-0 flex items-center gap-2">
          前往 <ArrowRight size={16}/>
        </button>
      </div>
      
      {/* ★★★ 關鍵修改：將 lg:grid-cols-3 改為 md:grid-cols-3 ★★★ 
          這樣 > 768px (平板/半螢幕) 就會變成 3 欄模式 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* === 左側：主要內容 (佔 2 等份) === 
            改為 md:col-span-2 */}
        <div className="md:col-span-2 space-y-10">
          
          <section>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {journey.title}
            </h1>
            <p className="text-slate-400 text-lg mb-6 italic font-medium">
              {journey.subtitle}
            </p>
            
            <div className="text-slate-300 leading-relaxed whitespace-pre-line mb-6 text-base md:text-lg">
              {journey.description}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>{journey.totalVideos} 部影片</span>
              </div>
              {journey.tags.map(tag => (
                <div key={tag} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{tag}</span>
                </div>
              ))}
            </div>

            {/* 手機版按鈕：只在 < 768px 顯示 (md:hidden) */}
            <div className="flex flex-wrap gap-4 md:hidden mb-8">
               <button className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-lg">
                 {journey.actionButtons.primary}
               </button>
               <button className="flex-1 py-3 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold rounded-lg">
                 {journey.actionButtons.secondary}
               </button>
            </div>

            {/* 桌機版按鈕：在 > 768px 顯示 (hidden md:flex) */}
            <div className="hidden md:flex gap-4">
               <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                 {journey.actionButtons.primary}
               </button>
               <button className="px-8 py-3 border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold rounded-lg transition-all">
                 {journey.actionButtons.secondary}
               </button>
            </div>
          </section>

          <section>
            <ChapterList chapters={journey.chapters} />
          </section>

        </div>


        {/* === 右側：次要內容 (佔 1 等份) === 
            改為 md:col-span-1 並加上 sticky */}
        <div className="md:col-span-1 sticky top-24">
          <SidebarWidget journey={journey} />
        </div>

      </div>
    </div>
  );
}