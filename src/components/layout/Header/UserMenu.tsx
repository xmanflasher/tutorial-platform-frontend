'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// 修正 import：只引入需要的 Icon，並重新命名 User 避免與型別衝突
import { LogOut, Moon, User as UserIcon, Users, Link2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  // 計算經驗值百分比 (避免超過 100%)
  const exp = user.exp || 0;
  const nextLevelExp = user.nextLevelExp || 100;
  const expPercentage = Math.min((exp / nextLevelExp) * 100, 100);

  const displayAvatar = user.avatar || user.pictureUrl;

  return (
    <div className="relative" ref={menuRef}>
      {/* 1. 頭像按鈕 (點擊切換選單) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-border-ui hover:border-slate-500 transition-colors focus:outline-none focus:border-slate-400"
      >
        {displayAvatar ? (
          <img src={displayAvatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* 2. 下拉選單 (Dropdown) */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border-ui rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">

          {/* 使用者資訊與等級區 */}
          <div className="p-4 border-b border-border-ui">
            <h3 className="text-white font-bold text-lg mb-2 truncate">{user.name}</h3>

            <div className="flex justify-between text-sm font-bold text-slate-200 mb-1">
              <span>Lv. {user.level}</span>
              <span className="text-slate-400">({exp}/{nextLevelExp})</span>
            </div>

            {/* 進度條 */}
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          {/* 選單選項 */}
          <div className="p-2 space-y-1">
            <Link
              href="/users/me/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors"
            >
              <UserIcon size={18} />
              <span>個人檔案</span>
            </Link>

            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors text-left"
            >
              {theme === 'quetzalcoatl' ? <Sparkles size={18} className="text-emerald-400" /> : <Moon size={18} />}
              <span>{theme === 'quetzalcoatl' ? '神話主題 (Σ)' : '深色冒險 (遺產)'}</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors text-left">
              <Users size={18} />
              <span>邀請好友</span>
            </button>

            {(user.role === 'ROLE_INSTRUCTOR' || user.role === 'ROLE_ADMIN') && (
              <>
                <div className="my-1 border-t border-border-ui/50" />
                <Link
                  href="/users/me/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Users size={18} />
                  <span className="font-bold">🧑‍🏫 講師管理中心</span>
                </Link>
                <Link
                  href={`/instructors/${user.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors"
                >
                  <Link2 size={18} />
                  <span>查看公開主頁</span>
                </Link>
              </>
            )}

            <div className="my-1 border-t border-border-ui/50" />

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors text-left"
            >
              <LogOut size={18} />
              <span>登出</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}