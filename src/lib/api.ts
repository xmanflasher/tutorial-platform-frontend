// src/lib/api.ts
import { toast } from 'sonner';

// 定義後端基礎網址
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  // 選項：是否要安靜模式 (不跳錯誤視窗)
  silent?: boolean;
}

/**
 * 核心 API 請求函數 (整合 Sonner)
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // 1. 處理網址
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // 2. 自動取得 Token (假設存在 localStorage)
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // 3. 設定預設 Headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 4. 統一錯誤處理 (Interceptor)
    if (!response.ok) {
      // 處理 401 (Token 過期/未登入)
      if (response.status === 401) {
        console.error('登入過期');
        if (typeof window !== 'undefined') {
          // 防止重複跳出多個 401 提示，可以加個簡單的檢查或直接跳轉
          localStorage.removeItem('accessToken');

          // 使用 Sonner 的 error 樣式
          toast.error('登入已過期，請重新登入');

          // 延遲一下再跳轉，讓使用者看得到訊息 (可選)
          setTimeout(() => {
            // window.location.href = '/login'; 
          }, 1000);
        }
        throw new Error('Unauthorized');
      }

      // 處理 403 (沒有權限)
      if (response.status === 403) {
        toast.error('權限不足', {
          description: '您沒有權限執行此操作'
        });
      }

      // 處理 500 (後端炸裂)
      if (response.status >= 500) {
        toast.error('伺服器錯誤', {
          description: '系統發生問題，請稍後再試'
        });
      }

      // 其他 API 錯誤
      if (!options.silent && response.status !== 401 && response.status !== 403 && response.status < 500) {
        toast.error(`請求失敗 (${response.status})`);
      }

      throw new Error(`API Error: ${response.status}`);
    }

    // 5. 解析回應資料 (處理 204 No Content)
    if (response.status === 204) return null as T;

    return await response.json();

  } catch (error) {
    // 網路斷線或其他 fetch 錯誤
    if (!options.silent) {
      console.error('API Request Failed:', error);
      // 避免在 401 已經拋出錯誤後重複跳 toast
      if (error instanceof Error && error.message !== 'Unauthorized') {
        toast.error('連線失敗', {
          description: '請檢查您的網路連線或聯繫管理員'
        });
      }
    }
    throw error;
  }
}