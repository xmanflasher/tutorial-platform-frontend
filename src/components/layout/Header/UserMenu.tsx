'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// 修正 import：只引入需要的 Icon，並重新命名 User 避免與型別衝突
import { LogOut, Moon, User as UserIcon, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
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
  const expPercentage = Math.min((user.currentExp / user.maxExp) * 100, 100);

  return (
    <div className="relative" ref={menuRef}>
      {/* 1. 頭像按鈕 (點擊切換選單) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 hover:border-slate-500 transition-colors focus:outline-none focus:border-slate-400"
      >
        {user.avatar ? (
          /* 建議使用 next/image，這裡依您提供的 img 標籤實作 */
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* 2. 下拉選單 (Dropdown) */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-[#1e232e] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">

          {/* 使用者資訊與等級區 */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-bold text-lg mb-2 truncate">{user.name}</h3>

            <div className="flex justify-between text-sm font-bold text-slate-200 mb-1">
              <span>Lv. {user.level}</span>
              <span className="text-slate-400">({user.currentExp}/{user.maxExp})</span>
            </div>

            {/* 進度條 */}
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
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

            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors text-left">
              <Moon size={18} />
              <span>切換主題</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors text-left">
              <Users size={18} />
              <span>邀請好友</span>
            </button>

            <div className="my-1 border-t border-slate-700/50" />

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