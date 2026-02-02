// src/services/journeyService.ts
import { JourneyDetail } from '@/types';
import { JOURNEY_MAP } from '@/mock';
import { API_BASE_URL, USE_MOCK_DATA, delay } from '@/lib/api-config';

export const journeyService = {
    /**
     * 取得單一旅程詳情
     */
    async getJourneyBySlug(slug: string): Promise<JourneyDetail> {
        if (USE_MOCK_DATA) {
            await delay(200); // 模擬網路延遲
            return JOURNEY_MAP[slug] || JOURNEY_MAP['software-design-pattern'];
        }

        try {
            const res = await fetch(`${API_BASE_URL}/journeys/${slug}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            return this.adaptJourneyDetail(data, slug);
        } catch (error) {
            // ★ 加強防呆：當連線失敗 (ECONNREFUSED) 或後端噴錯，直接回傳 Mock 資料
            console.warn(`[API] 連線失敗，降級回傳 Mock 資料: ${slug}`, error);
            return JOURNEY_MAP[slug] || JOURNEY_MAP['software-design-pattern'];
        }
    },

    /**
     * 內部適配器 (Adapter)
     */
    adaptJourneyDetail(data: any, slug: string): JourneyDetail {
        return {
            ...data,
            slug: data.slug || slug,
            menus: data.menus || [],
            features: ['中文課程', '支援行動裝置', '專業的完課認證'],
            actionButtons: data.actionButtons || { primary: '立即加入', secondary: '了解更多' }
        };
    }
};