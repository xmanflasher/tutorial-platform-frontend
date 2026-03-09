'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types/User';

const TABS = [
  { name: '基本資料', href: '/users/me/profile' },
  { name: '道館徽章', href: '/users/me/gym-badges' },
  { name: '技能評級', href: '/users/me/skills' },
  { name: '證書', href: '/users/me/certificates' },
  { name: '訂單紀錄', href: '/users/me/orders' },
];

const PORTFOLIO_PATH = '/users/me/portfolio';

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (authUser?.id) {
      userService.getUserProfile(authUser.id.toString())
        .then(data => setProfile(data))
        .catch(err => console.error("Failed to load layout profile:", err));
    }
  }, [authUser?.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-white">
      {/* 頂部個人資訊卡片 (Adventurer Banner) */}
      <div className="relative overflow-hidden rounded-lg border border-gray-800 bg-[#161b22] shadow-xl">
        {/* 背景特效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}>
          </div>
        </div>

        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-[1px]">
          {/* 頭像 */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#0d0e11] shadow-2xl bg-gray-900">
            <Image
              src={profile?.avatar || authUser?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>

          {/* 名稱與 ID */}
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">
              {profile?.nickName || authUser?.name || '冒險者'}
            </h1>
            <p className="text-gray-400 text-sm font-mono tracking-tight">
              #{profile?.id || authUser?.id || '----'} <span className="mx-2 text-gray-700">|</span> {profile?.jobTitle || '初級冒險者'}
            </p>
          </div>
        </div>
      </div>

      {/* 分頁導覽 Tabs - 僅在非作品集頁面顯示 */}
      {pathname !== PORTFOLIO_PATH && (
        <div className="flex flex-wrap gap-1 border-b border-gray-800 pb-1">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  px-6 py-3 font-bold text-sm transition-all rounded-t-lg relative
                  ${isActive
                    ? 'bg-yellow-400 text-slate-900 ring-1 ring-yellow-400'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* 下方內容區 (各個 page.tsx 會渲染在這裡) */}
      <div className="min-h-[400px] animate-fadeIn">
        {children}
      </div>
    </div>
  );
}