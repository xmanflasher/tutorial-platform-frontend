import { apiRequest } from '@/lib/api';
import { LessonDetail } from '@/types/Journey';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';
import { MOCK_LESSONS } from '@/mock/lessonsMock';
import { MOCK_LESSON_CONTENTS } from '@/mock/lesson_contentsMock';

export const lessonService = {
    /**
     * 取得單元詳情 (影片、文章內容)
     */
    async getLessonDetail(lessonId: string): Promise<LessonDetail | null> {
        if (USE_MOCK_DATA) {
            await delay(200);
            return this.getMockLessonDetail(lessonId);
        }

        try {
            return await apiRequest<LessonDetail>(`/lessons/${lessonId}`);
        } catch (error) {
            console.warn(`[lessonService] 載入單元 ${lessonId} 失敗，降級使用動態 Mock 組裝`, error);
            return this.getMockLessonDetail(lessonId);
        }
    },

    /**
     * 動態組裝單元詳情 (結合標題與內容表)
     */
    getMockLessonDetail(lessonId: string): LessonDetail | null {
        // 1. 找基礎資訊 (ID 可能是 String 或 Number)
        const lessonRaw = MOCK_LESSONS.find((l: any) => String(l.id) === String(lessonId));
        
        // 如果找不到特定的，才 fallback 到第一個 (確保不會隨便返回 null)
        const finalLesson = lessonRaw || MOCK_LESSONS[0];
        if (!finalLesson) return null;

        // 2. 找該單元的內容 (影片連結或文章)
        const contents = MOCK_LESSON_CONTENTS
            .filter((c: any) => String(c.lessonId) === String(finalLesson.id))
            .map((c: any) => ({
                id: c.id,
                type: (c.type?.toLowerCase() || 'video') as any,
                url: c.url,
                content: c.content
            }));

        return {
            id: Number(finalLesson.id),
            name: finalLesson.name || '',
            description: finalLesson.description || '',
            type: (finalLesson.type?.toLowerCase() || 'video') as any,
            createdAt: Date.now(),
            content: contents,
            reward: { 
                exp: 50,
                coin: 0,
                subscriptionExtensionInDays: 0,
                journeyId: 0,
                externalRewardDescription: ''
            },
            videoLength: finalLesson.videoLength || undefined,
            premiumOnly: !!finalLesson.premiumOnly
        };
    }
};