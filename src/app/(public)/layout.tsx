'use client';

import { useState } from 'react'; // 移除 useRef, useEffect, menu, chevronDown 相關引入
import { useRouter, usePathname } from 'next/navigation';
// import { Menu, ChevronDown } from 'lucide-react'; // 這些可以拿掉
import Sidebar from '@/components/layout/Sidebar';
// import { ALL_JOURNEYS } from '@/mock'; // 這些也可以拿掉，因為 Dropdown 邏輯移走了
import { JourneyProvider, useJourney } from '@/context/JourneyContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import LoginModal from '@/components/auth/LoginModal';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const [isDropdownOpen, setDropdownOpen] = useState(false); // 刪除
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  // const dropdownRef = useRef<HTMLDivElement>(null); // 刪除

  const router = useRouter();
  const pathname = usePathname();
  // const { activeJourney, setActiveSlug } = useJourney(); // Layout 可能不需要 setActiveSlug 了，除非 Sidebar 需要
  const { activeJourney } = useJourney();
  const { login } = useAuth();

  // ... (原本的 useEffect handleClickOutside 可以刪除) ...

  // ... (原本的 useEffect pathname match 可以保留，如果你需要同步網址) ...

  // ... (原本的 handleSwitchJourney 可以刪除，因為邏輯移到 Header 裡了) ...

  const handleMockLogin = async (email: string) => {
    // ... (保留登入邏輯) ...
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white flex">
      <Sidebar
        journey={activeJourney}
        onClose={() => setSidebarOpen(false)}
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">

        {/* ▼▼▼▼▼ 修改重點：原本這裡有一大串 <header>...</header> ▼▼▼▼▼ */}
        {/* 我們把它全部換成單純的 <Header /> 元件 */}

        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLoginClick={() => setLoginModalOpen(true)}
        />

        {/* ▲▲▲▲▲ 修改結束 ▲▲▲▲▲ */}

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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JourneyProvider>
        <LayoutContent>{children}</LayoutContent>
      </JourneyProvider>
    </AuthProvider>
  );
}