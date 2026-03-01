'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, CreditCard, Tag, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

interface Order {
    id: string;
    orderNumber: string;
    journeyName: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    createdAt: number;
    paidAt?: number;
    remark?: string;
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for order history as shown in user's image
        const mockOrders: Order[] = [
            {
                id: '1',
                orderNumber: '202601212122177242',
                journeyName: '軟體設計模式精通之旅',
                amount: 38999,
                status: 'CANCELLED',
                createdAt: new Date('2026-01-21').getTime(),
                remark: '期限內未完成付款'
            }
        ];

        setTimeout(() => {
            setOrders(mockOrders);
            setLoading(false);
        }, 500);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'CANCELLED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PAID': return '已完成';
            case 'CANCELLED': return '已取消';
            default: return '待付款';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">載入中...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-[#3B82F6]" />
                <h2 className="text-2xl font-bold">訂單紀錄</h2>
            </div>

            {orders.length === 0 ? (
                <div className="bg-[#1E293B] rounded-xl p-12 text-center border border-white/5">
                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400">目前尚無訂單紀錄</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-[#1E293B] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            {/* Status Badge Top Right */}
                            <div className={cn(
                                "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                                getStatusColor(order.status)
                            )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", order.status === 'PAID' ? "bg-emerald-500" : order.status === 'CANCELLED' ? "bg-rose-500" : "bg-amber-500")} />
                                {getStatusLabel(order.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Column 1: Order Meta */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-1">訂單編號</p>
                                        <p className="font-mono text-sm">{order.orderNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs mb-1">金額</p>
                                        <p className="text-xl font-bold text-white">
                                            NT$ {order.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Column 2: Date & Product */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-xs mb-1">付款日期</p>
                                        <p className="text-sm">
                                            {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : '--'}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-400 text-xs mb-1">課程名稱</p>
                                        <p className="text-sm font-medium">{order.journeyName}</p>
                                    </div>
                                </div>

                                {/* Column 3: Remarks */}
                                <div className="md:col-span-3 pt-4 border-t border-white/5 mt-2">
                                    <div className="flex items-start gap-2 text-xs text-gray-400">
                                        <AlertCircle className="w-3.5 h-3.5 mt-0.5" />
                                        <span>備註：{order.remark || '無'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
