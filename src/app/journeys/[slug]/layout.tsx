import { getJourneyBySlug } from "@/lib/api";
export default async function JourneyLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    // 1. 如果你是 Next.js 15，這裡的型別建議改成 Promise
    params: Promise<{ slug: string }>;
}) {
    // 2. ★ 關鍵修正：必須先 await params 才能拿到 slug ★
    const { slug } = await params;

    // 3. 確保 slug 存在才呼叫 API (簡單防呆，雖然理論上路由會確保有值)
    if (!slug) return null;

    // 4. 使用解析出來的 slug 呼叫 API
    const journey = await getJourneyBySlug(slug);

    return (
        <section className="journey-player-layout h-screen w-full bg-black">
            {children}
        </section>
    );
}