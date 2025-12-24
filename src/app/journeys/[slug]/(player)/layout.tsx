// src/app/journeys/[slug]/layout.tsx
import { ReactNode } from "react";
import PlayerSidebar from "@/components/journeys/PlayerSidebar";
import PlayerHeader from "@/components/journeys/PlayerHeader";
import { PlayerUIProvider } from "@/context/PlayerUIContext";
import { getJourneyBySlug } from "@/lib/api"; // ★ 1. 引入真實 API

// ★ 2. 定義 Props，params 必須是 Promise
interface LayoutProps {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}

export default async function JourneyPlayerLayout({
    children,
    params,
}: LayoutProps) {
    // ★ 3. 先 await params (Next.js 15+ 規定)
    const { slug } = await params;

    // 呼叫真實 API
    const journey = await getJourneyBySlug(slug);

    if (!journey) return <div className="text-white p-10">Journey Not Found</div>;

    return (
        <PlayerUIProvider>
            <div className="flex h-screen w-full bg-[#0b0f19] text-white overflow-hidden">

                {/* 將 journey 資料直接傳進去，確保資料源一致 */}
                <PlayerSidebar journey={journey} />

                <div className="flex-1 flex flex-col h-full min-w-0">
                    {/* Header 顯示課程標題 (請確認 API 回傳是用 title 還是 name) */}
                    <PlayerHeader title={journey.title} />

                    <main className="flex-1 overflow-y-auto relative scroll-smooth p-6">
                        {children}
                    </main>
                </div>

            </div>
        </PlayerUIProvider>
    );
}