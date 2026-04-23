"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Announcement } from "@/types";
import { announcementService } from "@/services/announcementService";
import { ArrowRight } from "lucide-react";

interface MarketingBannerProps {
    initialData?: Announcement;
}

export default function MarketingBanner({ initialData }: MarketingBannerProps) {
    const [announcement, setAnnouncement] = useState<Announcement | null>(initialData || null);

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
        <div className="px-4 pt-4 max-w-7xl mx-auto w-full">
            <div className="relative w-full mb-6">
                <div className="rounded-lg border border-primary/30 shadow-lg shadow-black/20 p-4 bg-[#161b22] text-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <p className="text-sm md:text-base text-left font-medium">
                                    {announcement.message}
                                </p>
                                {announcement.linkHref && (
                                    <Link
                                        href={announcement.linkHref}
                                        className="bg-primary text-black font-bold px-6 py-2 rounded hover:bg-primary transition-all shrink-0 flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20"
                                    >
                                        {announcement.linkText || "前往"} <ArrowRight size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}