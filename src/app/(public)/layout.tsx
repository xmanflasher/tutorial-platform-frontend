'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
// 配合修改直接使用 Hook
import { useJourney } from '@/context/JourneyContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import MarketingBanner from '@/components/MarketingBanner';
import LoginModal from '@/components/auth/LoginModal';
import { API_BASE_URL } from '@/lib/api-config';
import { useLoading } from '@/context/LoadingContext';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { activeJourney } = useJourney();
  const { login } = useAuth();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const handleOpenLogin = () => setLoginModalOpen(true);
    window.addEventListener('open-login-modal', handleOpenLogin);
    return () => window.removeEventListener('open-login-modal', handleOpenLogin);
  }, []);

  // 攔截條件，觸發 Loading
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // 攔截條件：
      // 站內路徑 (以 / 開頭，且不是 //)
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        targetAttr !== '_blank' &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        // 排除頁面錨點與查詢參數
        const cleanHref = href.split('#')[0].split('?')[0];
        const cleanPathname = pathname.split('#')[0].split('?')[0];
        
        if (cleanHref !== cleanPathname) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [pathname, setIsLoading]);

  const handleMockLogin = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/dev-login?email=${email}`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        const { user: dbUser, token } = data;
        login(dbUser, token);
        setLoginModalOpen(false);
      } else {
        alert("登入失敗，請確認後端是否啟動");
      }
    } catch (error) {
      console.error(error);
      alert("發生錯誤");
    }
  };

  const isFullScreenPage = pathname.includes('/roadmap') || pathname.includes('/lessons') || pathname.includes('/gyms') || pathname.includes('/missions') || pathname.includes('/sop');

  if (isFullScreenPage) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <main className="flex-1 w-full h-full">
          {children}
        </main>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onMockLogin={handleMockLogin}
        />
        <GlobalLoadingOverlay />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* 側邊欄 Sidebar */}
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        className={`
          fixed inset-y-0 left-0 z-50 w-56
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      />

      {/* 遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 右側內容區 */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 頂部 Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLoginClick={() => {
            console.log("Header Login Button Clicked");
            setLoginModalOpen(true);
          }}
        />

        {/* 行銷橫幅 */}
        <MarketingBanner />

        {/* 頁面內容 */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onMockLogin={handleMockLogin}
        />
        <GlobalLoadingOverlay />
      </div>
    </div>
  );
}
