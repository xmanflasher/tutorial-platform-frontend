// src/types/User.ts

export interface UserProfile {
    id: number;
    name: string;
    nickName: string;
    jobTitle: string;
    avatar: string;
    level?: number;
    exp?: number;
}

export interface LeaderboardMember {
    id: number;
    rank?: number;        // 排名 (非 API 直接回傳，可由前端 index 計算)
    name: string;
    avatar: string;
    jobTitle: string;
    level: number;
    exp: number;          // 統一使用 exp 替代 score
    trend?: 'up' | 'down' | 'same';
}