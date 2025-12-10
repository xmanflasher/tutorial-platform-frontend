'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  currentExp: number;
  maxExp: number;
}

interface AuthContextType {
  user: User | null;
  // ★ 修正重點：這裡要定義成接收 User 物件
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('waterball_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("解析使用者資料失敗", e);
        localStorage.removeItem('waterball_user');
      }
    }
  }, []);

  // ★ 修正重點：實作也要接收參數
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('waterball_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('waterball_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}