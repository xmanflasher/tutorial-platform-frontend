// src/services/userService.ts
import { apiRequest } from '@/lib/api';
import { UserProfile } from '@/types/User';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export const userService = {
    /**
     * 取得指定使用者的公開檔案
     */
    async getUserProfile(userId: string): Promise<UserProfile | null> {
        if (USE_MOCK_DATA) {
            await delay(200);
            return null;
        }

        try {
            // 這裡對接後端：/api/users?ids=xxx
            const data = await apiRequest(`/users?ids=${userId}`);

            if (Array.isArray(data) && data.length > 0) {
                const user = data[0];
                return {
                    id: user.id,
                    name: user.name,
                    nickName: user.nickName,
                    jobTitle: user.jobTitle,
                    occupation: user.occupation,
                    level: user.level,
                    exp: user.exp,
                    nextLevelExp: user.nextLevelExp,
                    avatar: user.pictureUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
                    region: user.region,
                    githubUrl: user.githubUrl,
                    discordId: user.discordId,
                    sex: user.sex,
                    birthDate: user.birthDate,
                    role: user.role,
                    instructorBio: user.instructorBio,
                    socialLinks: user.socialLinks
                };
            }
            return null;
        } catch (error) {
            console.error("[userService] Failed to fetch profile", error);
            return null;
        }
    },

    /**
     * 更新使用者資料 (對應身份與權限隔離，僅能修改本人)
     */
    async updateCurrentProfile(data: any): Promise<boolean> {
        try {
            await apiRequest('/members/me', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return true;
        } catch (error) {
            console.error("[userService] Failed to update current profile", error);
            return false;
        }
    },

    /**
     * 更新講師專屬版面資料 (Phase 9.1)
     */
    async updateInstructorProfile(data: any): Promise<boolean> {
        try {
            await apiRequest('/users/me/instructor-profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return true;
        } catch (error) {
            console.error("[userService] Failed to update instructor profile", error);
            return false;
        }
    },

    /**
     * 更新使用者資料 (特定 ID)
     */
    async updateProfile(userId: string, data: any): Promise<boolean> {
        try {
            await apiRequest(`/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
            return true;
        } catch (error) {
            console.error("[userService] Failed to update profile", error);
            return false;
        }
    },

    /**
     * 更新使用者身份 (保留舊的相容性)
     */
    async updateUserRole(userId: string, role: string): Promise<boolean> {
        return this.updateProfile(userId, { jobTitle: role, occupation: role });
    }
};