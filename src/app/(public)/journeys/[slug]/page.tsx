export const revalidate = 300; // ISR Optimization//強制設定動態渲染 (解決 Route 錯誤)

import ChapterList from '@/components/journeys/ChapterList';
import CertificateWidget from '@/components/journeys/CertificateWidget';
import { journeyService } from '@/services';
import { Video, CheckCircle2, ArrowRight } from 'lucide-react';

export default async function JourneyDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const journey = await journeyService.getJourneyBySlug(slug);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 pt-0">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-2 space-y-10">

          <section>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {journey.title}
            </h1>
            <div className="text-slate-300 leading-relaxed whitespace-pre-line mb-6 text-base md:text-lg">
              {journey.description}
            </div>

            {/* ... (標籤與按鈕區域省略，保持原樣) ... */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>{journey.totalVideos || 0} 部影片</span>
              </div>
              {journey.tags && journey.tags.map(tag => (
                <div key={tag} className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{tag}</span>
                </div>
              ))}
            </div>

            <div className="hidden md:flex gap-4">
              <button className="px-8 py-3 bg-primary hover:bg-primary text-black font-bold rounded-lg shadow-lg shadow-yellow-400/20 transition-all hover:scale-105">
                {journey.actionButtons?.primary || "立即加入"}
              </button>
              <button className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 font-bold rounded-lg transition-all">
                {journey.actionButtons?.secondary || "試聽課程"}
              </button>
            </div>
          </section>

          <section>
            {/* ★★★ 修正這裡：補上 journeySlug={slug} ★★★ */}
            {/* 這樣 ChapterList 就能拿到 slug 去組出正確的連結了 */}
            <ChapterList
              chapters={journey.chapters}
              journeySlug={slug}
            />
          </section>

        </div>

        <div className="md:col-span-1 sticky top-24">
          <CertificateWidget journey={journey} />
        </div>

      </div>
    </div>
  );
}