'use client';

import React from 'react';
import Link from 'next/link';
import { Notification } from '@/services/notificationService';
import { Check } from 'lucide-react';

interface NotificationDropdownProps {
    notifications: Notification[];
    onClose: () => void;
    onItemClick: (notification: Notification) => void;
    onMarkAllRead?: () => void;
}

export default function NotificationDropdown({ 
    notifications, 
    onClose, 
    onItemClick,
    onMarkAllRead 
}: NotificationDropdownProps) {
    return (
        <div className="absolute top-14 right-0 w-80 bg-[#1E293B] border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-slate-100 font-bold text-sm tracking-wide flex items-center gap-2">
                    通知
                    {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {notifications.filter(n => !n.isRead).length}
                        </span>
                    )}
                </h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-200 text-xs"
                >
                    關閉
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        沒有任何通知
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => onItemClick(notification)}
                                className={`p-4 hover:bg-slate-800/80 cursor-pointer border-b border-slate-800 last:border-0 transition-colors group relative ${
                                    !notification.isRead ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''
                                }`}
                            >
                                {!notification.isRead && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                )}
                                <div className={`text-sm mb-1.5 leading-relaxed ${
                                    !notification.isRead ? 'text-slate-100 font-medium' : 'text-slate-400'
                                }`}>
                                    {notification.message}
                                </div>
                                <div className="text-slate-500 text-[10px] flex items-center justify-between">
                                    <span>
                                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString('zh-TW', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '最近'}
                                    </span>
                                    {notification.isRead && (
                                        <span className="flex items-center gap-1 opacity-60">
                                            <Check size={10} /> 已讀
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 text-center border-t border-slate-700 bg-slate-800/30">
                <button 
                    onClick={onMarkAllRead}
                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1 w-full"
                >
                    全部標記為已讀
                </button>
            </div>
        </div>
    );
}
