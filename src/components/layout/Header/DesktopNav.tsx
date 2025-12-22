'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext'; // 1. 引入 Context
import { ALL_JOURNEYS } from '@/mock'; // 引入旅程資料

export default function DesktopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. 改用 Context 取得當前激活的旅程與設定方法
  const { activeJourney, setActiveSlug } = useJourney();

  // 判斷當前 URL 是否在某個旅程內
  const matchedJourney = ALL_JOURNEYS.find(j => pathname.startsWith(`/journeys/${j.slug}`));

  const handleSelect = (targetSlug: string) => {
    setIsOpen(false);

    // 找出目標旅程的 path
    const targetJourney = ALL_JOURNEYS.find(j => j.slug === targetSlug);
    const targetPath = `/journeys/${targetSlug}`;

    // 情境 A：當前「不在」任何旅程內 (例如：首頁、個人檔案)
    if (!matchedJourney) {
      // ★★★ 關鍵修正：呼叫 Context 更新全站狀態，讓 Sidebar 跟著變 ★★★
      setActiveSlug(targetSlug);
      return;
    }

    // 情境 B：當前「正在」某個旅程內 -> 執行智慧轉跳
    // 如果切換了旅程，我們要通知 Context (雖然 useEffect 也會監聽 URL，但主動設定更保險)
    setActiveSlug(targetSlug);

    let nextPath = targetPath;
    const currentPathPrefix = `/journeys/${matchedJourney.slug}`;

    if (pathname.startsWith(currentPathPrefix)) {
      const suffix = pathname.replace(currentPathPrefix, '');
      const hasSpecificId = /\/\d+/.test(suffix); // 檢查是否有 ID (如 missions/1)
      if (!hasSpecificId) {
        nextPath = targetPath + suffix;
      }
    }

    router.push(nextPath);
  };

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all w-72 shadow-sm group"
      >
        {/* 3. 顯示 Context 中的 activeJourney */}
        <span className="text-sm font-bold truncate">{activeJourney?.title || '選擇旅程'}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {ALL_JOURNEYS.map((journey) => (
            <button
              key={journey.slug}
              onClick={() => handleSelect(journey.slug)} // 傳入 slug
              className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-between transition-colors border-b border-slate-700/50 last:border-0"
            >
              <span className="truncate font-medium">{journey.title}</span>
              {/* 4. 比對 Context 中的 slug */}
              {activeJourney?.slug === journey.slug && (
                <Check size={16} className="text-yellow-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}