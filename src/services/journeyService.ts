import { JourneyDetail } from '@/types';
import { API_BASE_URL, USE_MOCK_DATA, delay } from '@/lib/api-config';
import { 
    MOCK_JOURNEYS, 
    MOCK_CHAPTERS, 
    MOCK_LESSONS, 
    MOCK_MEMBERS, 
    MOCK_GYMS, 
    MOCK_MISSIONS_RAW 
} from '@/mock';

export const journeyService = {
    /**
     * 取得單一旅程詳情
     */
    async getJourneyBySlug(slug: string): Promise<JourneyDetail> {
        if (USE_MOCK_DATA) {
            await delay(200);
            return this.getMockJourneyDetail(slug);
        }

        try {
            const res = await fetch(`${API_BASE_URL}/journeys/${slug}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            return this.adaptJourneyDetail(data, slug);
        } catch (error) {
            console.warn(`[API] 連線失敗，降級使用動態 Mock 組裝: ${slug}`, error);
            return this.getMockJourneyDetail(slug);
        }
    },

    /**
     * 動態組裝 Mock 旅程詳情 (從 SQL 轉出的各表進行 Join)
     */
    getMockJourneyDetail(slug: string): JourneyDetail {
        // 1. 找旅程 (預設給 SDP)
        const journeyRaw = MOCK_JOURNEYS.find(j => j.slug === slug) || MOCK_JOURNEYS[0];
        const journeyId = journeyRaw.id;

        // 2. 找講師名稱
        const instructor = MOCK_MEMBERS.find(m => m.id === journeyRaw.instructorId);

        // 3. 找章節
        const chapters = MOCK_CHAPTERS
            .filter((c: any) => c.journeyId === journeyId)
            .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((c: any) => ({
                id: Number(c.id),
                name: c.name || '',
                lessons: MOCK_LESSONS
                    .filter((l: any) => l.chapterId === c.id)
                    .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((l: any) => ({
                        id: String(l.id),
                        name: l.name || '',
                        type: (l.type?.toLowerCase() || 'video') as any,
                        premiumOnly: !!l.premiumOnly,
                        videoLength: l.videoLength
                    }))
            }));

        // 4. 合定格式
        return {
            id: journeyId,
            slug: journeyRaw.slug,
            title: journeyRaw.name,
            subtitle: instructor ? `${instructor.name} 的專業課程` : 'Σ-Codeatl 專業導航',
            instructorName: instructor?.name,
            description: journeyRaw.description,
            price: slug === 'javascript-basics-140' ? 0 : 3000,
            totalVideos: MOCK_LESSONS.filter(l => l.journeyId === journeyId && l.type === 'VIDEO').length,
            tags: journeyRaw.slug.includes('js') ? ['JS 基礎', '尚硅谷'] : ['設計模式', '實戰'],
            chapters: chapters,
            missions: (MOCK_MISSIONS_RAW as any[]).filter(m => m.journeyId === journeyId),
            gyms: (MOCK_GYMS as any[]).filter(g => g.journeyId === journeyId),
            menus: [
                { name: "所有單元", href: `/journeys/${slug}`, icon: "layers" },
                { name: "挑戰地圖", href: `/journeys/${slug}/map`, icon: "map" },
                { name: "專屬寶典", href: `/journeys/${slug}/sop`, icon: "book-open" }
            ],
            features: ['中文課程', '支援行動裝置', '專業的完課認證'],
            actionButtons: { primary: '立即加入', secondary: '了解更多' }
        };
    },

    /**
     * 內部適配器 (Adapter)
     */
    adaptJourneyDetail(data: any, slug: string): JourneyDetail {
        return {
            ...data,
            slug: data.slug || slug,
            menus: data.menus?.length ? data.menus : [
                { name: "所有單元", href: `/journeys/${slug}`, icon: "layers" },
                { name: "挑戰地圖", href: `/journeys/${slug}/map`, icon: "map" },
                { name: "專屬寶典", href: `/journeys/${slug}/sop`, icon: "book-open" }
            ],
            features: data.features || ['中文課程', '支援行動裝置', '專業的完課認證'],
            actionButtons: data.actionButtons || { primary: '立即加入', secondary: '了解更多' }
        };
    }
};