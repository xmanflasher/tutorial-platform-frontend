'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { Image as ImageIcon } from 'lucide-react';
import { orderStore } from '@/lib/orderStore';
import { useAuth } from '@/context/AuthContext';

export default function CourseCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkOwnership = (reason: string = 'init') => {
      if (!user) {
        setIsOwned(false);
        setIsPending(false);
        return;
      }
      const owned = orderStore.isCourseOwned(course.slug);
      const pending = orderStore.hasPendingOrder(course.slug);
      console.log(`[CourseCard][${course.slug}] checkOwnership triggered by: ${reason}`, { owned, pending });
      setIsOwned(owned);
      setIsPending(pending);
    };

    checkOwnership('mount');
    const storageHandler = () => checkOwnership('storage-event');
    const orderHandler = () => checkOwnership('order-completed-event');

    window.addEventListener('storage', storageHandler);
    window.addEventListener('order-completed', orderHandler);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('order-completed', orderHandler);
    };
  }, [course.slug, user]);

  const handlePrimaryClick = (e: React.MouseEvent) => {
    // 只有在未登入且未擁有時才攔截跳轉
    if (!user && !isOwned) {
      e.preventDefault();
      console.log("[CourseCard] Visitor clicked buy, triggering login modal");
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  };

  // 1. SSR 骨架 (防止 Hydration Mismatch)
  if (!mounted) {
    return (
      <div className="flex flex-col bg-card border border-border-ui rounded-xl overflow-hidden h-full animate-pulse">
        <div className="h-48 w-full bg-slate-800" />
        <div className="p-5 flex-1 space-y-4">
          <div className="h-6 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="h-20 bg-slate-800 rounded w-full" />
        </div>
      </div>
    );
  }

  const displayStatusLabel = isOwned ? '已擁有' : (isPending ? '待付款' : course.statusLabel);

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

        {/* 狀態標籤 */}
        {displayStatusLabel && (
          <div className={cn(
            "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl z-10",
            isOwned ? "bg-emerald-500 text-white" : (isPending ? "bg-amber-500 text-black" : "bg-primary text-black")
          )}>
            {displayStatusLabel}
          </div>
        )}
      </div>

      {/* 2. 內容區域 */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2 h-14">
          {course.title}
        </h3>

        <div className="mb-3">
          <span className="text-primary text-sm font-bold">
            {course.author}
          </span>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {course.description}
        </p>

        <div className="mt-auto space-y-3">
          {course.couponText && !isOwned ? (
            <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2 px-3 rounded text-center truncate">
              {course.couponText}
            </div>
          ) : (
            <div className="h-[34px]" />
          )}

          {/* 按鈕群組 (遵循 SA-05.1 狀態機) */}
          <div className={cn("grid gap-3", isOwned ? "grid-cols-1" : "grid-cols-2")}>
            {isOwned ? (
              <Link
                href={`/journeys/${course.slug}`}
                className="py-2 text-center text-sm font-bold rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center"
              >
                開始上課
              </Link>
            ) : (
              <>
                {isPending ? (
                  <Link
                    href="/users/me/orders"
                    className="py-2 text-center text-sm font-bold rounded bg-amber-500 text-black hover:bg-amber-600 transition-all flex items-center justify-center truncate px-1"
                  >
                    前往付款
                  </Link>
                ) : (
                  <Link
                    href={`/journeys/${course.slug}/orders`}
                    onClick={handlePrimaryClick}
                    className="py-2 text-center text-sm font-bold rounded bg-primary text-black hover:opacity-90 transition-all flex items-center justify-center truncate px-1"
                  >
                    立刻購買
                  </Link>
                )}

                <Link
                  href={`/journeys/${course.slug}`}
                  className="py-2 text-center text-sm font-bold rounded border border-primary text-primary hover:bg-primary/10 transition-all flex items-center justify-center truncate px-1"
                >
                  詳細內容
                </Link>
              </>
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
