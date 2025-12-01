'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { JOURNEY_MAP, ALL_JOURNEYS } from '@/mock'; // 確保引入你的資料
import { JourneyDetail } from '@/types'; // 確保引入你的型別

interface JourneyContextType {
  activeJourney: JourneyDetail;
  setActiveSlug: (slug: string) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // 預設選中第一個旅程 (軟體設計模式)
  const [activeSlug, setActiveSlugState] = useState<string>(ALL_JOURNEYS[0].slug);

  // ★★★ 關鍵邏輯：當 URL 改變時，自動同步 Context ★★★
  // 如果使用者直接進入 /journeys/ai-bdd，我們要強制把狀態更新為 ai-bdd
  useEffect(() => {
    const foundJourney = ALL_JOURNEYS.find(j => pathname.includes(j.slug));
    if (foundJourney) {
      setActiveSlugState(foundJourney.slug);
    }
  }, [pathname]);

  const activeJourney = JOURNEY_MAP[activeSlug] || ALL_JOURNEYS[0];

  return (
    <JourneyContext.Provider value={{ activeJourney, setActiveSlug: setActiveSlugState }}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}