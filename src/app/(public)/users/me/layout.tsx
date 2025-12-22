'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// 定義分頁導覽
const TABS = [
  { name: '基本資料', href: '/users/me/profile' },
  { name: '道館徽章', href: '/users/me/gym-badges' },
  { name: '技能評級', href: '/users/me/skills' },
  { name: '證書', href: '/users/me/certificates' },
];

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-white">

      {/* 頂部個人資訊卡片 */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-[#111827] bg-opacity-50 p-8 rounded-lg">
        {/* 頭像 (這裡暫時用 Dicebear 當假圖，之後換成你的 DB user.avatar) */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-600 flex-shrink-0 relative">
          <Image
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>

        {/* 名稱與 ID */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
            再一次就掛機 <span className="text-gray-400 text-2xl font-normal">#2999</span>
          </h1>
        </div>
      </div>

      {/* 分頁導覽 Tabs */}
      <div className="flex flex-wrap gap-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                px-6 py-3 font-bold text-sm transition-colors rounded-t-sm
                ${isActive
                  ? 'bg-yellow-400 text-slate-900' // 選中狀態：黃底黑字
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800' // 未選中
                }
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* 下方內容區 (各個 page.tsx 會渲染在這裡) */}
      <div className="min-h-[400px] animate-fadeIn">
        {children}
      </div>
    </div>
  );
}