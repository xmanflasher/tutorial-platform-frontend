// src/app/journeys/[slug]/(main)/layout.tsx
'use client';

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useJourney } from "@/context/JourneyContext";
import { API_BASE_URL } from "@/lib/api-config";

export default function MainJourneyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { activeJourney } = useJourney();
    const { login } = useAuth();

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

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
            alert("連線錯誤");
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-white">
            <Sidebar
                onClose={() => setSidebarOpen(false)}
                className={`
                    w-56 h-screen fixed left-0 top-0 z-50 
                    md:flex 
                    ${isSidebarOpen ? 'flex' : 'hidden'}
                `}
            />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 md:ml-56 flex flex-col min-h-screen content-container">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    onLoginClick={() => setLoginModalOpen(true)}
                />

                <main className="flex-1 p-6 overflow-y-auto">
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
