import { apiRequest } from '@/lib/api';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';
import { Gym, GymDetailData } from '@/types';
import { recordService } from '@/services/recordService'; 
import { orderStore } from '@/lib/orderStore';

export const gymService = {
  /**
   * 取得道館詳情
   */
  async getGymDetail(gymId: string): Promise<GymDetailData | null> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return null;
    }

    try {
      return await apiRequest(`/gyms/${gymId}`);
    } catch (error) {
      console.warn(`[gymService] 取得道館 ${gymId} 失敗`, error);
      return null;
    }
  },

  /**
   * 核心邏輯：合併道館原型與使用者紀錄
   */
  async getMergedGyms(journeyGyms: Gym[], slug?: string): Promise<Gym[]> {
    if (USE_MOCK_DATA) {
      return this.fallbackGymProgress(journeyGyms, slug);
    }

    try {
      const records = await recordService.getUserGymRecords();
      const recordMap = new Map(records.map(r => [r.gymId, r]));
      
      // 檢查是否擁有該旅程
      // 增加防呆：同時檢查 Slug 與 ID (如果之後有傳入 ID 的話)
      const isOwned = slug ? (orderStore.isCourseOwned(slug)) : false;

      return journeyGyms.map((gym, index) => {
        const record = recordMap.get(gym.id);
        
        // 核心邏輯：
        // 1. 如果沒購買 (isOwned === false)，則全部鎖定 (isLocked: true)。
        // 2. 如果已購買，則依序解鎖：該分頁的第一關預設開啟 (index === 0)，其餘需有過關紀錄。
        return {
          ...gym,
          currentStars: record?.status === 'PASSED' ? (record?.ratings?.stars || 0) : 0,
          isLocked: !isOwned || (!record && index !== 0)
        };
      });
    } catch (error) {
      console.error("[gymService] 進度合併失敗", error);
      return this.fallbackGymProgress(journeyGyms, slug);
    }
  },

  /**
   * 內部的降級/Mock 邏輯
   */
  fallbackGymProgress(gyms: Gym[], slug?: string): Gym[] {
    const isOwned = slug ? orderStore.isCourseOwned(slug) : false;

    return gyms.map((gym, index) => ({
      ...gym,
      isLocked: !isOwned || (index !== 0 && !gym.code.includes('.')), 
      currentStars: 0
    }));
  }
};
