// src/services/achievementService.ts
import { apiRequest } from '@/lib/api';
import { Certificate, MemberAchievements } from '@/types';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export const achievementService = {
    /**
     * 驗證證書 (公開端點)
     */
    async verifyCertificate(code: string): Promise<Certificate> {
        if (USE_MOCK_DATA) {
            await delay(500);
            return {
                id: 1,
                verificationCode: code,
                issuedAt: new Date().toISOString(),
                metadata: {
                    skillSnapshot: { "1": 95.5, "2": 88.0, "3": 92.0 },
                    instructorName: "水球潘",
                    journeyName: "軟體設計大師之路",
                    memberDisplayName: "學員戴夫"
                }
            };
        }

        return await apiRequest<Certificate>(`/certificates/verify/${code}`, { silent: true });
    },

    /**
     * 取得當前使用者的成就資料 (雷達圖與證書庫)
     * [ARCH-FIX-02] 支持按課程篩選評級
     */
    async getMyAchievements(journeyId?: number): Promise<MemberAchievements> {
        if (USE_MOCK_DATA) {
            // ... (Mock logic remains similar)
            await delay(500);
            return {
                skillRating: { "Logic": 85, "Arch": 72, "Design": 90, "Comm": 65, "Solv": 80 },
                certificates: []
            };
        }

        const params = journeyId ? `?journeyId=${journeyId}` : '';
        return await apiRequest<MemberAchievements>(`/members/me/achievements${params}`);
    }
};
