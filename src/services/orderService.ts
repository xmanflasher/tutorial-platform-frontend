// src/services/orderService.ts
import { apiRequest } from '@/lib/api';
import { USE_MOCK_DATA, delay } from '@/lib/api-config';
import { orderStore, Order } from '@/lib/orderStore';

export const orderService = {
    /**
     * 建立訂單
     */
    async createOrder(params: {
        userId: number | string;
        journeyId: number | string;
        amount: number;
        paymentMethod: string;
        invoiceType: string;
        invoiceValue: string;
    }): Promise<Order> {
        if (USE_MOCK_DATA) {
            await delay(500);
            const mockOrder: Order = {
                id: String(Date.now()),
                orderNumber: `MOCK-${Date.now()}`,
                courseId: String(params.journeyId),
                courseSlug: 'software-design-pattern',
                courseName: '模擬課程 (Mock)',
                amount: params.amount,
                status: 'PENDING',
                createdAt: Date.now(),
                paymentDeadline: Date.now() + (3 * 24 * 60 * 60 * 1000)
            };
            orderStore.addOrder(mockOrder);
            return mockOrder;
        }

        try {
            const data = await apiRequest<any>('/orders', {
                method: 'POST',
                body: JSON.stringify(params)
            });

            const newOrder: Order = {
                id: String(data.id),
                orderNumber: data.orderNumber,
                courseId: data.journeyId,
                courseSlug: data.journeySlug || '', 
                courseName: data.journeyName,
                amount: data.amount,
                status: data.status as any,
                createdAt: data.createdAt,
                paymentDeadline: data.createdAt + (3 * 24 * 60 * 60 * 1000)
            };

            orderStore.addOrder(newOrder);

            return newOrder;
        } catch (error) {
            console.error('[orderService] Failed to create order', error);
            throw error;
        }
    },

    /**
     * 取得使用者訂單
     */
    async getUserOrders(userId: number | string): Promise<Order[]> {
        try {
            const data = await apiRequest<any[]>(`/users/${userId}/orders`, { silent: true });
            const orders = data.map(o => ({
                id: String(o.id),
                orderNumber: o.orderNumber,
                courseId: o.journeyId,
                courseSlug: o.journeySlug || '', 
                courseName: o.journeyName,
                amount: o.amount,
                status: o.status as any,
                createdAt: o.createdAt,
                paidAt: o.paidAt,
                paymentDeadline: o.createdAt + (3 * 24 * 60 * 60 * 1000)
            }));
            
            console.log(`[orderService] Syncing local store with ${orders.length} orders`);
            orderStore.saveOrders(orders);
            
            // 重要：發送事件通知其他組件 (例如首頁 CourseCard) 重新檢查擁有狀態
            if (typeof window !== 'undefined') {
                console.log('[orderService] Dispatching order-completed event');
                window.dispatchEvent(new CustomEvent('order-completed'));
            }
            
            return orders;
        } catch (error) {
            console.error('[orderService] Failed to fetch orders', error);
            return orderStore.getOrders();
        }
    },

    /**
     * 標記為已支付
     */
    async markAsPaid(orderNumber: string): Promise<boolean> {
        try {
            await apiRequest<any>(`/orders/${orderNumber}/pay`, { method: 'POST' });
            // Sync local status 
            const orders = orderStore.getOrders();
            const order = orders.find(o => o.orderNumber === orderNumber);
            if (order) {
                orderStore.updateOrderStatus(order.id, 'PAID');
                
            }
            return true;
        } catch (error) {
            console.error('[orderService] Failed to mark order as paid', error);
            return false;
        }
    },

    /**
     * 取消訂單
     */
    async cancelOrder(orderNumber: string): Promise<boolean> {
        try {
            await apiRequest<any>(`/orders/${orderNumber}/cancel`, { method: 'POST' });
            // Sync local status 
            const orders = orderStore.getOrders();
            const order = orders.find(o => o.orderNumber === orderNumber);
            if (order) {
                orderStore.updateOrderStatus(order.id, 'CANCELLED');
            }
            return true;
        } catch (error) {
            console.error('[orderService] Failed to cancel order', error);
            // fallback for mock
            const orders = orderStore.getOrders();
            const order = orders.find(o => o.orderNumber === orderNumber);
            if (order && USE_MOCK_DATA) {
                orderStore.updateOrderStatus(order.id, 'CANCELLED');
                return true;
            }
            return false;
        }
    }
};
