'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { apiRequest } from '@/lib/api';
import { getVisitorId } from '@/lib/visitorUtils'; // ★ 新增
import { orderService } from '@/services/orderService'; // ★ 新增
import { MOCK_USER } from '@/mock';

export interface User {
// ... (rest of the interface)
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  pictureUrl?: string; // 加入後端可能傳回的欄位
  level: number;
  exp: number;
  nextLevelExp: number;
  nickName?: string;
  region?: string;
  jobTitle?: string;
  githubUrl?: string;
  discordId?: string;
  role?: string;
  instructorBio?: string;
  socialLinks?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // [Perf] 防止 checkSession 期間重複觸發訂單同步
  const ordersFetchedRef = useRef(false);
  // 防止重複發起 Session 檢查
  const isCheckingRef = useRef(false);

  useEffect(() => {
    getVisitorId();

    const checkSession = async () => {
      if (typeof window === 'undefined') return;

      // 1. 從 URL 捕捉 Token (OAuth2 或 Dev Login 重定向)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (urlToken) {
        console.log("[AuthContext] 從 URL 捕捉到 Token");
        localStorage.setItem('accessToken', urlToken);
        // 清理 URL
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // 觸發登入成功通知
        window.dispatchEvent(new CustomEvent('app-notification', { 
          detail: { message: '歡迎回來！登入成功', type: 'success' } 
        }));
      }

      // 檢查登入錯誤 (OAuth2 失敗)
      const urlError = urlParams.get('error');
      const urlMessage = urlParams.get('message');
      if (urlError) {
        window.dispatchEvent(new CustomEvent('app-notification', { 
           detail: { 
             message: '第三方登入失敗', 
             type: 'error',
             description: urlMessage || '這可能是系統環境尚未就緒 (遺漏 Client Secret) 或您取消了授權。'
           } 
        }));
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      if (isCheckingRef.current) return;
      isCheckingRef.current = true;
      console.log("[AuthContext] 🏁 開始 Session 同步檢查...");
      
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.info("[AuthContext] 訪客模式 (No Token)");
          setLoading(false);
          isCheckingRef.current = false;
          return;
        }

        const dbUser = await apiRequest<User>('/me', { silent: true });
        if (dbUser) {
          console.log("[AuthContext] 使用者認證成功:", dbUser.email);
          setUser(dbUser);
          
          if (!ordersFetchedRef.current) {
            console.log("[AuthContext] 發起初始訂單同步...");
            orderService.getUserOrders(dbUser.id);
            ordersFetchedRef.current = true;
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
          console.info("[AuthContext] 👣 訪客瀏覽模式 (未登入)");
        } else {
          console.warn("[AuthContext] 同步狀態異常:", error);
        }
        logoutLocal();
      } finally {
        setLoading(false);
        isCheckingRef.current = false;
      }
    };

    // 監聽 API 401 事件
    const handleUnauthorized = (e: any) => {
      const msg = e.detail?.message || '登入過期，請重新登入';
      window.dispatchEvent(new CustomEvent('app-notification', { 
        detail: { message: msg, type: 'error' } 
      }));
      logoutLocal();
    };

    window.addEventListener('api-unauthorized', handleUnauthorized);
    checkSession();

    return () => {
      window.removeEventListener('api-unauthorized', handleUnauthorized);
    };
  }, []);

  // 輔助函式：僅清除本地狀態而不調用後端登出
  const logoutLocal = () => {
    console.warn('[AuthContext] logoutLocal called. Clearing token and user state.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('waterball_user');
    ordersFetchedRef.current = false;
    setUser(null);
  };

  const login = (userData: User, token?: string) => {
    console.log('[AuthContext] login called for:', userData.name);
    setUser(userData);
    localStorage.setItem('waterball_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    // ★ 新增：登入成功後立刻同步訂單
    if (!ordersFetchedRef.current) {
      orderService.getUserOrders(userData.id);
      ordersFetchedRef.current = true;
    }
  };

  const logout = async () => {
    try {
      // 1. 呼叫後端專屬登出接口 (手動失效 Session)
      const { API_BASE_URL } = require('@/lib/api-config');
      const logoutUrl = `${API_BASE_URL}/auth/logout`;

      await fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error("後端登出失敗", error);
    }

    // 2. 徹底清空所有前端儲存空間
    setUser(null);
    localStorage.clear();

    // 3. 強制跳轉至首頁並重整
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const refreshUser = async () => {
    try {
      const dbUser = await apiRequest<User>('/me', { silent: true });
      if (dbUser) {
        setUser(dbUser);
        localStorage.setItem('waterball_user', JSON.stringify(dbUser));
      }
    } catch (error) {
      console.warn("Refresh user failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    if (typeof window === 'undefined') {
      return { user: null, loading: true, login: () => {}, logout: () => {}, refreshUser: async () => {} } as AuthContextType;
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}