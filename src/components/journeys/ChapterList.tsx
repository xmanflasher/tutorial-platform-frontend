'use client';

import { useState } from 'react';
import Link from 'next/link'; // ★ 1. 引入 Link
import { Chapter } from '@/types';
import { ChevronDown, ChevronUp, PlayCircle, FileText, Lock } from 'lucide-react';

// ★ 2. 增加 journeySlug 到 props 定義中
interface ChapterListProps {
  chapters: Chapter[];
  journeySlug: string;
}

export default function ChapterList({ chapters, journeySlug }: ChapterListProps) {
  // 預設展開第一個章節
  const [openChapterIds, setOpenChapterIds] = useState<number[]>([chapters[0]?.id]);

  const toggleChapter = (id: number) => {
    setOpenChapterIds((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => {
        const isOpen = openChapterIds.includes(chapter.id);

        return (
          <div key={chapter.id} className="border border-slate-700 rounded-xl bg-[#111827] overflow-hidden">

            {/* 章節標題 (可點擊) */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-800/50 transition-colors text-left"
            >
              <span className="text-lg font-bold text-white">
                {chapter.name}
              </span>
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

                    {/* 右側狀態：試看或鎖頭 */}
                    <div className="text-xs text-slate-500">
                      {/* ★ 修正邏輯：premiumOnly 為 false 代表免費試看，為 true 代表鎖住 */}
                      {!lesson.premiumOnly ? (
                        <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded border border-yellow-400/20 font-bold">
                          試看
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {/* 顯示時間或是鎖頭 */}
                          <span>{lesson.videoLength}</span>
                          <Lock size={14} />
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