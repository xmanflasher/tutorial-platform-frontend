'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
// ★ 修改處：只引入 Hook，移除 Provider
import { useJourney } from '@/context/JourneyContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import LoginModal from '@/components/auth/LoginModal';

// ★ 修改處：直接將 LayoutContent 改名為 default export 的 PublicLayout
// 不需要再外面包一層 <AuthProvider> 了
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 這裡的 useJourney 和 useAuth 會自動往上層找 (src/app/layout.tsx) 的 Provider
  const { activeJourney } = useJourney();
  const { login } = useAuth();

  const handleMockLogin = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/dev-login?email=${email}`, {
        method: 'POST',
      });

      if (res.ok) {
        const dbUser = await res.json();
        login(dbUser);
        setLoginModalOpen(false);
      } else {
        alert("登入失敗，請確認後端是否啟動");
      }
    } catch (error) {
      console.error(error);
      alert("連線錯誤");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white flex">
      {/* 全站 Sidebar */}
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        className={`
          fixed inset-y-0 left-0 z-50 w-56
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      />

      {/* 手機版遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 右側內容區 */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 全站 Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLoginClick={() => setLoginModalOpen(true)}
        />

        {/* 頁面內容 */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onMockLogin={handleMockLogin}
        />
      </div>
    </div>
  );
}