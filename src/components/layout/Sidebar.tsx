"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useJourney } from "@/context/JourneyContext";
import {
  Home,         // 首頁
  LayoutGrid,   // 課程
  Trophy,       // 排行榜
  User,         // 個人檔案
  Gift,         // 獎勵任務
  ScrollText,   // 挑戰歷程
  Layers,
  Map,
  BookOpen,
  Sparkles,
  CircleHelp,
  type LucideIcon,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// 定義圖示對應表
const ICON_MAP: Record<string, LucideIcon> = {
  "layers": Layers,
  "map": Map,
  "book-open": BookOpen,
  "sparkles": Sparkles,
  "gift": Gift,         // ★ 新增：對應資料庫的 'gift'
  "scroll-text": ScrollText, // 預備用
  "default": CircleHelp
};

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = "", onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { activeJourney } = useJourney(); // ★ 直接從 Context 取得 activeJourney
  const currentJourneySlug = activeJourney?.slug || "software-design-pattern";
  const missionsLink = `/journeys/${currentJourneySlug}/missions`;
  return (
    <aside className={`border-r border-gray-800 bg-[#0d0e11] text-white flex flex-col ${className}`}>

      {/* Logo 區域 */}
      <div className="p-6 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-wider">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[url('/logo.png')] bg-cover" />
            {!user && <span className="text-[10px] text-white">WB</span>}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-gray-200">水球軟體學院</span>
            <span className="text-[10px] text-blue-300 font-bold">WATERBALLSA.TW</span>
          </div>
        </Link>

        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-2 space-y-4 overflow-y-auto custom-scrollbar">

        {/* 區塊一：核心導覽 */}
        <div className="space-y-1">
          <NavItem href="/" icon={Home} label="首頁" active={pathname === "/"} onClick={onClose} />
          <NavItem href="/courses" icon={LayoutGrid} label="課程" active={pathname === "/courses"} onClick={onClose} />
          {user && (
            <NavItem
              href="/users/me/profile"
              icon={User}
              label="個人檔案"
              active={pathname === "/users/me/profile"}
              onClick={onClose}
            />
          )}
        </div>

        <div className="h-px bg-gray-800 mx-2" />

        {/* 區塊二：成就與紀錄 (★ 修改：移除寫死的 journey 特定連結) */}
        <div className="space-y-1">
          <NavItem href="/leaderboard" icon={Trophy} label="排行榜" active={pathname === "/leaderboard"} onClick={onClose} />

          {user && (
            <>
              {/* ★★★ 移除這裡原本寫死的 "獎勵任務" (Gift) ★★★ */}
              {/* 因為獎勵任務現在已經在資料庫的 journey.menus 裡了，會在區塊三顯示 */}
              <NavItem
                href={missionsLink} // 使用上面計算好的動態連結
                icon={Gift}
                label="獎勵任務"
                active={pathname === missionsLink}
                onClick={onClose}
              />
              <NavItem
                href="/users/me/portfolio"
                icon={ScrollText}
                label="挑戰歷程" // 這是全站通用的，可以保留，或者也依需求移入 DB
                active={pathname === "/users/me/portfolio"}
                onClick={onClose}
              />
            </>
          )}
        </div>

        {/* 區塊三：旅程選單 (★ 這裡會自動渲染資料庫設定好的項目) */}
        {activeJourney && activeJourney.menus && activeJourney.menus.length > 0 && (
          <>
            <div className="h-px bg-gray-800 mx-2" />
            <div className="space-y-1">
              {activeJourney.menus.map((menu, index) => {
                const IconComponent = ICON_MAP[menu.icon] || ICON_MAP["default"];
                const isActive = pathname === menu.href;

                return (
                  <Link
                    key={`${menu.href}-${index}`}
                    href={menu.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-medium ${isActive
                      ? "bg-yellow-400 text-black font-bold shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

      </nav>

      <div className="p-4"></div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label, active, onClick }: { href: string, icon: LucideIcon, label: string, active: boolean, onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-medium ${active
        ? "bg-yellow-400 text-black font-bold shadow-sm"
        : "text-gray-300 hover:text-white hover:bg-white/10"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
}