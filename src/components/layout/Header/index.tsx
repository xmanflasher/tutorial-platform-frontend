'use client';

import Link from 'next/link';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import UserMenu from './UserMenu';
import { useAuth } from '@/context/AuthContext';
import { Map, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  onLoginClick?: () => void; // ★ 新增：接收開啟 Modal 的函式
}

export default function Header({ onMenuClick, onLoginClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-40 relative">
      
      {/* 左側 */}
      <div className="flex items-center gap-4">
        <MobileNav onMenuClick={onMenuClick} />
        <DesktopNav />
      </div>

      {/* 右側 */}
      <div className="flex items-center gap-4">
        {user ? (
          // === 已登入 (顯示挑戰、鈴鐺、頭像) ===
          <>
            <Link 
              href="/challenges"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-bold rounded transition-colors"
            >
              <Map size={18} />
              <span>前往挑戰</span>
            </Link>

            <button className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors relative border border-yellow-400/30 rounded-full hover:bg-yellow-400/10">
              <Bell size={20} />
              {/* 未讀紅點 */}
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111827]"></span>
            </button>

            <UserMenu />
          </>
        ) : (
          // === 未登入 (顯示登入按鈕) ===
          <button 
            onClick={onLoginClick} // ★ 觸發外部傳入的開啟 Modal 函式
            className="flex items-center justify-center px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded transition-colors shadow-sm"
          >
            登入
          </button>
        )}
      </div>
    </header>
  );
}