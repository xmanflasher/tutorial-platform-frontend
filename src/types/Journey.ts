// src/types/Journey.ts 
import { Gym } from './Gym';
import { Reward } from './index';
// 單元 (Lesson)
export interface Lesson {
  id: string;
  name: string;
  type: 'video' | 'scroll' | 'google-form' | 'boss';
  premiumOnly?: boolean; // 是否為試看
  videoLength?: string; // e.g. "10:05"
}
// 3. 章節介面
export interface Chapter {
  id: number; // 注意：後端有時傳字串，前端建議統一轉 number 或 string，這裡配合 id: number
  name: string;
  belt?: 'WHITE' | 'BLACK';
  lessons: Lesson[]; // 如果 Roadmap 沒用到 Lesson 可以先不寫，保持乾淨
}

// 4. 旅程選單
export interface JourneyMenu {
  name: string;
  href: string;
  icon: string;
}

// 5. 旅程詳情介面 (API 回傳的完整結構)
export interface JourneyDetail {
  id: number; // 旅程 ID 通常是 string (e.g. "5")
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags?: string[];
  // 結構面
  chapters: Chapter[];
  missions: Mission[];
  gyms: Gym[];
  menus: JourneyMenu[];

  // 行銷/顯示面
  price: number;
  totalVideos: number;
  features: string[];
  actionButtons: {
    primary: string;
    secondary: string;
  };
}

// 任務條件/門檻介面 (用於 prerequisites 與 criteria)
export interface MissionCondition {
  id: number;
  name: string;
  description: string;
  type: string; // 例如: "GYM_CHALLENGE_SUCCESS"
  requiredQuantity: number;
  journeyId: number;
  chapterId?: number; // 選填，因為並非所有條件都綁定章節
  gymId?: number;     // 選填，綁定特定的道館 ID
}

// 主任務介面
export interface Mission {
  id: number;
  journeyId: number;
  name: string;
  description: string;
  durationInDays: number;

  // 前置任務/需求
  prerequisites: MissionCondition[];

  // 達成標竿/條件
  criteria: MissionCondition[];

  // 任務獎勵
  reward: Reward;
}

// 單元內容 (影片連結或 Markdown 文字)
export interface LessonContent {
  type: 'VIDEO' | 'MARKDOWN' | 'video' | 'markdown';
  url?: string;
  id?: number;
  content?: string;
}

// 完整的單元詳情 (API: /api/lessons/{id})
export interface LessonDetail {
  id: number;
  name: string;
  description: string;
  type: 'VIDEO' | 'SCROLL' | 'video' | 'scroll' | 'google-form' | 'boss';
  createdAt: number;
  content: LessonContent[];
  reward: Reward;
  videoLength?: string;
}