'use client';

import React from 'react';
import Link from 'next/link';
import { AnnouncementData } from '@/services/announcementService';

interface NotificationDropdownProps {
    notifications: AnnouncementData[];
    onClose: () => void;
    onItemClick: (notification: AnnouncementData) => void;
}

export default function NotificationDropdown({ notifications, onClose, onItemClick }: NotificationDropdownProps) {
    return (
        <div className="absolute top-14 right-0 w-80 bg-[#1E293B] border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-slate-100 font-bold text-lg">Notifications</h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-200 text-sm"
                >
                    關閉
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                <div className="p-3 bg-slate-800/50">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unread</span>
                </div>

                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        沒有新通知
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => onItemClick(notification)}
                                className="p-4 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0 transition-colors group"
                            >
                                <div className="text-slate-200 text-sm mb-2 leading-relaxed group-hover:text-white">
                                    {notification.message}
                                </div>
                                <div className="text-slate-500 text-xs">
                                    於 {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('zh-TW', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : '最近'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 text-center border-t border-slate-700">
                <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                    查看全部通知
                </button>
            </div>
        </div>
    );
}
