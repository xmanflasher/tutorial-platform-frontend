import React from "react";
import Link from "next/link";

export default function MarketingBanner() {
    return (
        <div className="relative w-full mb-6">
            <div className="rounded-lg border border-yellow-500/30 shadow-sm p-4 bg-[#161b22] text-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <Link
                                className="text-sm md:text-base text-left underline decoration-yellow-500/50 hover:text-yellow-400 transition-colors"
                                href="/journeys/software-design-pattern/chapters/8/missions/1"
                            >
                                將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！
                            </Link>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-yellow-500 text-black hover:bg-yellow-400 h-9 rounded-md px-4 shrink-0">
                                前往
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}