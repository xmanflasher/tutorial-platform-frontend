import { apiRequest } from '@/lib/api';
import { GymChallengeRecord } from '@/types';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export const recordService = {
    /**
     * 取得當前使用者的所有道館挑戰紀錄 (強化防呆)
     */
    async getUserGymRecords(): Promise<GymChallengeRecord[]> {
        // 1. 如果開啟 Mock 模式
        if (USE_MOCK_DATA) {
            await delay(200);
            return []; // Mock 模式下預設無進度
        }

        try {
            // 修正：路徑需符合後端新定義的 /api/gym-challenge-records/me
            const remoteRecords = await apiRequest<GymChallengeRecord[]>('/gym-challenge-records/me', { silent: true }) || [];
            
            // ★ 合併本地暫存的紀錄 (Demo 用)
            const localRecordsJson = localStorage.getItem('local_gym_records');
            if (localRecordsJson) {
                const localRecords = JSON.parse(localRecordsJson) as GymChallengeRecord[];
                
                // 以遠端為主，若本地有則補上/覆蓋
                const merged = [...remoteRecords];
                localRecords.forEach((lr: GymChallengeRecord) => {
                    // 同時檢查 gymId 與 gymChallengeId 以區分不同的挑戰
                    if (!merged.find(r => r.gymId === lr.gymId && r.gymChallengeId === lr.gymChallengeId)) {
                        merged.push(lr);
                    }
                });
                return merged;
            }

            return remoteRecords;
        } catch (error) {
            console.warn('[recordService] 無法取得挑戰紀錄，嘗試讀取本地暫存', error);
            const localRecordsJson = localStorage.getItem('local_gym_records');
            return localRecordsJson ? JSON.parse(localRecordsJson) : [];
        }
    },

    /**
     * 提交新的挑戰紀錄
     */
    async submitChallenge(params: {
        userId: number;
        journeyId: number;
        chapterId: number;
        gymId: number;
        gymChallengeId: number;
        submission: Record<string, string>;
    }): Promise<GymChallengeRecord> {
        try {
            return await apiRequest(`/gym-challenge-records`, {
                method: 'POST',
                body: JSON.stringify(params)
            });
        } catch (error) {
            console.warn('[recordService] 提交挑戰失敗，嘗試進入 Demo 備援模式', error);
            
            // 如果是 404 或其他連線問題，且 submission 內含有資料，則存入本地
            if (params.submission) {
                const localRecords = JSON.parse(localStorage.getItem('local_gym_records') || '[]');
            const newRecord: GymChallengeRecord = {
                id: Date.now(),
                userId: params.userId,
                journeyId: params.journeyId,
                chapterId: params.chapterId,
                gymId: params.gymId,
                gymChallengeId: params.gymChallengeId,
                status: 'REVIEWING', // 暫存流程一律先設為審核中
                submission: params.submission,
                createdAt: Date.now()
            };
                localStorage.setItem('local_gym_records', JSON.stringify([...localRecords, newRecord]));
            }
            
            throw error; // 仍然拋出錯誤，讓 UI (如 ChallengeModal) 可以根據錯誤顯示特定提示
        }
    },
    
    /**
     * 預約挑戰 (設定預約截止時間)
     */
    async bookChallenge(params: {
        gymId: number;
        gymChallengeId: number;
    }): Promise<GymChallengeRecord> {
        return await apiRequest(`/gym-challenge-records/book`, {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }
};