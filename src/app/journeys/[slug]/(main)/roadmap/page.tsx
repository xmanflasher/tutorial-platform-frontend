// src/app/journeys/[slug]/roadmap/page.tsx

import RoadmapView from "@/components/journeys/RoadmapView";

export default async function RoadmapPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    // 等待參數解析 (Next.js 15+ 規範)
    const { slug } = await params;

    // 將 slug 傳給 View (如果之後需要根據 slug 撈不同資料的話)
    // 目前你的 RoadmapView 可能還不需要 props，直接呼叫即可
    return <RoadmapView />;
}