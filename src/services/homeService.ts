import {
    Announcement,
    Course,
    ResourceCard,
    Instructor,
    LeaderboardUser,
    JourneyDetail
} from '@/types';

import {
    MOCK_ANNOUNCEMENT,
    MOCK_FEATURED_COURSES,
    MOCK_RESOURCE_CARDS,
    MOCK_INSTRUCTOR,
    MOCK_LEADERBOARD,
    JOURNEY_MAP
} from '@/mock';

import { API_BASE_URL, USE_MOCK_DATA, delay } from '@/lib/api-config';

export const homeService = {
    /**
     * 取得全站公告
     */
    async getAnnouncement(): Promise<Announcement> {
        if (USE_MOCK_DATA) {
            await delay(100);
            return MOCK_ANNOUNCEMENT;
        }

        // 未來對接 API 範例
        const res = await fetch(`${API_BASE_URL}/announcements/latest`);
        if (!res.ok) return MOCK_ANNOUNCEMENT; // 失敗時降級回傳 Mock
        return res.json();
    },

    /**
     * 取得首頁精選課程 (從旅程資料轉換)
     */
    async getFeaturedCourses(): Promise<Course[]> {
        if (USE_MOCK_DATA) {
            await delay(300);
            return MOCK_FEATURED_COURSES;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/journeys`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch courses');

            const data: JourneyDetail[] = await res.json();

            // DTO 轉換邏輯：將後端的 Journey 模型轉為首頁 Course 顯示模型
            return data.map(journey => ({
                id: journey.id,
                title: journey.title,
                subtitle: journey.subtitle || (journey.description ? journey.description.slice(0, 30) + '...' : ''),
                author: '水球潘',
                description: journey.description,
                slug: journey.slug,
                image: journey.slug.includes('ai') ? '/images/course_4.png' : '/images/course_0.png',
                tags: journey.tags || [],
                statusLabel: '尚未擁有', // 這部分通常後續會由 Auth 狀態決定
                primaryAction: {
                    text: '試聽課程',
                    href: `/journeys/${journey.slug}`,
                    style: 'solid'
                }
            }));
        } catch (error) {
            console.error(`[homeService] 課程載入失敗`, error);
            return MOCK_FEATURED_COURSES;
        }
    },

    /**
     * 取得資源連結卡片 (如部落格、Discord 等)
     */
    async getResourceCards(): Promise<ResourceCard[]> {
        if (USE_MOCK_DATA) {
            await delay(200);
            return MOCK_RESOURCE_CARDS;
        }
        // 目前後端尚未提供此 API，先維持 Mock
        return MOCK_RESOURCE_CARDS;
    },

    /**
     * 取得導師資訊
     */
    async getInstructor(): Promise<Instructor> {
        if (USE_MOCK_DATA) {
            await delay(200);
            return MOCK_INSTRUCTOR;
        }
        return MOCK_INSTRUCTOR;
    },

    /**
     * 取得排行榜資料
     */
    async getLeaderboard(): Promise<LeaderboardUser[]> {
        if (USE_MOCK_DATA) {
            await delay(400);
            return MOCK_LEADERBOARD;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/leaderboard`);
            if (!res.ok) return MOCK_LEADERBOARD;
            return res.json();
        } catch (error) {
            return MOCK_LEADERBOARD;
        }
    }
};