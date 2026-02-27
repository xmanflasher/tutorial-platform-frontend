import { MemberMission } from "@/types";
import { MOCK_MISSIONS } from "@/mock"; 
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
      return await apiRequest<MemberMission[]>(`/journeys/${slug}/missions`);
    } catch (error) {
      console.error("[missionService] 請求失敗，回傳空陣列", error);
      return [];
    }
  },

  acceptMission: async (missionId: number): Promise<void> => {
    await apiRequest(`/missions/${missionId}/accept`, { method: 'POST' });
  },

  extendMission: async (missionId: number): Promise<void> => {
    await apiRequest(`/missions/${missionId}/extend`, { method: 'POST' });
  },

  claimReward: async (missionId: number): Promise<void> => {
    await apiRequest(`/missions/${missionId}/claim`, { method: 'POST' });
  }
};