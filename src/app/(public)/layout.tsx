'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; // 保留 Link，但 Header 邏輯改用 button + router.push
import { useRouter, usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { ALL_JOURNEYS } from '@/mock';
import { JourneyProvider, useJourney } from '@/context/JourneyContext'; // ★ 引入 Context

// ★ 建立一個內部元件 LayoutContent，因為 useJourney 必須在 JourneyProvider 內部使用
function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const { activeJourney, setActiveSlug } = useJourney(); // 使用 Context

  // 點擊外部關閉 Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ★★★ 核心邏輯：切換旅程時的行為 ★★★
  const handleSwitchJourney = (targetSlug: string) => {
    setDropdownOpen(false); // 關閉選單
    
    // 情況 1：如果當前是在 "單元詳細頁" (/journeys/...)
    // 行為：必須跳轉，不然內容會不對
    if (pathname.startsWith('/journeys/')) {
      router.push(`/journeys/${targetSlug}`);
    } 
    // 情況 2：如果當前是在 "全域頁" (首頁、排行榜、課程)
    // 行為：不跳轉，只更新狀態 (Sidebar 會跟著變)
    else {
      setActiveSlug(targetSlug);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white flex">
      <Sidebar 
        onClose={() => setSidebarOpen(false)}
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 bg-[#0d0e11] z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white md:hidden">
              <Menu size={24} />
            </button>

            {/* Header Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1f24] rounded border border-gray-700 cursor-pointer hover:border-gray-500 transition-colors max-w-[200px] md:max-w-xs"
              >
                <span className="text-sm font-medium truncate">{activeJourney.title}</span>
                <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e1f24] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <p className="px-3 py-2 text-xs text-gray-500 font-bold">切換旅程</p>
                    {ALL_JOURNEYS.map(journey => (
                      <button 
                        key={journey.id}
                        onClick={() => handleSwitchJourney(journey.slug)} // ★ 改用 button 觸發我們的邏輯
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-700 hover:text-white ${
                          activeJourney.slug === journey.slug ? 'text-yellow-400 bg-gray-800' : 'text-gray-300'
                        }`}
                      >
                        {journey.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-yellow-500 transition-colors">
            登入
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

// 主 Layout 元件
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    // ★ 用 Provider 包住整個內容
    <JourneyProvider>
      <LayoutContent>{children}</LayoutContent>
    </JourneyProvider>
  );
}