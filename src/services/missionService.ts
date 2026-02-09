import { MemberMission } from "@/types";
import { MOCK_MISSIONS } from "@/mock"; // 引入剛加的 Mock
import { USE_MOCK_DATA, delay } from "@/lib/api-config";
import { apiRequest } from '@/lib/api';

export const missionService = {
  /**
   * 取得特定 Journey 的所有任務
   */
  getMissionsByJourneySlug: async (slug: string): Promise<MemberMission[]> => {
    // 1. Mock 模式
    if (USE_MOCK_DATA) {
      await delay(300);
      return MOCK_MISSIONS;
    }

    // 2. 真實模式
    try {
      // apiRequest 會自動處理 Token，不需要手動帶
      return await apiRequest<MemberMission[]>(`/journeys/${slug}/missions`);
    } catch (error) {
      console.error("[missionService] 請求失敗，回傳空陣列", error);
      return [];
    }
  }
};