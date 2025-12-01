'use client';

import Link from 'next/link';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
      
      {/* 左側群組：手機版選單按鈕 + 桌機版旅程切換 */}
      <div className="flex items-center gap-4">
        <MobileNav onMenuClick={onMenuClick} />
        <DesktopNav />
      </div>

      {/* 右側群組：登入按鈕 (共用) */}
      <div>
        <Link 
          href="/login" 
          className="flex items-center justify-center px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded transition-colors shadow-sm"
        >
          登入
        </Link>
      </div>

    </header>
  );
}