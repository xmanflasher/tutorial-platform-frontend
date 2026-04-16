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
      return {
          id: Number(gymId),
          name: '模擬道館 (Mock Gym)',
          description: '當前處於離線或 Mock 模式，無法由後端取得道館內容，但地圖功能仍可運作。',
          challenges: []
      } as any;
    }

    try {
      return await apiRequest(`/gyms/${gymId}`);
    } catch (error) {
      console.warn(`[gymService] 取得道館 ${gymId} 失敗，傳回基礎 Mock 以降級渲染`, error);
      return {
          id: Number(gymId),
          name: '修煉道館 (Offline)',
          description: '連線不穩，目前呈現離線內容。',
          challenges: []
      } as any;
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
      const isOwned = slug ? (orderStore.isCourseOwned(slug)) : false;

      // 輔助函式：判斷是否成功通過
      const isSuccess = (status?: string) => 
        status === 'SUCCESS' || status === 'PASSED' || status === 'COMPLETED';

      let previousCompleted = true; // 第一個關卡預設前一關已完成

      return journeyGyms.map((gym, index) => {
        const record = recordMap.get(gym.id);
        const passed = isSuccess(record?.status);
        
        // 取得星數：有紀錄則優先讀取 ratings.stars，若沒給則預設 3 (因 status 為成功)
        const stars = passed ? (record?.ratings?.stars || 3) : 0;
        
        // 解鎖邏輯：已購買 且 (是第一關 或 前一關已通過)
        const isLocked = !isOwned || !previousCompleted;

        // 更新下一關的判斷依據
        previousCompleted = passed;

        return {
          ...gym,
          currentStars: stars,
          isLocked: isLocked,
          bookingCompletedAt: record?.bookingCompletedAt
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
