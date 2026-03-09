"use client";

import React from "react";
import { X, PenLine } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    feedback: string;
}

const FeedbackModal = ({ isOpen, onClose, title, feedback }: FeedbackModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* 彈窗本體 */}
            <div className="relative bg-[#161b22] w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#1c2128]">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PenLine className="w-5 h-5 text-yellow-500" />
                        {title} - 完整評語
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar bg-[#0d0e11]">
                    <MarkdownRenderer content={feedback} />
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
