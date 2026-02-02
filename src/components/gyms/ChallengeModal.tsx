// components/gym/ChallengeModal.tsx
import React from 'react';
import { X, Zap, Dumbbell } from 'lucide-react';

export default function ChallengeModal({ challenges, onClose }: { challenges: any[], onClose: () => void }) {
    // JSON 中有 type: "INSTANT_CHALLENGE" (速戰速決) 和 "PRACTICAL_CHALLENGE" (實戰演練)

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-4xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-center text-yellow-400 mb-8">選擇挑戰模式</h2>

                <div className="grid grid-cols-2 gap-6">
                    {challenges.map((challenge) => {
                        const isInstant = challenge.type === 'INSTANT_CHALLENGE';
                        return (
                            <div
                                key={challenge.id}
                                className="border border-gray-700 bg-gray-800 rounded-lg p-6 hover:border-yellow-400 cursor-pointer transition-all hover:bg-gray-750 group"
                                onClick={() => {
                                    // TODO: Navigate to submission page or quiz page
                                    console.log("Selected challenge:", challenge.id);
                                }}
                            >
                                <div className="flex justify-center mb-4 text-yellow-400">
                                    {isInstant ? <Zap size={48} /> : <Dumbbell size={48} />}
                                </div>

                                <h3 className="text-xl font-bold text-center mb-4 group-hover:text-yellow-400">
                                    {isInstant ? "速戰速決" : "實戰演練"}
                                </h3>

                                <ul className="text-sm text-gray-300 space-y-2 mb-6">
                                    {isInstant ? (
                                        <>
                                            <li className="flex gap-2">✅ 馬上鍛鍊概念</li>
                                            <li className="flex gap-2">✅ 及早獲得 Mentor 詳細回饋</li>
                                            <li className="flex gap-2">✅ 不需要實作程式碼</li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="flex gap-2">✅ 深刻鍛鍊內化思路</li>
                                            <li className="flex gap-2">✅ 熟悉概念動手思考</li>
                                            <li className="flex gap-2">✅ 一對一 Code Review 掃除盲點</li>
                                        </>
                                    )}
                                </ul>

                                <div className="text-center text-blue-400 text-sm font-bold">
                                    ⌛ 在 {challenge.recommendDurationInDays || challenge.maxDurationInDays} 天內完成
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}