'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Announcement } from '@/types';
import { announcementService } from '@/services/announcementService';

export default function AnnouncementBar({ data: initialData }: { data: Announcement }) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(initialData);

  useEffect(() => {
    // Subscribe to dynamic announcements
    const unsubscribe = announcementService.subscribe((newAnnouncement) => {
      if (newAnnouncement) {
        setAnnouncement({
          id: newAnnouncement.id,
          message: newAnnouncement.message,
          linkText: newAnnouncement.linkText || '',
          linkHref: newAnnouncement.linkHref || ''
        });
      }
    });

    return () => { unsubscribe(); };
  }, []);

  if (!announcement) return null;

  return (
    <div className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="text-slate-200 text-sm md:text-base font-medium text-center md:text-left">
        {announcement.message}
      </div>
      {announcement.linkHref && (
        <Link
          href={announcement.linkHref}
          className="px-6 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded transition-colors whitespace-nowrap"
        >
          {announcement.linkText || "了解詳情"}
        </Link>
      )}
    </div>
  );
}