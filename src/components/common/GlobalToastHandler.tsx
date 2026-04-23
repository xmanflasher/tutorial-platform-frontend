'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * 全域事件監聽器，將自定義事件轉換為 Sonner Toast 通知。
 * 這解決了在 API/Context 邏輯層使用動態導入 sonner 可能導致的 Turbopack HMR 迴圈。
 */
export default function GlobalToastHandler() {
  useEffect(() => {
    // 監聽一般的通知事件
    const handleNotification = (e: any) => {
      const { message, type = 'info', description } = e.detail || {};
      
      switch (type) {
        case 'success':
          toast.success(message, { description });
          break;
        case 'error':
          toast.error(message, { description });
          break;
        case 'warning':
          toast.warning(message, { description });
          break;
        default:
          toast(message, { description });
      }
    };

    // 監聽 API 授權失敗事件
    const handleUnauthorized = (e: any) => {
      const { message } = e.detail || {};
      toast.error('連線逾時', { 
        description: message || '登入過期或權限不足，請重新登入' 
      });
    };

    window.addEventListener('app-notification', handleNotification as EventListener);
    window.addEventListener('api-unauthorized', handleUnauthorized as EventListener);

    return () => {
      window.removeEventListener('app-notification', handleNotification as EventListener);
      window.removeEventListener('api-unauthorized', handleUnauthorized as EventListener);
    };
  }, []);

  return null; // 此組件僅用於監聽事件，不渲染任何內容
}
