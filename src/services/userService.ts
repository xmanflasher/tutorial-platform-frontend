// src/services/userService.ts
import { apiRequest } from '@/lib/api';
import { UserProfile } from '@/types/User';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export const userService = {
    /**
     * 取得指定使用者的公開檔案
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        if (USE_MOCK_DATA) {
            await delay(200);
            return null; // 建議在此回傳一個 MockUser 物件
        }

        try {
            // 這裡對接後端：/api/users?ids=xxx
            const data = await apiRequest(`/users?ids=${userId}`);

            if (Array.isArray(data) && data.length > 0) {
                const user = data[0];
                // 進行資料清洗 (Adapter 邏輯)
                return {
                    id: user.id,
                    name: user.name,
                    nickName: user.nickName,
                    jobTitle: user.jobTitle,
                    avatar: user.pictureUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                };
            }
            return null;
        } catch (error) {
            console.error("[userService] Failed to fetch profile", error);
            return null;
        }
    }
};