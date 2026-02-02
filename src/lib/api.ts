import { API_BASE_URL } from './api-config';

/**
 * 輕量化 Fetch 封裝
 * 自動處理 Token 注入與基礎路徑
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // 可以在這裡處理 401 (Token 過期) 跳轉登入頁
    if (response.status === 401) {
      console.error('登入過期，請重新登入');
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}