// src/types/Gym.ts
import { Lesson } from './Journey';
import { Reward } from './index';

export type GymType = 'CHALLENGE' | 'BOSS';

export interface Challenge {
    id: number;
    type: "PRACTICAL_CHALLENGE" | "INSTANT_CHALLENGE";
    name: string;
    recommendDurationInDays: number;
    maxDurationInDays: number;
    submissionFields?: any[]; // 這裡可以根據具體需求再細化
}

export interface Gym {
    id: number;
    chapterId: number;
    journeyId: number;
    code: string;
    name: string;
    description: string;
    type: GymType;
    difficulty: number;
    createdAt: number;
    // ★ 對應後端的 reward 物件
    reward: Reward;
    challenges: Challenge[];
    // ★ 記錄關聯的課程 ID 列表
    relatedLessonIds: string[];

    // 前端 UI 擴充欄位
    currentStars?: number;
    isLocked?: boolean;
}

// 修正後的 GymDetailData
export interface GymDetailData {
    id: number;
    code: string;
    name: string;
    description: string;
    type: GymType;
    difficulty: number;
    reward: Reward; // 確保詳情頁也能拿到獎勵資訊
    challenges: Challenge[];
    lessons: Lesson[]; // 這是在 gymService 中 map 出來的實體資料
    relatedLessonIds: string[];
    createdAt?: number;
}

