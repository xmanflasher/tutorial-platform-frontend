// src/services/missionService.ts
import { MemberMission } from "@/types"; // ★ 改用 MemberMission
import { API_BASE_URL, USE_MOCK_DATA, delay } from "@/lib/api-config";

// ★ 更新 Mock Data 以符合新的 MemberMission 結構
const MOCK_MISSIONS: MemberMission[] = [
  {
    missionId: 1,
    name: "初入茅廬",
    description: "觀看第一章的所有影片",
    status: "AVAILABLE",
    rewardDescription: "經驗值 100",
    unlockConditionDescription: "無",
    duration: 30,
    deadline: null,
    currentProgress: 0,
    opportunityCardsUsed: 0,
    maxOpportunityCards: 2,
    isExtendable: false
  },
  {
    missionId: 2,
    name: "實戰演練",
    description: "完成道館挑戰",
    status: "LOCKED",
    rewardDescription: "金幣 50, 經驗值 200",
    unlockConditionDescription: "需先完成：初入茅廬",
    duration: 30,
    deadline: null,
    currentProgress: 0,
    opportunityCardsUsed: 0,
    maxOpportunityCards: 2,
    isExtendable: false
  }
];

export const missionService = {
  /**
   * 取得特定 Journey 的所有任務
   */
  getMissionsByJourneySlug: async (slug: string): Promise<MemberMission[]> => {
    // [模式 A] Mock Data
    if (USE_MOCK_DATA) {
      console.log(`[MissionService: MOCK] 讀取任務假資料 slug: ${slug}`);
      await delay(300);
      return MOCK_MISSIONS; 
    }

    // [模式 B] Real Fetch
    const url = `${API_BASE_URL}/journeys/${slug}/missions?memberId=1`; // 注意: 實際串接時 memberId 通常從 Token 解析，這裡僅為範例
    console.log(`[MissionService: REAL] 正在請求後端: ${url}`);

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || ''; 
    }

    try {
      const res = await fetch(url, { 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        cache: 'no-store' 
      });

      if (res.status === 401) {
        console.warn("[MissionService] 401 Unauthorized - Token 可能無效或過期");
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch missions: ${res.status}`);
      }

      const data = await res.json();
      return data; // 後端回傳的 JSON 已經是 MemberMissionDTO 格式
      
    } catch (error) {
      console.error("[MissionService Error] 請求失敗", error);
      return [];
    }
  }
};