'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { JOURNEY_MAP, ALL_JOURNEYS } from '@/mock';
import { JourneyDetail } from '@/types';

interface JourneyContextType {
  activeJourney: JourneyDetail;
  setActiveSlug: (slug: string) => void;
  setJourneyData: (data: JourneyDetail) => void; // ★ 新增這個方法
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 1. 手動設定的 slug (備案)
  const [manualSlug, setManualSlug] = useState<string>(ALL_JOURNEYS[0].slug);

  // 2. ★ 新增狀態：用來存 API 撈回來的真資料
  const [apiJourneyData, setApiJourneyData] = useState<JourneyDetail | null>(null);

  // 3. 判斷 URL 是否匹配某個 Mock Journey (用來當預設值或 fallback)
  const urlMockJourney = ALL_JOURNEYS.find(j => pathname.includes(j.slug));

  // 4. ★★★ 核心邏輯修改 ★★★
  // 優先順序：
  // (1) 如果 API 有資料，且 slug 跟當前 URL 符合 -> 用 API 真資料
  // (2) 如果 URL 有對應 Mock -> 用 Mock
  // (3) 用手動設定的 -> 用 Mock
  let activeJourney: JourneyDetail;

  if (apiJourneyData && pathname.includes(apiJourneyData.slug)) {
    // 優先使用 API 資料 (這裡面才有正確的 menus)
    activeJourney = apiJourneyData;
  } else if (urlMockJourney) {
    // 退回 Mock (還沒撈到 API 時先顯示 Mock)
    activeJourney = JOURNEY_MAP[urlMockJourney.slug];
  } else {
    // 最後防線
    activeJourney = JOURNEY_MAP[manualSlug] || ALL_JOURNEYS[0];
  }

  return (
    <JourneyContext.Provider
      value={{
        activeJourney,
        setActiveSlug: setManualSlug,
        setJourneyData: setApiJourneyData // 開放這個接口給外部使用
      }}
    >
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