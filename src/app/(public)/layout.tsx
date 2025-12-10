'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { ALL_JOURNEYS } from '@/mock';
import { JourneyProvider, useJourney } from '@/context/JourneyContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import LoginModal from '@/components/auth/LoginModal';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { activeJourney, setActiveSlug } = useJourney();
  const { login } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const match = pathname.match(/^\/journeys\/([^\/]+)/);
    if (match) {
      const slugFromUrl = match[1];
      if (activeJourney.slug !== slugFromUrl) {
        setActiveSlug(slugFromUrl);
      }
    }
  }, [pathname, activeJourney.slug, setActiveSlug]);

  const handleSwitchJourney = (targetSlug: string) => {
    setDropdownOpen(false);
    if (pathname.startsWith('/journeys/')) {
      router.push(`/journeys/${targetSlug}`);
    } else {
      setActiveSlug(targetSlug);
    }
  };

  // ★ 修正重點：補上 try-catch
  const handleMockLogin = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/dev-login?email=${email}`, {
        method: 'POST',
      });

      if (res.ok) {
        const dbUser = await res.json();
        login(dbUser); // 這裡現在應該不會報錯了
        setLoginModalOpen(false);
      } else {
        alert("登入失敗，請確認後端是否啟動");
      }
    } catch (error) { // ★ 這裡就是你原本少掉的 catch
      console.error(error);
      alert("連線錯誤");
    }
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
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 bg-[#0d0e11] z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white md:hidden">
              <Menu size={24} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1f24] rounded border border-gray-700 cursor-pointer hover:border-gray-500 transition-colors max-w-[200px] md:max-w-xs"
              >
                <span className="text-sm font-medium truncate">{activeJourney.title}</span>
                <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e1f24] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <p className="px-3 py-2 text-xs text-gray-500 font-bold">切換旅程</p>
                    {ALL_JOURNEYS.map(journey => (
                      <button
                        key={journey.id}
                        onClick={() => handleSwitchJourney(journey.slug)}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-700 hover:text-white ${activeJourney.slug === journey.slug ? 'text-yellow-400 bg-gray-800' : 'text-gray-300'
                          }`}
                      >
                        {journey.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右側 Header 元件 */}
          <div className="flex-1 flex justify-end">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              onLoginClick={() => setLoginModalOpen(true)}
            />
          </div>
        </header>

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