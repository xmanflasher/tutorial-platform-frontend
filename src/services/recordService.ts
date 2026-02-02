import { apiRequest } from '@/lib/api';
import { GymChallengeRecord } from '@/types';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export const recordService = {
    /**
     * 取得當前使用者的所有道館挑戰紀錄 (強化防呆)
     */
    async getUserGymRecords(): Promise<GymChallengeRecord[]> {
        // 1. 如果開啟 Mock 模式
        if (USE_MOCK_DATA) {
            await delay(200);
            return []; // Mock 模式下預設無進度
        }

        try {
            // 假設 API 路由為 /gym-challenge-records/me
            return await apiRequest('/gym-challenge-records/me');
        } catch (error) {
            // ★ 降級防呆：連線失敗 (ECONNREFUSED) 時回傳空陣列
            // 這樣 gymService 的 Map 才不會崩潰，且能正常顯示地圖 (只是會鎖定)
            console.warn('[recordService] 無法取得挑戰紀錄，回傳空陣列作為保底', error);
            return [];
        }
    },

    /**
     * 提交新的挑戰紀錄
     */
    async submitChallenge(gymId: number, submission: any) {
        try {
            return await apiRequest(`/gym-challenge-records`, {
                method: 'POST',
                body: JSON.stringify({ gymId, ...submission })
            });
        } catch (error) {
            console.error('[recordService] 提交挑戰失敗', error);
            throw error; // 提交失敗通常需要讓 UI 顯示錯誤訊息，所以拋出
        }
    }
};