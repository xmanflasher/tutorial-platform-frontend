// 根據資料庫中的 status 欄位定義
export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

export interface MemberMission {
    missionId: number;
    name: string;
    description: string;
    status: MissionStatus;

    // 顯示用欄位 (後端已經格式化好的字串，前端直接顯示即可)
    rewardDescription: string;          // e.g. "經驗值 100, 金幣 50"
    unlockConditionDescription: string; // e.g. "通過道館 2"
    duration: number;
    // 期限與進度
    deadline: string | null; // ISO 字串
    currentProgress: number; // 0-100

    // 機會卡機制
    opportunityCardsUsed: number;
    maxOpportunityCards: number;
    isExtendable: boolean;
}

export type GymStatus = 'LOCKED' | 'NOT_STARTED' | 'PENDING' | 'PASSED' | 'FAILED' | 'REVIEWING';

export interface GymChallengeRecord {
    id: number;                // int8
    userId: number;            // user_id, int8
    journeyId: number;         // journey_id, int8
    chapterId: number;         // chapter_id, int8
    gymId: number;             // gym_id, int8
    gymChallengeId: number;    // gym_challenge_id, int8
    status: GymStatus;         // status, varchar(255)

    // JSONB 類型在前端通常對應物件或 any
    submission?: any;          // submission, jsonb (存放學員提交的內容)
    ratings?: any;             // ratings, jsonb (存放評分)
    feedback?: string;         // feedback, text (老師的回饋)

    // 時間戳記
    createdAt: string;         // created_at, timestamp
    updatedAt?: string;
    reviewedAt?: string;       // reviewed_at, timestamp
    completedAt?: string;      // completed_at, timestamp
    bookingCompletedAt?: string; // booking_completed_at, timestamp
}