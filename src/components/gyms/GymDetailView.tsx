"use client";

import React, { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import ChallengeModal from './ChallengeModal';
import { FileText, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { GymDetailData, LessonDetail } from '@/types';

interface GymDetailViewProps {
    gymData: GymDetailData;
}

export default function GymDetailView({ gymData }: GymDetailViewProps) {
    // 1. 初始化狀態，使用傳入的實體 Lesson 列表
    const [lessons, setLessons] = useState<(LessonDetail & { isFinished?: boolean })[]>(
        gymData.lessons || []
    );
    const [selectedLesson, setSelectedLesson] = useState<(LessonDetail & { isFinished?: boolean }) | null>(
        lessons[0] || null
    );
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

    // 邏輯判斷：是否完成所有課程
    const allLessonsFinished = lessons.length === 0 || lessons.every(l => l.isFinished);

    const handleVideoEnded = (lessonId: number) => {
        setLessons(prev =>
            prev.map(l => l.id === lessonId ? { ...l, isFinished: true } : l)
        );
    };

    const handleArticleFinished = (lessonId: number) => {
        setLessons(prev =>
            prev.map(l => l.id === lessonId ? { ...l, isFinished: true } : l)
        );
    };

    // 輔助函式：從 LessonDetail 的 content 陣列中解析資料
    const getLessonContent = (lesson: LessonDetail | null) => {
        if (!lesson || !lesson.content || lesson.content.length === 0) return null;
        const mainContent = lesson.content[0];
        return {
            url: mainContent.url,
            text: mainContent.content,
            type: mainContent.type?.toLowerCase()
        };
    };

    const currentContent = getLessonContent(selectedLesson);

    return (
        <div className="min-h-screen bg-[#0d0e11] text-white p-6 flex gap-6">
            {/* 左側：道館資訊 & 列表 */}
            <div className="w-1/3 flex flex-col gap-6">
                <div className="bg-yellow-400 text-black p-6 rounded-lg shadow-lg">
                    <div className="text-xs font-bold bg-black/20 w-fit px-2 py-1 rounded mb-2">
                        {gymData.code} 道館
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{gymData.name}</h1>
                    <p className="text-sm opacity-80 line-clamp-3">{gymData.description}</p>
                </div>

                <div className="bg-[#161b22] p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">🏆 挑戰說明</h2>

                    <div className="mb-6">
                        <h3 className="text-gray-300 font-bold mb-2">相關課程：</h3>
                        {lessons.length > 0 ? (
                            <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {lessons.map(lesson => (
                                    <li
                                        key={lesson.id}
                                        className={`flex justify-between items-center p-3 rounded cursor-pointer transition-colors
                                        ${selectedLesson?.id === lesson.id ? 'bg-[#1f242c] border-l-4 border-yellow-400' : 'hover:bg-[#1f242c]'}`}
                                        onClick={() => setSelectedLesson(lesson)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {lesson.type?.toLowerCase() === 'video' ? <PlayCircle size={18} className="text-blue-400" /> : <FileText size={18} className="text-green-400" />}
                                            <span className="text-sm truncate font-medium">
                                                {lesson.name}
                                            </span>
                                        </div>
                                        {lesson.isFinished && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm italic py-4">目前無相關課程，可直接開始挑戰。</p>
                        )}
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <div className="mb-4">
                            <p className="font-bold text-white">通關獎勵</p>
                            <span className="text-xs text-gray-400">+{gymData.reward?.exp || 0} 經驗值</span>
                        </div>

                        <button
                            onClick={() => setIsChallengeModalOpen(true)}
                            disabled={!allLessonsFinished}
                            className={`w-full py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2
                                ${allLessonsFinished
                                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                            `}
                        >
                            {!allLessonsFinished && <Lock size={18} />}
                            {allLessonsFinished ? "開始挑戰" : "請完成上方課程"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 右側：內容渲染區 */}
            <div className="w-2/3 bg-[#161b22] rounded-lg border border-gray-800 overflow-hidden flex flex-col">
                {selectedLesson && currentContent ? (
                    <>
                        <div className="p-4 border-b border-gray-800 bg-[#0d0e11] flex justify-between items-center">
                            <h2 className="text-xl font-bold">{selectedLesson.name}</h2>
                            {selectedLesson.videoLength && (
                                <span className="text-xs text-gray-500 font-mono">{selectedLesson.videoLength}</span>
                            )}
                        </div>
                        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                            {currentContent.type === 'video' ? (
                                <VideoPlayer
                                    url={currentContent.url || ""}
                                    onEnded={() => handleVideoEnded(selectedLesson.id)}
                                    onProgress={() => { }}
                                />
                            ) : (
                                <div className="w-full h-full p-10 overflow-y-auto custom-scrollbar bg-[#161b22]">
                                    <article className="prose prose-invert max-w-none prose-yellow">
                                        {/* 這裡假設後端傳來的是 Markdown 字串，若已是 HTML 則用 dangerouslySetInnerHTML */}
                                        <div dangerouslySetInnerHTML={{ __html: currentContent.text || "" }} />
                                    </article>
                                    {!selectedLesson.isFinished && (
                                        <div className="mt-12 text-center">
                                            <button
                                                onClick={() => handleArticleFinished(selectedLesson.id)}
                                                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-transform active:scale-95"
                                            >
                                                我已閱讀完畢
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-4">
                        <PlayCircle size={64} className="opacity-10" />
                        <p className="text-lg">請選擇一個單元開始學習</p>
                    </div>
                )}
            </div>

            {/* 挑戰視窗 */}
            {isChallengeModalOpen && (
                <ChallengeModal
                    challenges={gymData.challenges}
                    onClose={() => setIsChallengeModalOpen(false)}
                />
            )}
        </div>
    );
}