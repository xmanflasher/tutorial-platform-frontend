import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api-config';

interface RequestOptions extends RequestInit {
  // 選項：是否要安靜模式 (不跳錯誤視窗)
  silent?: boolean;
  // 內部標記：是否為重試請求
  _isRetry?: boolean;
  // 請求超時時間 (ms)
  timeout?: number;
}

/**
 * 核心 API 請求函數 (整合 Sonner)
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // 1. 處理網址
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // 2. 自動取得 Token (增加判斷，避免抓到 "null" 或 "undefined" 字串)
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const hasToken = token && token !== 'null' && token !== 'undefined' && token.length > 5;

  // 3. 設定預設 Headers
  const headers = {
    'Content-Type': 'application/json',
    ...(hasToken && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const method = options.method || 'GET';
    const requestId = Math.random().toString(36).substring(7);
    const controller = new AbortController();
    const id = options.timeout ? setTimeout(() => controller.abort(), options.timeout) : null;

    // 安全地紀錄日誌，避免 parse 失敗
    let bodyLog = '';
    if (options.body) {
        try {
            bodyLog = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        } catch (e) {
            bodyLog = '[Unparseable Body]';
        }
    }
    console.log(`[API Request][${requestId}] Starting ${method} ${endpoint}`, bodyLog);

    const response = await fetch(url, {
      ...options,
      method,
      signal: options.timeout ? controller.signal : options.signal,
      headers,
      credentials: 'include', // ★ 重要：允許發送 Cookie (Session)
    });
    if (id) clearTimeout(id);

    // 4. 統一錯誤處理 (Interceptor)
    if (!response.ok) {
      console.warn(`[API Error Response] ${response.status} ${endpoint}`);
      // 處理 401 (Token 過期/未登入/Session 失效)
      if (response.status === 401) {
        // 如果原本有送 Token 卻失敗了，嘗試清除 Token 並重試一次
        if (hasToken && !options._isRetry) {
          console.warn(`[API 401] Token 驗證失敗，嘗試清除並重試一次: ${endpoint}`);
          localStorage.removeItem('accessToken');
          return await apiRequest<T>(endpoint, { ...options, _isRetry: true });
        }
        
        if (options._isRetry) {
          console.error(`[API 401] Retry also failed for ${endpoint}. Stack Trace:`);
          console.trace();
        }

        if (typeof window !== 'undefined') {
          // 只在「原本有 Token 但伺服器不收」的情況下徹底清除
          if (hasToken) {
            localStorage.removeItem('accessToken');
          }

          // 如果不是靜默請求且非重試失敗，則跳出提示
          if (!options.silent) {
            window.dispatchEvent(new CustomEvent('api-unauthorized', { detail: { message: '登入已過期或未授權，請重新登入' } }));
          }
        }
        
        // 若為靜默判斷 (例如檢查 Session)，直接平滑回傳 null，避免紅字 Error 噴在頁面上
        if (options.silent) {
          return null as unknown as T;
        }
        throw new Error('Unauthorized');
      }

      // 處理 403 (沒有權限)
      if (response.status === 403) {
        toast.error('權限不足', {
          description: '您沒有權限執行此操作'
        });
      }

      // 處理 429 (速率限制)
      if (response.status === 429) {
        console.error(`[API 429] Rate limit exceeded for ${endpoint}. Stack Trace:`);
        console.trace();
        if (typeof window !== 'undefined' && !options.silent) {
          toast.warning('操作太快囉！', {
            description: '請稍等幾秒再繼續冒險。',
            duration: 5000,
          });
        }
        throw new Error('RATE_LIMIT_EXCEEDED');
      }

      // 處理 500 (後端炸裂)
      if (response.status >= 500) {
        if (typeof window !== 'undefined') {
          toast.error('伺服器錯誤', {
            description: '系統發生問題，請稍後再試'
          });
        }
      }

      // 其他 API 錯誤 (忽略 401/403 因為上面處理過了)
      if (!options.silent && response.status !== 401 && response.status !== 403 && response.status < 500) {
        if (typeof window !== 'undefined') {
          toast.error(`請求失敗 (${response.status})`);
        }
      }

      throw new Error(`API Error: ${response.status}`);
    }

    // 5. 解析回應資料 (處理 204 No Content 或空內容)
    if (response.status === 204) return null as T;

    const text = await response.text();
    if (!text) return null as T;
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('解析 JSON 失敗!', {
        error: e,
        endpoint,
        rawText: text.length > 500 ? text.substring(0, 500) + '...' : text
      });
      return text as unknown as T;
    }

  } catch (error: any) {
    // Timeout 處理
    if (error.name === 'AbortError') {
      console.warn(`[API] 請求超時 (${options.timeout}ms): ${endpoint}`);
      if (!options.silent && typeof window !== 'undefined') {
        toast.error('伺服器連線超時', { description: '正在切換至離線模式...' });
      }
      throw new Error(`Timeout: ${endpoint}`);
    }

    // 網路斷線或其他 fetch 錯誤
    if (!options.silent) {
      // 避免在 401 已經拋出錯誤後重複跳 toast
      if (error instanceof Error && error.message === 'Unauthorized') {
        // 401 已經在上面處理過報錯了
      } else {
        console.error('API Request Failed:', error);
        toast.error('連線失敗', {
          description: '請檢查您的網路連線或聯繫管理員'
        });
      }
    }
    throw error;
  }
}