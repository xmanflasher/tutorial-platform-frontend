'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/api';
import { getVisitorId } from '@/lib/visitorUtils'; // ★ 新增

export interface User {
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
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ★ 1. 初始化 訪客 ID (確保 Cookie 已設定)
    getVisitorId();

    const checkSession = async () => {
      const storedUser = localStorage.getItem('waterball_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);

          if (!parsed.avatar) {
            const remoteUser = await apiRequest<User>('/me');
            if (remoteUser && remoteUser.avatar) {
              setUser(remoteUser);
              localStorage.setItem('waterball_user', JSON.stringify(remoteUser));
            }
          }
        } catch (e) {
          console.error("解析使用者資料失敗", e);
          localStorage.removeItem('waterball_user');
        }
      } else {
        try {
          const remoteUser = await apiRequest<User>('/me', { silent: true });
          if (remoteUser) {
            setUser(remoteUser);
            localStorage.setItem('waterball_user', JSON.stringify(remoteUser));
          }
        } catch (error) {
          console.log("未在伺服器找到現有 Session");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('waterball_user', JSON.stringify(userData));
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