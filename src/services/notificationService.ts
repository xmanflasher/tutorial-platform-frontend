import { USE_MOCK_DATA, delay } from '@/lib/api-config';

export interface Notification {
    id: number;
    memberId: number;
    message: string;
    linkText?: string;
    linkHref?: string;
    isRead: boolean;
    createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        memberId: 1,
        message: '歡迎來到 Σ-Codeatl！你的冒險旅程即將開始。',
        isRead: false,
        createdAt: new Date().toISOString()
    }
];

class NotificationService {
    /**
     * 取得目前登入使用者的所有通知 (包含已讀與未讀)
     */
    async fetchMyNotifications(): Promise<Notification[]> {
        if (USE_MOCK_DATA) {
            await delay(300);
            return MOCK_NOTIFICATIONS;
        }

        try {
            return await apiRequest<Notification[]>('/notifications/me', { silent: true });
        } catch (e) {
            console.warn('[NotificationService] Failed to fetch notifications, using empty/mock list', e);
            return MOCK_NOTIFICATIONS;
        }
    }

    /**
     * 取得目前登入使用者的未讀通知數量
     */
    async fetchUnreadCount(): Promise<number> {
        try {
            const res = await apiRequest<{ count: number }>('/notifications/me/unread-count', { silent: true });
            return res.count;
        } catch (e) {
            console.warn('[NotificationService] Failed to fetch unread count', e);
            return 0;
        }
    }

    /**
     * 將指定的通知標記為已讀
     */
    async markAsRead(id: number): Promise<boolean> {
        try {
            await apiRequest(`/notifications/${id}/read`, {
                method: 'PATCH',
                silent: true
            });
            return true;
        } catch (e) {
            console.error('[NotificationService] Failed to mark notification as read', e);
            return false;
        }
    }

    /**
     * 將所有通知標記為已讀 (預留功能)
     */
    async markAllAsRead(): Promise<boolean> {
        try {
            await apiRequest('/notifications/me/read-all', {
                method: 'PATCH',
                silent: true
            });
            return true;
        } catch (e) {
            console.error('[NotificationService] Failed to mark all notifications as read', e);
            return false;
        }
    }
}

export const notificationService = new NotificationService();
