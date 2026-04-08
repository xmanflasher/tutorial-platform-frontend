import React, { useState } from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import UserMenu from './UserMenu';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Map, Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  onMenuClick?: () => void;
  onLoginClick?: () => void;
}

export default function Header({ onMenuClick, onLoginClick }: HeaderProps) {
  const { user } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = async (notif: any) => {
    // 1. 如果是未讀，先標記為已讀
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    
    // 2. 關閉下拉選單
    setShowNotifications(false);
    
    // 3. 跳轉連結
    if (notif.linkHref) {
      window.location.href = notif.linkHref;
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <header className="h-16 bg-card border-b border-border-ui flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-40 relative transition-colors duration-300">
      <div className="flex items-center gap-4">
        <MobileNav onMenuClick={onMenuClick} />
        <DesktopNav />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/challenges"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-primary text-primary hover:bg-primary/10 hover:text-primary/80 font-bold rounded transition-colors"
            >
              <Map size={18} />
              <span>前往挑戰</span>
            </Link>

            <div className="relative">
              <button
                onClick={handleBellClick}
                className={`p-2 transition-colors relative border rounded-full ${showNotifications
                    ? 'bg-primary text-black border-primary'
                    : 'text-primary border-primary/30 hover:bg-primary/10'
                  }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-red-600 rounded-full border-2 border-[#111827] animate-in zoom-in duration-300">
                    <span className="text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onItemClick={handleNotificationClick}
                  onMarkAllRead={handleMarkAllRead}
                />
              )}
            </div>

            <UserMenu />
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center justify-center px-6 py-2 bg-primary hover:opacity-90 text-black text-sm font-bold rounded transition-colors shadow-sm"
          >
            登入
          </button>
        )}
      </div>
    </header>
  );
}