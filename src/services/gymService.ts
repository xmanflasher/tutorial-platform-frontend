import { apiRequest } from '@/lib/api';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';
import { Gym, GymDetailData } from '@/types';
import { recordService } from '@/services/recordService'; // 建議直接指名路徑避免循環引用

export const gymService = {
  /**
   * 取得道館詳情 (補強防呆與降級)
   */
  async getGymDetail(gymId: string): Promise<GymDetailData | null> {
    // 優先判斷手動 Mock 開關
    if (USE_MOCK_DATA) {
      await delay(300);
      return null; // TODO: 建議這裡回傳實質的 Mock 物件避免頁面報錯
    }

    try {
      return await apiRequest(`/gyms/${gymId}`);
    } catch (error) {
      // ★ 降級防呆：連線失敗 (如 ECONNREFUSED) 時的處理
      console.warn(`[gymService] 取得道館 ${gymId} 失敗，嘗試回傳保底資料`, error);
      return null;
    }
  },

  /**
   * 核心邏輯：合併道館原型與使用者紀錄
   * 整合 recordService 的降級邏輯
   */
  async getMergedGyms(journeyGyms: Gym[]): Promise<Gym[]> {
    // 1. 開發模式或 build 階段的降級
    if (USE_MOCK_DATA) {
      return this.fallbackGymProgress(journeyGyms);
    }

    try {
      // 2. 呼叫 recordService 取得紀錄 (該 service 內部也應有 try-catch)
      const records = await recordService.getUserGymRecords();
      const recordMap = new Map(records.map(r => [r.gymId, r]));

      return journeyGyms.map(gym => {
        const record = recordMap.get(gym.id);
        return {
          ...gym,
          currentStars: record?.status === 'PASSED' ? (record?.ratings?.stars || 0) : 0,
          isLocked: !record && gym.code !== "1"
        };
      });
    } catch (error) {
      // ★ 降級防呆：API 連線失敗時，保證 Roadmap 至少能顯示第一關
      console.error("[gymService] 進度合併失敗，進入 Fallback 模式", error);
      return this.fallbackGymProgress(journeyGyms);
    }
  },

  /**
   * 內部的降級/Mock 邏輯 (DRY 原則)
   */
  fallbackGymProgress(gyms: Gym[]): Gym[] {
    return gyms.map(gym => ({
      ...gym,
      isLocked: gym.code !== "1" && !gym.code.includes('.'), // 預設只開主線第 1 關
      currentStars: 0
    }));
  }
};