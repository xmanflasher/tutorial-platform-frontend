'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';

// 定義所有的旅程選項
const JOURNEYS = [
  { 
    label: '軟體設計模式精通之旅', 
    path: '/journeys/software-design-pattern' 
  },
  { 
    label: 'AI x BDD：規格驅動全自動開發術', 
    path: '/journeys/ai-bdd' 
  },
];

export default function DesktopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 根據當前路徑判斷選中的旅程 (預設為第一個)
  const currentJourney = JOURNEYS.find(j => pathname.startsWith(j.path)) || JOURNEYS[0];

  // 點擊選項後的處理
  const handleSelect = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  // 點擊外部關閉選單的偵聽器
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
      {/* 觸發按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all w-72 shadow-sm group"
      >
        <span className="text-sm font-bold truncate">{currentJourney.label}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 下拉選單內容 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {JOURNEYS.map((journey) => (
            <button
              key={journey.path}
              onClick={() => handleSelect(journey.path)}
              className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-between transition-colors border-b border-slate-700/50 last:border-0"
            >
              <span className="truncate font-medium">{journey.label}</span>
              {currentJourney.path === journey.path && (
                <Check size={16} className="text-yellow-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}