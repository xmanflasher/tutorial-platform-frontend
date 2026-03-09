"use client";

import React, { useState } from "react";
import { ScrollText, StickyNote, PenLine, ChevronRight as ChevronRightIcon, BookOpen } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import FeedbackModal from "./FeedbackModal";

interface FeedbackCardProps {
    feedback?: string;
    title: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const FeedbackCard = ({ feedback, title, isCollapsed, onToggleCollapse }: FeedbackCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!feedback) return (
        <div className="bg-[#161b22] border border-gray-800 rounded-xl h-full flex flex-col items-center justify-center p-8 text-gray-500 gap-4">
            <ScrollText className="w-12 h-12 opacity-20" />
            <p className="italic">尚未收到導師回饋</p>
        </div>
    );

    // 收合狀態 (Sidebar 模式)
    if (isCollapsed) {
        return (
            <div
                onClick={onToggleCollapse}
                className="bg-[#161b22] border border-gray-800 rounded-xl cursor-pointer hover:bg-[#1f242c] hover:border-yellow-500/50 transition-all flex flex-col items-center justify-center h-full w-full gap-4 group py-4"
                title="展開評語"
            >
                <StickyNote className="w-6 h-6 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                <div className="text-xs text-gray-500 group-hover:text-gray-300 writing-mode-vertical tracking-widest font-bold">
                    顯示評語
                </div>
            </div>
        );
    }

    // 展開狀態 (預覽模式)
    return (
        <>
            <div className="bg-[#161b22] rounded-xl shadow-lg border border-gray-800 overflow-hidden h-full flex flex-col relative group">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1c2128] shrink-0">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <PenLine className="w-4 h-4 text-yellow-500" /> 導師評語
                    </h4>
                    <button
                        onClick={onToggleCollapse}
                        className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="收起評語"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Preview Area (固定高度 + 隱藏溢出) */}
                <div className="relative flex-1 overflow-hidden bg-[#0d0e11] p-6">
                    {/* Markdown 內容渲染 */}
                    <div className="h-full">
                        <MarkdownRenderer content={feedback} />
                    </div>

                    {/* 底部漸層遮罩與按鈕 */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/90 to-transparent flex items-end justify-center pb-8 pointer-events-none">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="pointer-events-auto flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition-colors shadow-lg hover:shadow-yellow-500/20"
                        >
                            <BookOpen className="w-4 h-4" />
                            閱讀完整內容
                        </button>
                    </div>
                </div>
            </div>

            {/* 完整內容彈窗 */}
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                feedback={feedback}
            />
        </>
    );
};

export default FeedbackCard;
