'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

// 定義 UI 的狀態介面
interface PlayerUIContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;
    
    // 進度管理
    finishedLessonIds: number[];
    setFinishedLessonIds: (ids: number[]) => void;
    addFinishedId: (id: number) => void;
    refreshFinishedIds: () => Promise<void>;
}

const PlayerUIContext = createContext<PlayerUIContextType | undefined>(undefined);

export function PlayerUIProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [finishedLessonIds, setFinishedLessonIds] = useState<number[]>([]);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    const refreshFinishedIds = async () => {
        try {
            const ids = await apiRequest<number[]>('/learning-records/me/finished-lessons', { silent: true });
            setFinishedLessonIds(Array.isArray(ids) ? ids : []);
        } catch (err) {
            console.warn('[PlayerUIContext] 載入進度失敗', err);
        }
    };

    const addFinishedId = (id: number) => {
        setFinishedLessonIds(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    // 初始化載入
    useEffect(() => {
        refreshFinishedIds();
    }, []);

    return (
        <PlayerUIContext.Provider value={{ 
            isSidebarOpen, toggleSidebar, closeSidebar, openSidebar,
            finishedLessonIds, setFinishedLessonIds, addFinishedId, refreshFinishedIds
        }}>
            {children}
        </PlayerUIContext.Provider>
    );
}

export function usePlayerUI() {
    const context = useContext(PlayerUIContext);
    if (!context) {
        throw new Error('usePlayerUI must be used within a PlayerUIProvider');
    }
    return context;
}