// src/context/NotificationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from '@/lib/api'; // 使用專案既有的 apiRequest
import { notificationService, Notification } from '@/services/notificationService';
import { useAuth } from './AuthContext';
import BadgeCelebrationOverlay from '@/components/common/BadgeCelebrationOverlay';

interface BadgeCelebrationData {
  id: number;
  name: string;
  imageUrl: string;
}

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // 慶祝動畫隊列
  const [unshownBadges, setUnshownBadges] = useState<BadgeCelebrationData[]>([]);
  const [currentCelebration, setCurrentCelebration] = useState<BadgeCelebrationData | null>(null);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- API 輔助方法 (改用 apiRequest) ---
  const fetchUnshownBadges = async () => {
    if (!user) return [];
    try {
      // apiRequest 內部會處理 Token (來自 AuthContext/localStorage)
      const data = await apiRequest('/members/me/badges/unshown');
      return data as BadgeCelebrationData[];
    } catch (e) {
      console.error("Failed to fetch unshown badges", e);
    }
    return [];
  };

  const markBadgeAsShown = async (badgeId: number) => {
    if (!user) return;
    try {
      await apiRequest(`/members/me/badges/${badgeId}/mark-shown`, {
        method: 'PATCH',
      });
    } catch (e) {
      console.error("Failed to mark badge as shown", e);
    }
  };

  // --- 核心輪詢邏輯 ---
  const refresh = useCallback(async () => {
    if (!user) return;
    
    // 1. 抓取未讀數與清單 (此處已在 notificationService 封裝)
    const count = await notificationService.fetchUnreadCount();
    setUnreadCount(count);

    const list = await notificationService.fetchMyNotifications();
    setNotifications(list);

    // 🏆 2. 抓取未播放動畫的徽章
    const badges = await fetchUnshownBadges();
    if (badges && badges.length > 0) {
      setUnshownBadges(badges);
    }
  }, [user]);

  // 彈出隊列處理
  useEffect(() => {
    if (unshownBadges.length > 0 && !currentCelebration) {
      setCurrentCelebration(unshownBadges[0]);
    }
  }, [unshownBadges, currentCelebration]);

  useEffect(() => {
    if (user) {
      refresh();
      pollTimerRef.current = setInterval(refresh, 60000); 
    } else {
      setUnreadCount(0);
      setNotifications([]);
      setUnshownBadges([]);
      setCurrentCelebration(null);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [user, refresh]);

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    refresh();
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    refresh();
  };

  const handleCelebrationClose = async (badgeId: number) => {
    await markBadgeAsShown(badgeId);
    setUnshownBadges(prev => prev.filter(b => b.id !== badgeId));
    setCurrentCelebration(null);
  };

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      notifications,
      refresh,
      markAsRead,
      markAllAsRead
    }}>
      {children}
      {currentCelebration && (
        <BadgeCelebrationOverlay 
          badgeId={currentCelebration.id}
          badgeName={currentCelebration.name} 
          imageUrl={currentCelebration.imageUrl}
          onClose={handleCelebrationClose} 
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
