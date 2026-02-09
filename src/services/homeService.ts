// src/services/homeService.ts
import {
    Announcement,
    Course,
    ResourceCard,
    Instructor,
    LeaderboardMember,
    JourneyDetail
} from '@/types';

import {
    MOCK_ANNOUNCEMENT,
    MOCK_FEATURED_COURSES,
    MOCK_RESOURCE_CARDS,
    MOCK_INSTRUCTOR,
    MOCK_LEADERBOARD
} from '@/mock';

import { USE_MOCK_DATA, delay } from '@/lib/api-config';
import { apiRequest } from '@/lib/api'; // ★ 1. 改用統一的 API 請求工具
import { toFeaturedCourse } from '@/adapters/courseAdapter'; // ★ 2. 引入 Adapter

export const homeService = {
    /**
     * 取得全站公告
     */
    async getAnnouncement(): Promise<Announcement> {
        if (USE_MOCK_DATA) {
            await delay(100);
            return MOCK_ANNOUNCEMENT;
        }

        try {
            // apiRequest 會自動處理 401/500 錯誤與 Base URL
            return await apiRequest<Announcement>('/announcements/latest');
        } catch (error) {
            console.warn('[homeService] 公告載入失敗，降級回傳 Mock');
            return MOCK_ANNOUNCEMENT;
        }
    },

    /**
     * 取得首頁精選課程 (使用 Adapter 模式)
     */
    async getFeaturedCourses(): Promise<Course[]> {
        if (USE_MOCK_DATA) {
            await delay(300);
            return MOCK_FEATURED_COURSES;
        }

        try {
            // 1. 取得後端原始資料 (JourneyDetail[])
            const data = await apiRequest<JourneyDetail[]>('/journeys');

            // 2. 透過 Adapter 轉換成 UI 需要的格式 (Course[])
            // 這行程式碼非常優雅：把 data 陣列裡的每一項都丟給 toFeaturedCourse 處理
            return data.map(toFeaturedCourse);

        } catch (error) {
            console.error(`[homeService] 課程載入失敗，降級回傳 Mock`, error);
            return MOCK_FEATURED_COURSES;
        }
    },

    /**
     * 取得資源連結卡片
     * (目前無後端 API，維持 Mock)
     */
    async getResourceCards(): Promise<ResourceCard[]> {
        if (USE_MOCK_DATA) await delay(200);
        return MOCK_RESOURCE_CARDS;
    },

    /**
     * 取得導師資訊
     * (目前無後端 API，維持 Mock)
     */
    async getInstructor(): Promise<Instructor> {
        if (USE_MOCK_DATA) await delay(200);
        return MOCK_INSTRUCTOR;
    },

    /**
     * 取得排行榜資料
     */
    async getLeaderboard(): Promise<LeaderboardMember[]> {
        if (USE_MOCK_DATA) {
            await delay(400);
            return MOCK_LEADERBOARD;
        }

        try {
            return await apiRequest<LeaderboardMember[]>('/leaderboard');
        } catch (error) {
            console.warn('[homeService] 排行榜載入失敗，降級回傳 Mock');
            return MOCK_LEADERBOARD;
        }
    }
};