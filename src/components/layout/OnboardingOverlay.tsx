"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, User, Briefcase, Rocket, Info, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Step = 'role-selection' | 'guide' | 'completed';

interface GuideStep {
    title: string;
    description: string;
    image: string;
}

const GUIDE_STEPS: GuideStep[] = [
    {
        title: "訪客與權限差異",
        description: "作為訪客，您可以瀏覽公開課程與資訊。登入後，您將解鎖更多個人化功能，包括挑戰進度追蹤、作業提交與講師互動。",
        image: "/guide/step1.png"
    },
    {
        title: "Google Auth 登入",
        description: "使用 Google 帳號即可快速登入。登入後您的學習歷程將會被永久保存，並能與其他學員互動。",
        image: "/guide/step2.png"
    },
    {
        title: "課程閱讀與互動",
        description: "按照規畫閱讀課程。您可以隨時提交作業，講師會針對您的作品給予專業批改與回饋，助您快速成長。",
        image: "/guide/step3.png"
    },
    {
        title: "個人檔案與排行榜",
        description: "在個人檔案查看您的成就與等級。透過排行榜與其他優秀人才競爭，展現您的實力！",
        image: "/guide/step4.png"
    },
    {
        title: "挑戰地圖與歷程",
        description: "挑戰地圖引導您的學習路徑。挑戰歷程記錄了您在學院中的每一個里程碑，見證您的進化。",
        image: "/guide/step5.png"
    },
    {
        title: "獎勵任務",
        description: "完成特定任務即可獲得獎勵！這些任務旨在鼓勵您持續學習並探索學院的各項核心功能。",
        image: "/guide/step6.png"
    }
];

export default function OnboardingOverlay() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [step, setStep] = useState<Step>('role-selection');
    const [guideIndex, setGuideIndex] = useState(0);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    useEffect(() => {
        const completed = localStorage.getItem('onboarding_completed');
        const role = localStorage.getItem('user_role');

        if (role) {
            setSelectedRole(role);
        }

        if (!completed) {
            setIsVisible(true);
        } else {
            setIsMinimized(true);
        }
    }, []);

    // 當使用者登入且有選擇角色但尚未同步時，進行同步
    useEffect(() => {
        if (user && user.id && selectedRole) {
            const isSynced = localStorage.getItem(`role_synced_${user.id}`);
            if (!isSynced) {
                syncRoleToBackend(user.id.toString(), selectedRole);
            }
        }
    }, [user, selectedRole]);

    const syncRoleToBackend = async (userId: string, role: string) => {
        const success = await userService.updateUserRole(userId, role);
        if (success) {
            localStorage.setItem(`role_synced_${userId}`, 'true');
            console.log("[Onboarding] Role synced to database");
        }
    };

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
        localStorage.setItem('user_role', role);

        if (user && user.id) {
            syncRoleToBackend(user.id.toString(), role);
        }

        setStep('guide');
    };

    const handleComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        setIsVisible(false);
        setIsMinimized(true);
        setStep('completed');
    };

    const openGuide = () => {
        setStep('guide');
        setGuideIndex(0);
        setIsVisible(true);
        setIsMinimized(false);
    };

    const nextGuideStep = () => {
        if (guideIndex < GUIDE_STEPS.length - 1) {
            setGuideIndex(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const prevGuideStep = () => {
        if (guideIndex > 0) {
            setGuideIndex(prev => prev - 1);
        } else {
            // 如果是從精靈打開的，不回退到角色選擇
            const completed = localStorage.getItem('onboarding_completed');
            if (completed) {
                handleComplete();
            } else {
                setStep('role-selection');
            }
        }
    };

    // 桌面精靈 (縮小狀態)
    if (isMinimized) {
        return (
            <button
                onClick={openGuide}
                className="fixed bottom-6 right-6 z-[9999] group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
                title="閱讀導覽"
            >
                <div className="flex flex-col items-end mr-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <span className="text-xs font-bold bg-black/20 px-2 py-0.5 rounded">水球精靈</span>
                    <span className="text-[10px] text-blue-100">點我閱讀導覽</span>
                </div>
                <div className="relative">
                    <HelpCircle className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                </div>
            </button>
        );
    }

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1c1e] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                {/* 關閉按鈕，僅在已完成過導覽時顯示，或是角色選擇後 */}
                <button
                    onClick={handleComplete}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {step === 'role-selection' && (
                    <div className="p-8 text-center pt-12">
                        <h2 className="text-3xl font-bold text-white mb-2">歡迎進入水球軟體學院</h2>
                        <p className="text-gray-400 mb-8">請告訴我們您的身份，以便為您提供更好的體驗。</p>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'hr', label: '人資', icon: Briefcase, color: 'text-blue-400' },
                                { id: 'tech-lead', label: '技術主管', icon: User, color: 'text-purple-400' },
                                { id: 'startup', label: '新創', icon: Rocket, color: 'text-orange-400' },
                                { id: 'other', label: '其他', icon: Info, color: 'text-gray-400' },
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.label)}
                                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                                >
                                    <role.icon className={cn("w-8 h-8 mb-3 group-hover:scale-110 transition-transform", role.color)} />
                                    <span className="text-white font-medium">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(step === 'guide' || step === 'completed') && (
                    <div className="flex flex-col h-[500px]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 pt-8">
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-wider">功能導覽</h2>
                                <p className="text-xs text-blue-400 mt-1 font-medium">STEP {guideIndex + 1} OF {GUIDE_STEPS.length}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                            <div className="w-full aspect-video bg-gray-800 rounded-lg mb-6 overflow-hidden border border-white/5 relative group">
                                <img
                                    src={GUIDE_STEPS[guideIndex].image}
                                    alt={GUIDE_STEPS[guideIndex].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450/1a1c1e/ffffff?text=' + encodeURIComponent(GUIDE_STEPS[guideIndex].title);
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{GUIDE_STEPS[guideIndex].title}</h3>
                                </div>
                            </div>
                            <p className="text-gray-300 text-center leading-relaxed max-w-lg">
                                {GUIDE_STEPS[guideIndex].description}
                            </p>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-between items-center bg-white/5">
                            <button
                                onClick={prevGuideStep}
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>上一步</span>
                            </button>

                            <div className="flex gap-1.5">
                                {GUIDE_STEPS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            idx === guideIndex ? "w-6 bg-blue-500" : "bg-white/20"
                                        )}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextGuideStep}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                <span>{guideIndex === GUIDE_STEPS.length - 1 ? "完成導覽" : "下一步"}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
