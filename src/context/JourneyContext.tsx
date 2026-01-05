'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { JOURNEY_MAP, ALL_JOURNEYS } from '@/mock';
import { JourneyDetail } from '@/types';

interface JourneyContextType {
  activeJourney: JourneyDetail;
  setActiveSlug: (slug: string) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 1. 這是「手動」設定的 slug 狀態 (當 URL 沒有對應 journey 時使用的備案)
  const [manualSlug, setManualSlug] = useState<string>(ALL_JOURNEYS[0].slug);

  // 2. ★★★ 修正邏輯：Derived State (衍生狀態) ★★★
  // 直接從 URL 計算當前是否匹配某個 Journey，不需要 useEffect
  const urlJourney = ALL_JOURNEYS.find(j => pathname.includes(j.slug));

  // 3. 決定誰是老大：
  // 如果 URL 裡有對應的 Journey，URL 優先權最高 (Single Source of Truth)
  // 如果 URL 裡沒有 (例如在首頁)，則退回使用手動設定的 manualSlug
  const activeSlug = urlJourney ? urlJourney.slug : manualSlug;

  // 4. 根據最終的 slug 取得詳細資料
  const activeJourney = JOURNEY_MAP[activeSlug] || ALL_JOURNEYS[0];

  return (
    <JourneyContext.Provider
      value={{
        activeJourney,
        setActiveSlug: setManualSlug // 這裡只更新內部狀態
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