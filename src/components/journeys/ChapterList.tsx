'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // ★ 1. 引入 Link
import { Chapter } from '@/types';
import { ChevronDown, ChevronUp, PlayCircle, FileText, Lock, CheckCircle } from 'lucide-react';
import { orderStore } from '@/lib/orderStore';
import { apiRequest } from '@/lib/api';

// ★ 2. 增加 journeySlug 到 props 定義中
interface ChapterListProps {
  chapters: Chapter[];
  journeySlug: string;
}

export default function ChapterList({ chapters, journeySlug }: ChapterListProps) {
  // 預設展開第一個章節
  const [openChapterIds, setOpenChapterIds] = useState<number[]>([chapters[0]?.id]);
  const [isOwned, setIsOwned] = useState(false);
  const [finishedIds, setFinishedIds] = useState<number[]>([]);

  useEffect(() => {
    // 檢查購買狀態
    setIsOwned(orderStore.isCourseOwned(journeySlug));

    // 抓取已完成課程
    const fetchProgress = async () => {
      try {
        const ids = await apiRequest<number[]>('/learning-records/me/finished-lessons', { silent: true });
        setFinishedIds(Array.isArray(ids) ? ids : []);
      } catch (err) {
        console.warn("[ChapterList] 載入進度失敗", err);
      }
    };
    fetchProgress();
  }, [journeySlug]);

  const toggleChapter = (id: number) => {
    setOpenChapterIds((prev: number[]) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter, idx) => {
        const isOpen = openChapterIds.includes(chapter.id);

        return (
          <div key={chapter.id} className="border border-slate-700 rounded-xl bg-[#111827] overflow-hidden">

            {/* 章節標題 (可點擊) */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">
                  {chapter.name}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20 font-bold">
                    試看章節
                  </span>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="text-slate-400" />
              ) : (
                <ChevronDown className="text-slate-400" />
              )}
            </button>

            {/* 單元列表 (展開內容) */}
            {isOpen && (
              <div className="border-t border-slate-700/50 bg-[#0B1121]">
                {chapter.lessons.map((lesson) => (
                  // ★ 3. 將原本的 div 改為 Link，並組裝 href
                  <Link
                    key={lesson.id} // 建議改用 id 當 key
                    href={`/journeys/${journeySlug}/chapters/${chapter.id}/lessons/${lesson.id}`}
                    className="flex items-center gap-4 p-4 pl-8 hover:bg-slate-800/30 transition-colors cursor-pointer group border-b border-slate-800/50 last:border-0"
                  >
                    {/* Icon: 根據類型顯示不同圖示 */}
                    <div className="text-slate-400 group-hover:text-yellow-400 transition-colors">
                      {lesson.type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
                    </div>

                    {/* 標題與資訊 */}
                    <div className="flex-1">
                      <div className="text-slate-300 group-hover:text-white font-medium transition-colors text-sm md:text-base">
                        {lesson.name}
                      </div>
                    </div>

                    {/* 右側狀態：已完成 > 試看 > 鎖頭 */}
                    <div className="text-xs text-slate-500">
                      {finishedIds.includes(Number(lesson.id)) ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (idx === 0 && lesson.premiumOnly !== true) ? (
                        <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded border border-yellow-400/20 font-bold">
                          試看
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {/* 顯示時間或是鎖頭 */}
                          <span>{lesson.videoLength}</span>
                          {!isOwned && <Lock size={14} />}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}