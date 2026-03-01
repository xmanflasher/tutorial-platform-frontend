import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import UserMenu from './UserMenu';
import { useAuth } from '@/context/AuthContext';
import { Map, Bell } from 'lucide-react';
import { announcementService, AnnouncementData } from '@/services/announcementService';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  onMenuClick?: () => void;
  onLoginClick?: () => void;
}

export default function Header({ onMenuClick, onLoginClick }: HeaderProps) {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AnnouncementData[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = announcementService.subscribe((ann) => {
      if (ann) {
        setHasUnread(true);
        setLatestAnnouncement(ann);
      } else {
        setHasUnread(false);
      }
    });
    return () => { unsubscribe(); };
  }, []);

  const handleBellClick = async () => {
    if (!showNotifications) {
      // 開啟時抓取全部
      const all = await announcementService.fetchAll();
      setNotifications(all);
      setHasUnread(false);
    }
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (notification: AnnouncementData) => {
    setShowNotifications(false);
    if (notification.linkHref) {
      window.location.href = notification.linkHref;
    }
  };

  return (
    <header className="h-16 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-40 relative">
      <div className="flex items-center gap-4">
        <MobileNav onMenuClick={onMenuClick} />
        <DesktopNav />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/challenges"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-bold rounded transition-colors"
            >
              <Map size={18} />
              <span>前往挑戰</span>
            </Link>

            <div className="relative">
              <button
                onClick={handleBellClick}
                className={`p-2 transition-colors relative border rounded-full ${showNotifications
                    ? 'bg-yellow-400 text-slate-900 border-yellow-400'
                    : 'text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10'
                  }`}
              >
                <Bell size={20} />
                {hasUnread && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111827]"></span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onItemClick={handleNotificationClick}
                />
              )}
            </div>

            <UserMenu />
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center justify-center px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded transition-colors shadow-sm"
          >
            登入
          </button>
        )}
      </div>
    </header>
  );
}