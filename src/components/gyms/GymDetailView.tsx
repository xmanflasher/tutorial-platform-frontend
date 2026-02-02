"use client";

import React, { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import ChallengeModal from './ChallengeModal';
import { Loader2, FileText, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { gymService } from '@/services';
import { GymDetailData } from '@/types';

export default function GymDetailView({ gymId }: { gymId: string }) {
    const [gymData, setGymData] = useState<GymDetailData | null>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const data = await gymService.getGymDetail(gymId);
                if (data) {
                    setGymData(data);
                    // 只要 data.lessons 存在，就更新 lessons 狀態
                    const lessonList = data.lessons || [];
                    setLessons(lessonList);

                    // 如果有課程，預設選中第一課
                    if (lessonList.length > 0) {
                        setSelectedLesson(lessonList[0]);
                    }
                }
            } catch (error) {
                console.error("載入道館詳情失敗:", error);
            } finally {
                setLoading(false);
            }
        };

        if (gymId) initData();
    }, [gymId]);

    // ★ 修改點：如果沒有課程，或是所有課程都完成，就允許挑戰
    const allLessonsFinished = lessons.length === 0 || lessons.every(l => l.isFinished);

    const handleVideoEnded = async (lessonId: string) => {
        setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, isFinished: true } : l));
    };

    const handleArticleFinished = (lessonId: string) => {
        setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, isFinished: true } : l));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center text-white">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );
    }

    // ★ 修改點：只判斷 gymData，不判斷 selectedLesson
    if (!gymData) {
        return (
            <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center text-gray-500">
                找不到道館資料
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0e11] text-white p-6 flex gap-6">
            {/* 左側：道館資訊 & 挑戰入口 */}
            <div className="w-1/3 flex flex-col gap-6">
                <div className="bg-yellow-400 text-black p-6 rounded-lg shadow-lg">
                    <div className="text-xs font-bold bg-black/20 w-fit px-2 py-1 rounded mb-2">{gymData.code} 道館</div>
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
                                        className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors
                                        ${selectedLesson?.id === lesson.id ? 'bg-[#1f242c] border-l-4 border-yellow-400' : 'hover:bg-[#1f242c]'}`}
                                        onClick={() => setSelectedLesson(lesson)}
                                    >
                                        <span className="flex items-center gap-2 text-sm">
                                            {lesson.type?.toLowerCase() === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                            {lesson.name || lesson.title}
                                        </span>
                                        {lesson.isFinished && <CheckCircle size={16} className="text-green-500" />}
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
                            className={`w-full py-3 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2
                                ${allLessonsFinished
                                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                            `}
                        >
                            {!allLessonsFinished && <Lock size={18} />}
                            {allLessonsFinished ? "開始挑戰" : "請先完成所有相關課程"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 右側：內容區 (防禦性渲染) */}
            <div className="w-2/3 bg-[#161b22] rounded-lg border border-gray-800 overflow-hidden flex flex-col">
                {selectedLesson ? (
                    <>
                        <div className="p-4 border-b border-gray-800 bg-[#0d0e11]">
                            <h2 className="text-xl font-bold">{selectedLesson.name || selectedLesson.title}</h2>
                        </div>
                        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                            {selectedLesson.type?.toLowerCase() === 'video' ? (
                                <VideoPlayer
                                    url={selectedLesson.videoUrl || ""}
                                    onEnded={() => handleVideoEnded(selectedLesson.id)}
                                    onProgress={() => { }}
                                />
                            ) : (
                                <div className="w-full h-full p-8 overflow-y-auto custom-scrollbar">
                                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedLesson.content || "" }} />
                                    {!selectedLesson.isFinished && (
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={() => handleArticleFinished(selectedLesson.id)}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full transition-colors"
                                            >
                                                標記為已讀
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2">
                        <PlayCircle size={48} className="opacity-20" />
                        <p>選擇左側課程開始學習</p>
                    </div>
                )}
            </div>

            {isChallengeModalOpen && (
                <ChallengeModal
                    challenges={gymData.challenges}
                    onClose={() => setIsChallengeModalOpen(false)}
                />
            )}
        </div>
    );
}