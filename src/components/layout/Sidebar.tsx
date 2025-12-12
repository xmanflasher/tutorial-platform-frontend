"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { JourneyDetail } from "@/types";
import { useAuth } from "@/context/AuthContext"; // 引入 AuthContext

// 定義圖示對應表
const ICON_MAP: Record<string, LucideIcon> = {
  "layers": Layers,
  "map": Map,
  "book-open": BookOpen,
  "sparkles": Sparkles,
  "default": CircleHelp
};

interface SidebarProps {
  journey: JourneyDetail | null;
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ journey, className = "", onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth(); // 使用 Context 取得使用者狀態

  return (
    <aside className={`border-r border-gray-800 bg-[#0d0e11] text-white flex flex-col ${className}`}>

      {/* Logo 區域 */}
      <div className="p-6 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-wider">
          {/* Logo 圖示佔位 */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[url('/logo.png')] bg-cover" />
            {/* 若無圖片可先用文字或簡單圖形代替 */}
            {!user && <span className="text-[10px] text-white">WB</span>}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-gray-200">水球軟體學院</span>
            <span className="text-[10px] text-blue-300 font-bold">WATERBALLSA.TW</span>
          </div>
        </Link>

        {/* 手機版關閉按鈕 */}
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-2 space-y-4 overflow-y-auto custom-scrollbar">

        {/* =========================================================
            區塊一：核心導覽 (Core)
            包含：首頁、課程 + (會員) 個人檔案
           ========================================================= */}
        <div className="space-y-1">
          <NavItem href="/" icon={Home} label="首頁" active={pathname === "/"} onClick={onClose} />
          <NavItem href="/courses" icon={LayoutGrid} label="課程" active={pathname === "/courses"} onClick={onClose} />

          {/* [已登入] 顯示個人檔案 */}
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

        {/* 分隔線 */}
        <div className="h-px bg-gray-800 mx-2" />

        {/* =========================================================
            區塊二：成就與紀錄 (Achievements & Records)
            包含：排行榜 + (會員) 獎勵任務、挑戰歷程
           ========================================================= */}
        <div className="space-y-1">
          <NavItem href="/leaderboard" icon={Trophy} label="排行榜" active={pathname === "/leaderboard"} onClick={onClose} />

          {/* [已登入] 顯示會員專屬紀錄 */}
          {user && (
            <>
              <NavItem
                href="/journeys/software-design-pattern/missions"
                icon={Gift}
                label="獎勵任務"
                active={pathname.includes("/missions")}
                onClick={onClose}
              />
              <NavItem
                href="/users/me/portfolio"
                icon={ScrollText}
                label="挑戰歷程"
                active={pathname === "/users/me/portfolio"}
                onClick={onClose}
              />
            </>
          )}
        </div>

        {/* 分隔線 (僅當有課程選單時顯示) */}
        {journey && journey.menus.length > 0 && (
          <div className="h-px bg-gray-800 mx-2" />
        )}

        {/* =========================================================
            區塊三：旅程選單 (Journey Menu)
            動態讀取，不顯示標題
           ========================================================= */}
        {journey && (
          <div className="space-y-1">
            {journey.menus.map((menu, index) => {
              const IconComponent = ICON_MAP[menu.icon] || ICON_MAP["default"];
              const isActive = pathname === menu.href;

              return (
                <Link
                  key={`${menu.href}-${index}`}
                  href={menu.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-medium ${isActive
                      ? "bg-yellow-400 text-black font-bold shadow-sm" // 依照截圖，選中樣式為黃底黑字
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </div>
        )}

      </nav>

      {/* 底部留白或版本號，可依需求增減 */}
      <div className="p-4"></div>
    </aside>
  );
}

// 抽取的小元件：統一處理按鈕樣式
// 依照截圖風格：選中時為黃色背景(rounded-full)，未選中為文字(hover變色)
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