'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { Image as ImageIcon } from 'lucide-react';
import { orderStore } from '@/lib/orderStore';
import { useAuth } from '@/context/AuthContext';


const getButtonStyle = (style: 'solid' | 'outline' | 'disabled') => {
  switch (style) {
    case 'solid':
      return 'bg-primary text-black hover:opacity-90 border border-transparent';
    case 'outline':
      return 'bg-transparent text-primary border border-primary hover:bg-primary/10';
    case 'disabled':
      return 'bg-slate-700 text-slate-400 cursor-not-allowed border border-transparent';
    default:
      return '';
  }
};

export default function CourseCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const [isOwned, setIsOwned] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const checkOwnership = () => {
      // 只有登入後才讀取擁有權狀態，防止訪客看到殘留的 localStorage 資料
      if (!user) {
        setIsOwned(false);
        setIsPending(false);
        return;
      }
      setIsOwned(orderStore.isCourseOwned(course.slug));
      setIsPending(orderStore.hasPendingOrder(course.slug));
    };

    checkOwnership();

    window.addEventListener('storage', checkOwnership);
    // Also listen for custom events if we are in the same tab
    window.addEventListener('order-completed', checkOwnership);

    return () => {
      window.removeEventListener('storage', checkOwnership);
      window.removeEventListener('order-completed', checkOwnership);
    };
  }, [course.slug, user]);

  // Override labels and buttons if owned
  const displayStatusLabel = isOwned ? '已擁有' : course.statusLabel;
  const primaryAction = isOwned
    ? { text: '開始上課', href: `/journeys/${course.slug}`, style: 'solid' as const }
    : course.primaryAction;

  return (
    <div className="flex flex-col bg-card border border-border-ui rounded-xl overflow-hidden hover:border-primary/50 transition-colors duration-300 shadow-lg relative group h-full">

      {/* 1. 圖片區域 */}
      <div className="h-48 w-full bg-background/50 relative overflow-hidden group">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-card to-background">
            <ImageIcon size={48} className="text-slate-600 mb-2 opacity-50" />
            <span className="text-xs text-slate-600 font-mono tracking-widest uppercase opacity-50">NO IMAGE</span>
          </div>
        )}

        {/* 狀態標籤 (懸浮在圖片右上角) */}
        {displayStatusLabel && (
          <div className={cn(
            isOwned ? "bg-emerald-500 text-white" : "bg-primary text-black"
          )}>
            {displayStatusLabel}
          </div>
        )}
      </div>

      {/* 2. 內容區域 */}
      <div className="p-5 flex-1 flex flex-col">
        {/* 標題 (限制 2 行，防止撐高) */}
        <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2 h-14">
          {course.title}
        </h3>

        {/* 作者 */}
        <div className="mb-3">
          <span className="text-primary text-sm font-bold">
            {course.author}
          </span>
        </div>

        {/* 描述 (限制 3 行) */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {course.description}
        </p>

        {/* 3. 底部區塊 (Coupon + 按鈕) */}
        <div className="mt-auto space-y-3">

          {/* 折價券 */}
          {course.couponText && !isOwned ? (
            <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2 px-3 rounded text-center truncate">
              {course.couponText}
            </div>
          ) : (
            // 佔位，保持卡片高度一致 or 顯示已擁有文字
            <div className="h-[34px]" />
          )}

          {/* 按鈕群組 */}
          <div className={cn("grid gap-3", isOwned ? "grid-cols-1" : "grid-cols-2")}>
            <Link
              href={primaryAction.href}
              className={`py-2 text-center text-sm font-bold rounded transition-all flex items-center justify-center truncate px-1 ${getButtonStyle(primaryAction.style)}`}
            >
              {primaryAction.text}
            </Link>

            {!isOwned && (
              isPending ? (
                <Link
                  href="/users/me/orders"
                  className={`py-2 text-center text-sm font-bold rounded transition-all flex items-center justify-center truncate px-1 bg-amber-500 text-black hover:bg-amber-600`}
                >
                  前往付款
                </Link>
              ) : course.secondaryAction ? (
                <Link
                  href={course.secondaryAction.href}
                  className={`py-2 text-center text-sm font-bold rounded transition-all flex items-center justify-center truncate px-1 bg-primary text-black hover:opacity-90`}
                >
                  {course.secondaryAction.text}
                </Link>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
