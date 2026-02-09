import { apiRequest } from '@/lib/api';
import { LessonDetail } from '@/types/Journey';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export const lessonService = {
    /**
     * 取得單元詳情 (影片、文章內容)
     * 對應 API: /api/lessons/{id}
     */
    async getLessonDetail(lessonId: string): Promise<LessonDetail | null> {
        if (USE_MOCK_DATA) {
            await delay(200);
            // 這裡可以回傳 Mock 資料，確保 Build 時不會報錯
            return null;
        }

        try {
            // 透過 apiRequest 確保 Docker 環境下能透過服務名稱連線
            return await apiRequest<LessonDetail>(`/lessons/${lessonId}`);
        } catch (error) {
            console.error(`[lessonService] 載入單元 ${lessonId} 失敗:`, error);
            return null;
        }
    }
};