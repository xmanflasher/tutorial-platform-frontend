'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/api';
import { getVisitorId } from '@/lib/visitorUtils'; // ★ 新增
import { orderService } from '@/services/orderService'; // ★ 新增

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
  githubUrl?: string;
  discordId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisitorId();

    const checkSession = async () => {
      if (typeof window === 'undefined') return;

      // 1. 從 URL 捕捉 Token (OAuth2 或 Dev Login 重定向)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (urlToken) {
        console.log("從 URL 捕捉到 Token");
        localStorage.setItem('accessToken', urlToken);
        // 清理 URL
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      // 2. 取得當前有效的 Token
      const token = localStorage.getItem('accessToken');
      const hasToken = token && token !== 'null' && token !== 'undefined' && token.length > 10;

      if (hasToken) {
        try {
          // 嘗試同步後端資料
          const dbUser = await apiRequest<User>('/me', { silent: true });
          if (dbUser) {
            setUser(dbUser);
            localStorage.setItem('waterball_user', JSON.stringify(dbUser));
            // ★ 新增：同步訂單以更新首頁擁有狀態
            orderService.getUserOrders(dbUser.id);
          } else {
            // Token 無效，徹底清除
            console.warn("Token 無效，清除身分");
            logoutLocal();
          }
        } catch (error) {
          console.error("同步使用者資料失敗:", error);
          logoutLocal();
        }
      } else {
        // 完全沒有 Token，確保狀態為登出
        logoutLocal();
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // 輔助函式：僅清除本地狀態而不調用後端登出
  const logoutLocal = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('waterball_user');
    setUser(null);
  };

  const login = (userData: User, token?: string) => {
    setUser(userData);
    localStorage.setItem('waterball_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    // ★ 新增：登入成功後立刻同步訂單
    orderService.getUserOrders(userData.id);
  };

  const logout = async () => {
    try {
      // 1. 呼叫後端專屬登出接口 (手動失效 Session)
      // 注意：apiRequest 的 BASE_URL 是 http://localhost:8080/api
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const logoutUrl = baseUrl.endsWith('/api') ? `${baseUrl}/auth/logout` : `${baseUrl}/api/auth/logout`;

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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}