'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const MIN_TIME = 1000; // 1秒最少顯示時間

  const startLoading = useCallback(() => {
    // 如果有正在等待的停止計時器，先清除
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (!startTimeRef.current) {
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_TIME - elapsed);

    if (remaining > 0) {
      // 避免重複設定計時器
      if (timerRef.current) return;

      timerRef.current = setTimeout(() => {
        setIsLoading(false);
        startTimeRef.current = null;
        timerRef.current = null;
      }, remaining);
    } else {
      setIsLoading(false);
      startTimeRef.current = null;
    }
  }, []);

  // 當路徑改變時，也要遵守最少顯示時間邏輯
  useEffect(() => {
    if (isLoading) {
      stopLoading();
    }
  }, [pathname, isLoading, stopLoading]);

  // 修改後的 setIsLoading 包裝，確保行為一致
  const handleSetIsLoading = useCallback((val: boolean) => {
    if (val) startLoading();
    else stopLoading();
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading: handleSetIsLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
