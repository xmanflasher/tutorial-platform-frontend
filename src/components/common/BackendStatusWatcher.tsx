'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, RefreshCw, Loader2, Clock } from 'lucide-react';
import { USE_MOCK_DATA, API_BASE_URL } from '@/lib/api-config';

export type BackendStatus = 'online' | 'starting' | 'offline';

export default function BackendStatusWatcher() {
  const [status, setStatus] = useState<BackendStatus>('online');
  const [countdown, setCountdown] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isLocal = mounted && typeof window !== 'undefined' && 
                 (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  useEffect(() => {
    setMounted(true);
    if (USE_MOCK_DATA) {
        setStatus('online');
        return;
    }

    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutDuration = isLocal ? 1500 : 5000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

        const healthUrl = `${API_BASE_URL}/health`;

        const res = await fetch(healthUrl, { 
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          setStatus('online');
          // 綠燈時：正式環境設定 30 分鐘休眠倒數；本地環境 0 即可
          setCountdown(isLocal ? 0 : 1800); 
        } else {
          triggerOffline();
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          triggerStarting();
        } else {
          triggerOffline();
        }
      }
    };

    const triggerStarting = () => {
        setStatus('starting');
        setCountdown(60); 
    };

    const triggerOffline = () => {
        setStatus('offline');
        setCountdown(30); 
    };

    checkHealth();
    
    // 每 30 秒後台同步一次狀態 (也會重置 Online 的 30 分鐘倒數)
    const interval = setInterval(checkHealth, 30000); 
    return () => {
        clearInterval(interval);
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [retryCount, isLocal]);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
           if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              // 只有在非 Online 狀態下，倒數完才自動重試
              if (status !== 'online') {
                  setRetryCount(c => c + 1);
              }
              return 0;
           }
           return prev - 1;
        });
      }, 1000);
      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  }, [countdown, status]);

  const handleManualRetry = () => {
    setStatus('starting');
    setCountdown(0);
    setRetryCount(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // SSR 佔位符，避免 Hydration Mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-ui text-[10px] md:text-xs font-medium bg-black/20 backdrop-blur-sm text-emerald-500">
        <div className="w-2 h-2 rounded-full bg-current" />
        <span>後端在線...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-ui text-[10px] md:text-xs font-medium transition-all group animate-in fade-in slide-in-from-right-4 bg-black/20 backdrop-blur-sm">
      
      {/* 🟢 Online 狀態 (常駐顯示) */}
      {status === 'online' && (
        <div className={`flex items-center gap-2 ${USE_MOCK_DATA ? 'text-blue-400' : 'text-emerald-500'}`}>
          <div className={`w-2 h-2 rounded-full bg-current ${status === 'online' ? 'animate-pulse' : ''}`} />
          {USE_MOCK_DATA ? (
            <span>展示模式 (Mock)</span>
          ) : (
            <span className="flex items-center gap-1">
              後端在線 {isLocal ? '(Local)' : countdown > 0 ? `(${formatTime(countdown)} 後休眠)` : ''}
            </span>
          )}
        </div>
      )}
      
      {/* 🟡 Starting 狀態 */}
      {status === 'starting' && (
        <div className="flex items-center gap-2 text-amber-500">
          <Loader2 size={14} className="animate-spin" />
          <span className="font-bold">喚醒中 {countdown > 0 ? `${countdown}s` : '...'}</span>
        </div>
      )}

      {/* 🔴 Offline 狀態 */}
      {status === 'offline' && (
        <div className="flex items-center gap-2 text-red-500">
          <WifiOff size={14} />
          <span className="font-bold">連線失敗 {countdown > 0 ? `(${countdown}s)` : ''}</span>
          <button 
            onClick={handleManualRetry}
            className="ml-1 px-2 py-0.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-500 rounded transition-colors flex items-center gap-1"
          >
            <RefreshCw size={10} />
            重試
          </button>
        </div>
      )}
    </div>
  );
}
