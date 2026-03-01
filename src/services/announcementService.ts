// src/services/announcementService.ts
import { apiRequest } from '@/lib/api';

export interface AnnouncementData {
    id: number;
    message: string;
    linkText?: string;
    linkHref?: string;
    createdAt?: string;
    isGlobal?: boolean;
}

type Subscriber = (announcement: AnnouncementData | null) => void;

class AnnouncementService {
    private currentAnnouncement: AnnouncementData | null = null;
    private subscribers: Set<Subscriber> = new Set();

    subscribe(callback: Subscriber) {
        this.subscribers.add(callback);
        // Immediately provide current state
        callback(this.currentAnnouncement);

        // Auto-fetch if first subscriber
        if (this.subscribers.size === 1 && !this.currentAnnouncement) {
            this.fetchLatest();
        }

        return () => { this.subscribers.delete(callback); };
    }

    async fetchLatest() {
        try {
            const data = await apiRequest<AnnouncementData>('/announcements/latest', { silent: true });
            if (data) {
                this.currentAnnouncement = data;
                this.notify();
            }
        } catch (e) {
            console.warn('[AnnouncementService] Failed to fetch latest', e);
        }
    }

    async fetchAll(): Promise<AnnouncementData[]> {
        try {
            return await apiRequest<AnnouncementData[]>('/announcements', { silent: true });
        } catch (e) {
            console.error('[AnnouncementService] Failed to fetch all', e);
            return [];
        }
    }

    emit(message: string, linkText?: string, linkHref?: string) {
        this.currentAnnouncement = {
            id: Date.now(),
            message,
            linkText,
            linkHref
        };
        this.notify();
    }

    clear() {
        this.currentAnnouncement = null;
        this.notify();
    }

    private notify() {
        this.subscribers.forEach(callback => callback(this.currentAnnouncement));
    }
}

export const announcementService = new AnnouncementService();
