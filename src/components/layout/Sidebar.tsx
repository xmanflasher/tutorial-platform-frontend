"use client";

import Link from "next/link";
import Image from "next/image"; // 引入 Image 用來顯示 Logo
import { usePathname } from "next/navigation";
import { 
  Home,         // 首頁圖示
  LayoutGrid,   // 課程圖示
  Trophy,       // 排行榜圖示
  Layers, 
  Map, 
  BookOpen, 
  Sparkles, 
  CircleHelp,
  type LucideIcon,
  X 
} from "lucide-react";
import { JourneyDetail } from "@/types";

// 1. 定義圖示對應表
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

  // 如果沒有 journey 資料，至少顯示全域選單，不顯示 Loading
  // 這樣畫面才不會閃一下

  return (
    // 2. 修正配色：強制使用深色背景 bg-[#0d0e11] 與白色文字
    <aside className={`border-r border-gray-800 bg-[#0d0e11] text-white flex flex-col ${className}`}>
      
      {/* 3. Sidebar Header: Logo 區域 */}
      <div className="p-6 border-b border-gray-800 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-wider">
            {/* 這裡假設你有 logo 圖片，如果沒有先用文字代替 */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                W
            </div>
            <span>WATERBALLSA</span>
        </Link>
        
        {/* 手機版關閉按鈕 */}
        {onClose && (
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                <X size={20} />
            </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* 4. 第一區塊：全域導覽 (固定不變) */}
        <div className="space-y-2">
            <NavItem href="/" icon={Home} label="首頁" active={pathname === "/"} onClick={onClose} />
            <NavItem href="/courses" icon={LayoutGrid} label="課程" active={pathname === "/courses"} onClick={onClose} />
            <NavItem href="/leaderboard" icon={Trophy} label="排行榜" active={pathname === "/leaderboard"} onClick={onClose} />
        </div>

        {/* 分隔線 */}
        {journey && journey.menus.length > 0 && (
            <div className="h-px bg-gray-800 my-2" />
        )}

        {/* 5. 第二區塊：旅程專屬選單 (動態讀取) */}
        {journey && (
            <div className="space-y-2">
                {journey.menus.map((menu, index) => {
                    const IconComponent = ICON_MAP[menu.icon] || ICON_MAP["default"];
                    const isActive = pathname === menu.href;
                    
                    // 特別樣式：選中時變黃色
                    return (
                        <Link
                            key={`${menu.href}-${index}`}
                            href={menu.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                                isActive 
                                ? "bg-yellow-400 text-black font-bold" 
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        © WaterballSA
      </div>
    </aside>
  );
}

// 抽取一個簡單的小元件來處理全域選單的按鈕樣式
function NavItem({ href, icon: Icon, label, active, onClick }: { href: string, icon: LucideIcon, label: string, active: boolean, onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                active 
                ? "bg-gray-800 text-white" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </Link>
    );
}