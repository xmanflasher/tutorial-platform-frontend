'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Trophy, Layers, Map, BookOpen, Sparkles, X } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext'; // ★ 1. 引入 Context

// 主選單 (固定不變)
const MAIN_MENU = [
  { name: '首頁', href: '/', icon: Home },
  { name: '課程', href: '/courses', icon: LayoutGrid },
  { name: '排行榜', href: '/leaderboard', icon: Trophy },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = '', onClose }: SidebarProps) {
  const pathname = usePathname();
  // ★ 2. 從 Context 取得當前激活的旅程資訊
  const { activeJourney } = useJourney(); 

  // ★ 3. 判斷要顯示哪個選單
  // 邏輯：這裡直接使用 Context 的 activeJourney.slug 即可
  // 因為 Context 已經在 useEffect 裡處理過「如果是 /journeys/ai-bdd 網址，就自動切換狀態」的邏輯了
  const isAiBdd = activeJourney.slug === 'ai-bdd';

  // 定義次要選單內容
  const secondaryMenu = isAiBdd 
    ? [
        { name: '所有單元', href: '/journeys/ai-bdd', icon: Layers },
        { name: 'Prompt 寶典', href: '/journeys/ai-bdd/prompts', icon: Sparkles },
      ]
    : [
        { name: '所有單元', href: '/journeys/software-design-pattern', icon: Layers },
        { name: '挑戰地圖', href: '/challenges', icon: Map },
        { name: 'SOP 寶典', href: '/sop', icon: BookOpen },
      ];

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    // 這裡判斷 active 狀態
    return pathname === href || pathname.startsWith(href + '/');
  };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = isActiveLink(item.href);
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
          isActive
            ? 'bg-yellow-400 text-slate-900 shadow-md font-bold'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <item.icon size={20} />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className={`bg-[#0d0e11] border-r border-slate-800 flex flex-col flex-shrink-0 transition-all ${className}`}>
      {/* ... Logo 區塊 (保持不變) ... */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 md:border-none shrink-0">
         {/* Logo HTML ... */}
         <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50">W</div>
          <div className="flex flex-col">
            <h1 className="text-white font-bold leading-none text-lg">水球軟體學院</h1>
            <span className="text-[10px] text-blue-400 tracking-wider">WATERBALLSA.TW</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
        <nav className="space-y-1">
          {MAIN_MENU.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        <div className="my-4 border-t border-slate-800 mx-2" />

        {/* ★ 4. 動態顯示標題 (跟隨 Context) */}
        <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {isAiBdd ? 'AI x BDD 旅程' : '設計模式旅程'}
        </div>
        <nav className="space-y-1">
          {secondaryMenu.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <p className="text-xs text-slate-600 text-center">© 2025 WaterballSA</p>
      </div>
    </aside>
  );
}