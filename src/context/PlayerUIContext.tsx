'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// 定義 UI 的狀態介面
interface PlayerUIContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void; // 手機版點擊連結後自動關閉用
    openSidebar: () => void;
}

const PlayerUIContext = createContext<PlayerUIContextType | undefined>(undefined);

export function PlayerUIProvider({ children }: { children: ReactNode }) {
    // 預設側邊欄是打開的
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    return (
        <PlayerUIContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }}>
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