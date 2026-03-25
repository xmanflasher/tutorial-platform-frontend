"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, User, Briefcase, Rocket, Info, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';
import { userService, orderService } from '@/services';

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
    const [isSimulating, setIsSimulating] = useState(false);

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
            const completed = localStorage.getItem('onboarding_completed');
            if (completed) {
                handleComplete();
            } else {
                setStep('role-selection');
            }
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
                <div className="group relative">
                    <div className="absolute bottom-16 right-0 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 mb-2 flex flex-col gap-2 scale-95 group-hover:scale-100 origin-bottom-right">
                        <div className="bg-[#1a1c1e] border border-white/20 rounded-xl p-4 shadow-2xl w-64 backdrop-blur-md">
                            <div className="text-white font-bold text-sm mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                                <Rocket className="w-4 h-4 text-yellow-500" />
                                體驗助手 (Demo Mode)
                            </div>
                            {user ? (
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('onboarding_completed', 'false');
                                            window.location.reload();
                                        }}
                                        className="text-[11px] bg-blue-600/20 hover:bg-blue-600 text-blue-100 py-2 px-3 rounded-lg text-left transition-colors flex items-center justify-between"
                                    >
                                        <span>重啟功能導覽</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setIsSimulating(true);
                                            const toastId = toast.loading('正在觸發大批量完成訂單流程...');
                                            try {
                                                const freshOrders = await orderService.getUserOrders(user.id);
                                                const pendingOrders = freshOrders.filter((o: any) => o.status === 'PENDING');
                                                if (pendingOrders.length === 0) {
                                                    toast.info('沒有待處理的訂單', { id: toastId });
                                                    return;
                                                }
                                                for (const order of pendingOrders) {
                                                    await orderService.markAsPaid(order.orderNumber);
                                                }
                                                window.dispatchEvent(new CustomEvent('order-completed'));
                                                toast.success('所有待處理訂單已完成', { id: toastId });
                                                setTimeout(() => window.location.reload(), 2000);
                                            } catch (e) {
                                                toast.error('訂單處理失敗', { id: toastId });
                                            } finally {
                                                setIsSimulating(false);
                                            }
                                        }}
                                        disabled={isSimulating}
                                        className="text-[11px] bg-yellow-600/20 hover:bg-yellow-600 text-yellow-100 py-2 px-3 rounded-lg text-left transition-colors flex items-center justify-between disabled:opacity-50"
                                    >
                                        <span className="flex items-center gap-2">
                                            {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                            立即完成所有訂單 (Simulate)
                                        </span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setIsSimulating(true);
                                            const toastId = toast.loading('正在啟動「水球精靈」分析您的作品...');
                                            
                                            try {
                                                // 1. 偵測當前道館 ID (從網址或預設)
                                                const gymIdMatch = window.location.pathname.match(/\/gyms\/(\d+)/);
                                                const currentGymId = gymIdMatch ? parseInt(gymIdMatch[1]) : 0;
                                                
                                                if (!currentGymId) {
                                                    toast.error('請先進入特定道館頁面再執行精靈批改', { id: toastId });
                                                    return;
                                                }

                                                // 2. 優先嘗試後端模擬 API
                                                try {
                                                    const res = await apiRequest(`/gym-challenge-records/demo/simulate-correction/${currentGymId}`, { method: 'POST', silent: true });
                                                    if (res) {
                                                        toast.success('精靈已從雲端完成批改！請前往挑戰歷程查看。', { id: toastId });
                                                        setTimeout(() => window.location.reload(), 1500);
                                                        return;
                                                    }
                                                } catch (e) {
                                                    console.warn("[Simulation] Backend logic skipped or failed, falling back to local storage detection");
                                                }

                                                // 3. 本地暫存備援邏輯
                                                const localRecords = JSON.parse(localStorage.getItem('local_gym_records') || '[]');
                                                const targetIdx = localRecords.findLastIndex((r: any) => 
                                                    r.gymId === currentGymId && (r.status === 'REVIEWING' || r.status === 'SUBMITTED')
                                                );

                                                if (targetIdx !== -1) {
                                                    // 模擬隨機評語與評分
                                                    const templates = [
                                                        "## 水球導師的評價\n\n您的實作邏輯非常清晰！\n\n### 優點\n1. **結構編排優良**：成功將輸入轉為數字並進行完善檢查。\n2. **OOA 圖檔精準**：邏輯流程圖完整標註了狀態轉換。\n\n### 建議\n- 嘗試導入更多設計模式以增加擴充性。",
                                                        "## 水球潘的 Code Review\n\n不錯！這份作業展現了您對基礎語法的高度掌握。\n\n### 關鍵點點評\n- **變數命名**：符合語意，易於閱讀。\n- **錯誤處理**：考慮到了非數字輸入的例外狀況。\n\n### 挑戰任務\n- 能否嘗試使用更簡潔的 FP 風格重構這段邏輯？"
                                                    ];
                                                    const grades = ["SSS", "S", "A", "B"];
                                                    const rand = Math.floor(Math.random() * templates.length);
                                                    
                                                    localRecords[targetIdx] = {
                                                        ...localRecords[targetIdx],
                                                        status: 'SUCCESS',
                                                        feedback: templates[rand],
                                                        ratings: {
                                                            "1": grades[Math.floor(Math.random() * grades.length)],
                                                            "2": grades[Math.floor(Math.random() * grades.length)],
                                                            "3": grades[Math.floor(Math.random() * grades.length)],
                                                            "4": grades[Math.floor(Math.random() * grades.length)]
                                                        },
                                                        reviewedAt: Date.now()
                                                    };
                                                    
                                                    localStorage.setItem('local_gym_records', JSON.stringify(localRecords));
                                                    toast.success('精靈已針對您的「暫存作品」完成批改！', { id: toastId });
                                                    setTimeout(() => window.location.reload(), 2000);
                                                } else {
                                                    toast.error('找不到該道館待批改的紀錄。請先點擊「前往挑戰」並提交作品。', { id: toastId });
                                                }
                                            } catch (error: any) {
                                                console.error(error);
                                                toast.error('模擬失敗：' + error.message, { id: toastId });
                                            } finally {
                                                setIsSimulating(false);
                                            }
                                        }}
                                        disabled={isSimulating}
                                        className="text-[11px] bg-purple-600/20 hover:bg-purple-600 text-purple-100 py-2 px-3 rounded-lg text-left transition-colors flex items-center justify-between disabled:opacity-50"
                                    >
                                        <span className="flex items-center gap-2">
                                            {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                            水球精靈：快速批改 (Simulate Correction)
                                        </span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setIsSimulating(true);
                                            const toastId = toast.loading('正在請求後端完成獎勵任務...');
                                            try {
                                                const res = await apiRequest('/demo/complete-current-mission', { method: 'POST' });
                                                toast.success(typeof res === 'string' ? res : '任務已成功模擬完成', { id: toastId });
                                                setTimeout(() => window.location.reload(), 1500);
                                            } catch (error: any) {
                                                toast.error('後端模擬功能未就緒', { id: toastId });
                                                alert('提示：獎勵任務的完成邏輯強烈依賴後端資料庫。');
                                            } finally {
                                                setIsSimulating(false);
                                            }
                                        }}
                                        disabled={isSimulating}
                                        className="text-[11px] bg-green-600/20 hover:bg-green-600 text-green-100 py-2 px-3 rounded-lg text-left transition-colors flex items-center justify-between disabled:opacity-50"
                                    >
                                        <span className="flex items-center gap-2">
                                            {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                            完成當前獎勵任務
                                        </span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('確定要還原初始狀態嗎？這將清除所有本地紀錄。')) {
                                                localStorage.clear();
                                                window.location.reload();
                                            }
                                        }}
                                        className="text-[11px] bg-red-600/20 hover:bg-red-600 text-red-100 py-2 px-3 rounded-lg text-left transition-colors flex items-center justify-between"
                                    >
                                        <span className="flex items-center gap-2">還原初始狀態</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 text-center py-4 bg-white/5 rounded-lg border border-white/5">
                                    體驗助手需登入後才可使用
                                </div>
                            )}
                            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400">
                                {user ? '點擊按鈕可快速切換開發/演示狀態' : '請先登入以解鎖體驗助手功能'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={openGuide}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 relative"
                        title="閱讀導覽"
                    >
                        <div className="flex flex-col items-end mr-2 transition-all duration-300">
                            <span className="text-xs font-black bg-yellow-500 text-black px-2 py-0.5 rounded shadow-sm animate-bounce">水球精靈</span>
                            <span className="text-[10px] text-blue-100 font-bold drop-shadow-md">點我閱讀導覽</span>
                        </div>
                        <div className="relative">
                            <HelpCircle className="w-8 h-8" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1c1e] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
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

