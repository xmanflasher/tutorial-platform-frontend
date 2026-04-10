// Record 相關的其他定義

export type GymStatus = 'LOCKED' | 'NOT_STARTED' | 'PENDING' | 'PASSED' | 'FAILED' | 'REVIEWING';

export interface GymChallengeRecord {
    id: number;                // int8
    userId: number;            // user_id, int8
    journeyId: number;         // journey_id, int8
    chapterId: number;         // chapter_id, int8
    gymId: number;             // gym_id, int8
    gymChallengeId: number;    // gym_challenge_id, int8
    status: GymStatus;         // status, varchar(255)
    gymName?: string;          // 道館名稱

    // JSONB 類型在前端通常對應物件或 any
    submission?: any;          // submission, jsonb (存放學員提交的內容)
    ratings?: any;             // ratings, jsonb (存放評分)
    feedback?: string;         // feedback, text (老師的回饋)

    // 時間戳記
    createdAt: number;         // created_at, timestamp (long)
    updatedAt?: number;
    reviewedAt?: number;       // reviewed_at, timestamp (long)
    completedAt?: number;      // completed_at, timestamp (long)
    bookingCompletedAt?: number; // booking_completed_at, timestamp (long)
    challengeType?: 'PRACTICAL_CHALLENGE' | 'INSTANT_CHALLENGE';
}

// 挑戰紀錄 (用於個人檔案/作品集導向)
export interface ChallengeRecord {
    id: number;
    gymId: number;
    gymName?: string;
    gymChallengeId: number;
    challengeType?: 'PRACTICAL_CHALLENGE' | 'INSTANT_CHALLENGE';
    status: "SUCCESS" | "FAILED" | "SUBMITTED" | "IN_PROGRESS" | "PASSED" | "REVIEWING";
    feedback?: string;
    ratings?: Record<string, string>;
    submission?: Record<string, string>;
    createdAt: number;
    reviewedAt?: number;
}
