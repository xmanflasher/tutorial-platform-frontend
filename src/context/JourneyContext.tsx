"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
// ★ 1. 刪除 mock 引用：我們不再需要它了！
// import { ALL_JOURNEYS } from "@/mock"; 
import { useAuth } from "@/context/AuthContext";
import { JourneyDetail, Course } from "@/types";
import { createEmptyJourney } from "@/lib/factories";
import { homeService } from "@/services";
import { API_BASE_URL } from "@/lib/api-config";

interface JourneyContextType {
  activeJourney: JourneyDetail;
  allJourneys: Course[];
  setActiveSlug: (slug: string) => void;
  setJourneyData: (data: JourneyDetail) => void;
  fetchUserProgress: (slug: string) => Promise<void>;
  clearProgress: () => void;
  isLoading: boolean;
  isError: boolean;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);
const STORAGE_KEY = "waterballsa_last_journey_slug";
// 設定一個預設 slug，萬一 localStorage 沒資料且網址也沒 slug 時使用
const DEFAULT_SLUG = "software-design-pattern";

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [manualSlug, setManualSlug] = useState<string>(DEFAULT_SLUG);
  const [apiJourneyData, setApiJourneyData] = useState<JourneyDetail | null>(null);
  const [allJourneys, setAllJourneys] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const lastRequestedSlugRef = useRef<string>("");

  // ★ 2. 改成動態解析：不查表，直接拆解網址
  // 假設網址結構固定為： /journeys/[slug]/...
  // split('/') 後： ["", "journeys", "slug", ...]
  const pathSegments = pathname?.split("/") || [];
  const urlSlug = pathSegments[1] === "journeys" ? pathSegments[2] : undefined;

  useEffect(() => {
    // 取得所有對外開放的旅程，供 Header 等全域元件使用
    let isMounted = true;
    homeService.getFeaturedCourses().then(courses => {
      if (isMounted) {
        setAllJourneys(courses);
        // ★ 若當前網址沒有 slug 且正好是預設值，則自動跳到第一個可用的課程
        if (courses.length > 0 && !urlSlug && (manualSlug === DEFAULT_SLUG || !manualSlug)) {
           const firstSlug = courses[0].slug;
           setManualSlug(firstSlug);
           localStorage.setItem(STORAGE_KEY, firstSlug);
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // 如果網址沒有 slug，才去讀 localStorage
    if (!urlSlug) {
      const savedSlug = localStorage.getItem(STORAGE_KEY);
      // ★ 3. 移除驗證：只要有存就拿來用，對錯交給 API 判斷
      if (savedSlug) {
        setManualSlug(savedSlug);
      }
    }
  }, [urlSlug]);

  useEffect(() => {
    if (urlSlug && manualSlug !== urlSlug) {
      setManualSlug(urlSlug);
    }
  }, [urlSlug, manualSlug]);

  const targetSlug = urlSlug || manualSlug;

  const handleSetActiveSlug = (slug: string) => {
    setManualSlug(slug);
    localStorage.setItem(STORAGE_KEY, slug);
  };

  const fetchUserProgress = useCallback(async (slugToFetch: string) => {
    if (!slugToFetch || !user?.id) {
      setApiJourneyData(null);
      return;
    }

    lastRequestedSlugRef.current = slugToFetch;
    setIsLoading(true);
    setIsError(false);
    setApiJourneyData(null);

    const userId = user.id;

    try {
      const res = await fetch(
        `${API_BASE_URL}/journeys/${slugToFetch}/progress?userId=${userId}`
      );

      if (lastRequestedSlugRef.current !== slugToFetch) return;

      if (res.ok) {
        const data = await res.json();
        if (data.slug === slugToFetch) {
          setApiJourneyData(data);
        } else {
          console.error("Slug mismatch");
          setIsError(true);
        }
      } else {
        console.warn(`⚠️ API Fail: ${res.status}`);
        setIsError(true);
        setApiJourneyData(null);
      }
    } catch (error) {
      if (lastRequestedSlugRef.current === slugToFetch) {
        console.error("💥 Network Error", error);
        setIsError(true);
        setApiJourneyData(null);
      }
    } finally {
      if (lastRequestedSlugRef.current === slugToFetch) {
        setIsLoading(false);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (targetSlug && user?.id) {
      fetchUserProgress(targetSlug);
    } else if (!user?.id) {
      setApiJourneyData(null);
    }
  }, [targetSlug, fetchUserProgress, user?.id]);

  const clearProgress = useCallback(() => {
    setApiJourneyData(null);
  }, []);

  // --- 決定 activeJourney ---
  let activeJourney: JourneyDetail;

  const isMatch = apiJourneyData?.slug?.trim() === targetSlug?.trim();

  if (apiJourneyData && isMatch) {
    activeJourney = apiJourneyData;
  }
  else if (isLoading) {
    activeJourney = createEmptyJourney(targetSlug, "載入中...");
  }
  else {
    // 錯誤狀態：無論是 slug 不存在 (404) 還是網路錯，都顯示錯誤
    // ★ 優化：若 api 無資料，嘗試從 allJourneys 找回課程名稱，避免顯示「暫無資料」
    const courseInList = allJourneys.find(c => c.slug === targetSlug);
    const fallbackTitle = courseInList ? courseInList.title : (isError ? "無法載入旅程" : "暫無資料");
    const errorDesc = isError ? "找不到此旅程或網路異常" : "";

    activeJourney = createEmptyJourney(targetSlug, fallbackTitle, errorDesc);
  }

  return (
    <JourneyContext.Provider
      value={{
        activeJourney,
        allJourneys,
        setActiveSlug: handleSetActiveSlug,
        setJourneyData: setApiJourneyData,
        fetchUserProgress: () => fetchUserProgress(targetSlug),
        clearProgress,
        isLoading,
        isError,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("useJourney must be used within a JourneyProvider");
  return context;
}

// Helper: 產生一個安全的空物件，避免 UI 存取 undefined 報錯
