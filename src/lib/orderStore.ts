// src/lib/orderStore.ts

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface Order {
    id: string;
    orderNumber: string;
    courseId: string | number;
    courseSlug: string;
    courseName: string;
    amount: number;
    status: OrderStatus;
    createdAt: number;
    paidAt?: number;
    paymentDeadline: number;
    remark?: string;
}

const STORAGE_KEY = 'tutorial_platform_orders';

export const orderStore = {
    getOrders(): Order[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse orders from localStorage', e);
            return [];
        }
    },

    saveOrders(orders: Order[]) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    },

    addOrder(order: Order) {
        const orders = this.getOrders();
        orders.unshift(order); // Newest first
        this.saveOrders(orders);
    },

    updateOrderStatus(orderId: string, status: OrderStatus) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = status;
            if (status === 'PAID') {
                orders[index].paidAt = Date.now();
            }
            this.saveOrders(orders);
        }
    },

    isCourseOwned(courseSlug: string): boolean {
        const orders = this.getOrders();
        return orders.some(o => o.courseSlug === courseSlug && o.status === 'PAID');
    },

    hasPendingOrder(courseSlug: string): boolean {
        const orders = this.getOrders();
        return orders.some(o => o.courseSlug === courseSlug && o.status === 'PENDING');
    },

    isCourseOwnedById(journeyId: string | number): boolean {
        const orders = this.getOrders();
        const idStr = String(journeyId);
        return orders.some(o => String(o.courseId) === idStr && o.status === 'PAID');
    }
};
