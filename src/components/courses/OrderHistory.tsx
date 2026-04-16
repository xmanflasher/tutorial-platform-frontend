'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { orderStore, Order } from '@/lib/orderStore';
import { orderService } from '@/services/orderService';
import { announcementService } from '@/services/announcementService';
import { useAuth } from '@/context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const fetchedOrders = await orderService.getUserOrders(user.id);
            setOrders(fetchedOrders);
        } catch (error) {
            setOrders(orderStore.getOrders());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleCompleteOrder = async (order: Order) => {
        const success = await orderService.markAsPaid(order.orderNumber);
        if (success) {
            await loadOrders();
            // Notify other components in the same tab
            window.dispatchEvent(new CustomEvent('order-completed'));
            announcementService.emit(`✅ 訂單 ${order.orderNumber} 已支付成功！快去開始你的學習旅程吧。`, '前往挑戰地圖', `/journeys/${order.courseSlug || 'software-design-pattern'}/roadmap`);
        } else {
            alert('支付失敗，請確認後端是否連線正確');
        }
    };

    const handleCancelOrder = async (order: Order) => {
        if (!confirm(`確定要取消課程「${order.courseName}」的訂單嗎？`)) return;

        const success = await orderService.cancelOrder(order.orderNumber);
        if (success) {
            await loadOrders();
            window.dispatchEvent(new CustomEvent('order-completed'));
            toast.success(`訂單 ${order.orderNumber} 已取消`);
        } else {
            alert('取消失敗，請確認後端是否連線正確');
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PAID':
                return {
                    label: '已完成',
                    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                    icon: <CheckCircle2 size={14} className="text-emerald-500" />
                };
            case 'CANCELLED':
                return {
                    label: '已取消',
                    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
                    icon: <XCircle size={14} className="text-rose-500" />
                };
            default:
                return {
                    label: '待付款',
                    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                    icon: <Clock size={14} className="text-amber-500" />
                };
        }
    };

    if (loading) {
        return (
            <section className="border border-border-ui rounded-xl bg-card p-8 min-h-[300px] flex items-center justify-center transition-colors duration-300">
                <div className="text-slate-500 animate-pulse">載入中...</div>
            </section>
        );
    }

    return (
        <section className="border border-border-ui rounded-xl bg-card p-8 flex flex-col transition-colors duration-300">
            <div className="flex items-center gap-3 mb-8">
                <Receipt className="text-white" size={28} />
                <h2 className="text-2xl font-bold text-primary">訂單紀錄</h2>
            </div>

            {orders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 min-h-[150px]">
                    目前沒有訂單紀錄
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {orders.map((order) => {
                        const config = getStatusConfig(order.status);
                        return (
                            <div
                                key={order.id}
                                className="bg-background/50 border border-border-ui/50 rounded-xl p-6 relative group transition-all hover:border-primary/50"
                            >
                                {/* Status Badge */}
                                <div className={cn(
                                    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                                    config.color
                                )}>
                                    {config.icon}
                                    {config.label}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                    {/* Left Side */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">訂單編號</p>
                                            <p className="font-mono text-sm text-white">{order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">課程名稱</p>
                                            <p className="text-lg font-bold text-white">{order.courseName}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">金額</p>
                                            <p className="text-2xl font-black text-white">
                                                <span className="text-sm font-normal mr-1">NT$</span>
                                                {order.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="space-y-4 flex flex-col justify-between">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">
                                                    {order.status === 'PAID' ? '付款日期' : '付款截止日期'}
                                                </p>
                                                <p className="text-sm text-slate-200">
                                                    {new Date(order.status === 'PAID' ? (order.paidAt || order.createdAt) : order.paymentDeadline).toLocaleDateString('zh-TW', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {order.status === 'PENDING' && (
                                            <div className="flex flex-col gap-2 mt-4 md:items-end w-full md:w-auto">
                                                <button
                                                    onClick={() => handleCompleteOrder(order)}
                                                    className="w-full md:w-auto bg-primary hover:opacity-90 text-black font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary/10"
                                                >
                                                    立即完成訂單
                                                </button>
                                                <button
                                                    onClick={() => handleCancelOrder(order)}
                                                    className="w-full md:w-auto bg-transparent border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 font-bold py-2 px-6 rounded-lg transition-all"
                                                >
                                                    取消訂單
                                                </button>
                                            </div>
                                        )}

                                        {order.status === 'CANCELLED' && (
                                            <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-400/5 p-2 rounded border border-rose-400/10">
                                                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                                <span>備註：{order.remark || '期限內未完成付款'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </section>
    );
}
