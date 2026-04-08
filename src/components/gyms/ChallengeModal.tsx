"use client";

import React, { useState, useEffect } from 'react';
import { X, Zap, Dumbbell, ChevronRight, Upload, Loader2, CheckCircle2, History, AlertCircle, Hourglass } from 'lucide-react';
import { toast } from 'sonner';
import { recordService } from '@/services/recordService';
import { useJourney } from '@/context/JourneyContext';
import { useAuth } from '@/context/AuthContext';

type Stage = 'SELECT' | 'DETAILS' | 'SUBMISSION' | 'SUCCESS';
type ChallengeType = 'INSTANT' | 'PRACTICAL';

interface ChallengeModalProps {
    gymId: number;
    challenges: any[];
    onClose: () => void;
}

export default function ChallengeModal({ gymId, challenges, onClose }: ChallengeModalProps) {
    const { user } = useAuth();
    const { activeJourney } = useJourney();
    const [stage, setStage] = useState<Stage>('SELECT');
    const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [readyFiles, setReadyFiles] = useState<Record<string, boolean>>({});
    const [existingRecords, setExistingRecords] = useState<any[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(true);
    const [filesData, setFilesData] = useState<Record<string, string>>({});

    // 從當前旅程中找到該道館的完整資訊 (以取得 chapterId)
    const currentGym = activeJourney.gyms?.find(g => g.id === gymId);
    const journeyId = activeJourney.id;
    const chapterId = currentGym?.chapterId || 0;
    const userId = user?.id || 0;

    // 取得當前選擇的挑戰 ID (暫時取第一個，實務上可根據 selectedType 篩選)
    const practicalChallenge = challenges?.find(c => c.type === 'PRACTICAL_CHALLENGE' || c.type === 'PRACTICAL');
    const instantChallenge = challenges?.find(c => c.type === 'INSTANT_CHALLENGE' || c.type === 'INSTANT');

    // 針對 javascript-basics-140 (假設 gymId 601, 602 等) 的題目設計
    const isJSBasics = gymId >= 600 && gymId < 700;

    // 初始化狀態與獲取歷史紀錄
    useEffect(() => {
        // 恢復暫存狀態限制：Demo 模式下圖片改存在 State，故初始時 readyFiles 為空
        setReadyFiles({});
        setFilesData({});

        // 獲取歷史紀錄
        const fetchRecords = async () => {
            try {
                const records = await recordService.getUserGymRecords();
                setExistingRecords(records);
            } catch (err) {
                console.error("Failed to fetch records", err);
            } finally {
                setIsLoadingRecords(false);
            }
        };
        fetchRecords();
    }, [gymId]);

    // 判斷當前道館各挑戰類型的紀錄
    // 1. 實作挑戰 (PRACTICAL)
    const practicalRecord = existingRecords?.find(r => r.gymId === gymId && 
        (r.challengeType === 'PRACTICAL_CHALLENGE' || r.gymChallengeId === practicalChallenge?.id));
    
    // 如果有附帶 submission 資料，才是真正的「已交件」；否則只是「已開始(預約)」
    const hasPracticalSubmission = practicalRecord && 
        ['SUBMITTED', 'REVIEWING', 'PASSED', 'SUCCESS'].includes(practicalRecord.status);
    const hasStartedPractical = practicalRecord && 
        ['STARTED', 'SUBMITTED', 'REVIEWING', 'PASSED', 'SUCCESS'].includes(practicalRecord.status);

    // 2. 快速測試 (INSTANT)
    const instantRecord = existingRecords?.find(r => r.gymId === gymId && 
        (r.challengeType === 'INSTANT_CHALLENGE' || r.gymChallengeId === instantChallenge?.id));
        
    const hasInstantSubmission = instantRecord && 
        ['SUBMITTED', 'REVIEWING', 'PASSED', 'SUCCESS'].includes(instantRecord.status);
    const hasStartedInstant = instantRecord && 
        ['STARTED', 'SUBMITTED', 'REVIEWING', 'PASSED', 'SUCCESS'].includes(instantRecord.status);

    const practicalName = practicalChallenge?.name || (isJSBasics ? "實戰：BMI 計算機邏輯開發" : "實戰演練：軟體邏輯開發");
    const practicalDays = practicalChallenge?.max_duration || 14;

    const instantName = instantChallenge?.name || (isJSBasics ? "快速測試：JS 變數與邏輯" : "快速測試：邏輯小馬達");
    const instantDays = instantChallenge?.max_duration || 3;

    const challengeData = {
        title: practicalName,
        instantTitle: instantName,
        description: isJSBasics 
            ? "在這個挑戰中，你需要實作一個能正確處理使用者輸入、計算 BMI 並根據結果給出健康建議的邏輯模組。這將考驗你對變數型別轉換與 if/else 判斷的掌握程度。"
            : "在這個挑戰中，你需要分析並實作核心業務邏輯。",
        requirements: [
            "需實作變數型別轉換 (String to Number)",
            "需包含邊界條件檢查 (如身高體重不可為 0)",
            "需繪制 OOA 邏輯分析圖",
            "程式碼需模組化 (分離計算邏輯與顯示邏輯)"
        ],
        submissionFields: [
            { id: 'architecture_image', label: 'OOA/OOD 分析圖 (Image)', type: 'file' },
            { id: 'code_screenshot', label: '核心程式碼截圖 (Image)', type: 'file' }
        ]
    };

    const handleInstantPassed = async () => {
        const toastId = toast.loading('正在記錄挑戰結果...');
        try {
            // Instant 模式直接標記完成，不需人工審核
            await recordService.submitChallenge({
                userId,
                journeyId,
                chapterId,
                gymId,
                gymChallengeId: instantChallenge?.id || 0,
                submission: {
                    status: 'PASSED',
                    type: 'INSTANT_CHALLENGE',
                    createdAt: String(Date.now())
                }
            });

            toast.success('恭喜！已通關速戰速決挑戰，道館已解鎖。', { id: toastId });
            setStage('SUCCESS');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (e) {
            // Demo 模式下，即使 API 404 也嘗試本地完成
            console.warn("API likely not ready, falling back to local completion", e);
            localStorage.setItem(`demo_gym_${gymId}_passed`, 'true');
            toast.success('已完成速戰速決挑戰 (本地模擬模式)', { id: toastId });
            setStage('SUCCESS');
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            // 改存至組件 State 避免 LocalStorage 空間不足 (QuotaExceededError)
            setFilesData(prev => ({ ...prev, [fieldId]: base64 }));
            setReadyFiles(prev => ({ ...prev, [fieldId]: true }));
            toast.success(`已讀取檔案：${file.name}`);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitPractical = async () => {
        setUploading(true);
        // 模擬上傳進度
        for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 100));
        }

        try {
            // 蒐集暫存資料 (從 State 取得)
            const submission = { ...filesData };

            await recordService.submitChallenge({
                userId,
                journeyId,
                chapterId,
                gymId,
                gymChallengeId: practicalChallenge?.id || 0,
                submission: submission
            });

            toast.success('作業已提交！導師將在 1-2 天內完成批改。');
            setStage('SUCCESS');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (e) {
            // API 404 Fallback
            console.warn("API submit failed, saving to local records for Demo", e);
            
            // 模擬一筆紀錄到 local_gym_records 以便在 Portfolio 看到
            const localRecords = JSON.parse(localStorage.getItem('local_gym_records') || '[]');
            const submission = { ...filesData };

            const newRecord = {
                id: Date.now(),
                userId,
                journeyId,
                chapterId,
                gymId,
                gymChallengeId: practicalChallenge?.id || 0,
                status: 'REVIEWING',
                type: 'PRACTICAL_CHALLENGE',
                submission,
                createdAt: Date.now()
            };
            localStorage.setItem('local_gym_records', JSON.stringify([...localRecords, newRecord]));
            
            toast.success('作業已提交 (本地 Demo 模式)！已記錄於您的挑戰歷程。');
            setStage('SUCCESS');
            setTimeout(() => window.location.reload(), 2000);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-foreground">
            <div className="bg-card border border-border-ui rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-foreground hover:bg-white/10 p-2 rounded-full transition-all z-10"
                >
                    <X size={20} />
                </button>

                {/* 狀態切換 */}
                <div className="p-8">
                    {stage === 'SELECT' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-black text-primary mb-2">選擇您的鍛鍊強度</h2>
                                <p className="text-gray-400 text-sm">完成任一挑戰即可通關此道館</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Instant Mode */}
                                <div 
                                    onClick={() => { setSelectedType('INSTANT'); setStage('DETAILS'); }}
                                    className="group relative bg-background border border-border-ui rounded-xl p-6 hover:border-primary cursor-pointer transition-all hover:bg-card"
                                >
                                    {hasInstantSubmission && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-primary/90 text-foreground text-[10px] font-bold rounded-full shadow-lg animate-in fade-in zoom-in">
                                            <CheckCircle2 className="w-3 h-3" />
                                            已完成
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                            <Zap size={32} />
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-1 rounded">Quick</div>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors uppercase italic">{challengeData.instantTitle}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                        適合想快速驗證概念的同學。純觀念與邏輯小測試，不需實作程式碼，完成後立即通關。
                                    </p>
                                    
                                    {/* 剩餘天數與開始按鈕區塊 */}
                                    <div className="mt-auto pt-4 border-t border-border-ui/50 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-primary/80 font-bold bg-primary/10 px-2 py-1 rounded">
                                            <Hourglass size={14} className="text-primary" /> 
                                            在 {instantDays} 天內完成
                                        </div>
                                        <div className="flex items-center text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            立即開始 <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* Practical Mode */}
                                <div 
                                    onClick={() => { setSelectedType('PRACTICAL'); setStage('DETAILS'); }}
                                    className="group relative bg-background border border-border-ui rounded-xl p-6 hover:border-primary cursor-pointer transition-all hover:bg-card"
                                >
                                    {hasPracticalSubmission && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-primary/90 text-black text-[10px] font-bold rounded-full shadow-lg animate-in fade-in zoom-in">
                                            <CheckCircle2 className="w-3 h-3" />
                                            已提交
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                            <Dumbbell size={32} />
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-1 rounded">Practical</div>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors uppercase italic">{challengeData.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                        職涯級鍛鍊。需提交作業圖檔，導師親自批改並提供詳細回饋，此挑戰將收錄於您的個人檔案。
                                    </p>

                                    {/* 剩餘天數與開始按鈕區塊 */}
                                    <div className="mt-auto pt-4 border-t border-border-ui/50 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-primary/80 font-bold bg-primary/10 px-2 py-1 rounded">
                                            <Hourglass size={14} className="text-primary" /> 
                                            在 {practicalDays} 天內完成
                                        </div>
                                        <div className="flex items-center text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            查看詳情 <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {stage === 'DETAILS' && (
                        <div className="animate-in slide-in-from-right-4">
                            <button onClick={() => setStage('SELECT')} className="text-xs text-gray-500 hover:text-foreground mb-6 flex items-center gap-1">
                                <ChevronRight size={14} className="rotate-180" /> 返回選擇
                            </button>

                            <div className="flex items-start gap-4 mb-6">
                                <div className={`p-4 rounded-xl ${selectedType === 'INSTANT' ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                                    {selectedType === 'INSTANT' ? <Zap size={40} /> : <Dumbbell size={40} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-bold">{selectedType === 'INSTANT' ? challengeData.instantTitle : challengeData.title}</h2>
                                        {selectedType === 'PRACTICAL' && hasPracticalSubmission && (
                                            <span className="px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold rounded uppercase">已提交</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400">道館挑戰內容說明</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-background p-4 rounded-lg border border-border-ui">
                                    <h4 className="text-sm font-bold text-gray-400 mb-2 border-b border-border-ui pb-2">挑戰描述</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {selectedType === 'INSTANT' 
                                            ? "這是一個互動式的邏輯問卷，包含 3-5 個關於 JS 基礎操作的情境題。你需要在不撰寫程式碼的情況下，預測代碼執行的結果。"
                                            : challengeData.description
                                        }
                                    </p>
                                </div>

                                {selectedType === 'PRACTICAL' && (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                            <h4 className="text-sm font-bold text-primary mb-3">✅ 通關要求</h4>
                                            <ul className="space-y-2">
                                                {challengeData.requirements.map((req, i) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-primary rounded-full" /> {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    {selectedType === 'INSTANT' ? (
                                        !hasStartedInstant ? (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        const toastId = toast.loading('啟動挑戰中...');
                                                        await recordService.bookChallenge({
                                                            gymId,
                                                            gymChallengeId: instantChallenge?.id || 0
                                                        });
                                                        toast.success('挑戰已啟動，您的計時已開始！', { id: toastId });
                                                        setTimeout(() => window.location.reload(), 1000);
                                                    } catch (e) {
                                                        console.warn("Booking failed", e);
                                                        toast.error('啟動失敗，請稍後再試。');
                                                    }
                                                }}
                                                className="flex-1 py-4 bg-primary hover:opacity-90 text-foreground rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                開始挑戰 <ChevronRight size={18} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleInstantPassed}
                                                className="flex-1 py-4 bg-primary hover:opacity-90 text-foreground rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {hasInstantSubmission ? "重新測試" : "立即進入測試"} <ChevronRight size={18} />
                                            </button>
                                        )
                                    ) : (
                                        !hasStartedPractical ? (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        const toastId = toast.loading('啟動挑戰中...');
                                                        await recordService.bookChallenge({
                                                            gymId,
                                                            gymChallengeId: practicalChallenge?.id || 0
                                                        });
                                                        toast.success('挑戰已啟動，您的計時已開始！', { id: toastId });
                                                        setTimeout(() => window.location.reload(), 1000);
                                                    } catch (e) {
                                                        console.warn("Booking failed", e);
                                                        toast.error('啟動失敗，請稍後再試。');
                                                    }
                                                }}
                                                className="flex-1 py-4 bg-primary hover:bg-yellow-300 text-black rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                開始挑戰 <ChevronRight size={18} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setStage('SUBMISSION')}
                                                className="flex-1 py-4 bg-primary hover:bg-yellow-300 text-black rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {hasPracticalSubmission ? "重新提交作品" : "我已準備好，開始交件"} <ChevronRight size={18} />
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {stage === 'SUBMISSION' && (
                        <div className="animate-in slide-in-from-right-4">
                             <button onClick={() => setStage('DETAILS')} className="text-xs text-gray-500 hover:text-foreground mb-6 flex items-center gap-1">
                                <ChevronRight size={14} className="rotate-180" /> 返回說明
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Upload size={24} className="text-primary" /> 
                                    提交挑戰作品
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">請上傳所需的分析成果與程式碼截圖</p>
                            </div>

                            <div className="space-y-4">
                                {challengeData.submissionFields.map((field) => (
                                    <div key={field.id} className="bg-background p-5 rounded-xl border border-border-ui">
                                        <label className="text-sm font-bold text-gray-300 mb-3 block">{field.label}</label>
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(field.id, e)}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                                                <Upload size={24} className="text-gray-500" />
                                                <span className="text-xs text-gray-500">點擊或拖放圖片至此</span>
                                                {readyFiles[field.id] && (
                                                    <div className="mt-2 text-green-500 text-[10px] font-bold flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                                                        <CheckCircle2 size={12} /> 檔案已就緒
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex gap-3">
                                    <AlertCircle className="text-primary shrink-0" size={20} />
                                    <div>
                                        <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
                                            作品網站目前處於 Demo 階段。您的圖片將以 Base64 格式儲存於瀏覽器本地空間 (LocalStorage)，在清除快取或登出後紀錄可能會消失。
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSubmitPractical}
                                    disabled={uploading || Object.keys(readyFiles).length === 0}
                                    className="w-full py-4 mt-4 bg-primary hover:bg-yellow-300 text-black rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            正在處理作品... {progress}%
                                        </>
                                    ) : (
                                        <>確認提交 <ChevronRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {stage === 'SUCCESS' && (
                        <div className="p-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-green-500 animate-bounce">
                                <CheckCircle2 size={56} />
                            </div>
                            <h2 className="text-3xl font-black mb-4">提交成功！</h2>
                            <p className="text-gray-400 text-sm max-w-sm">
                                系統正在跳轉至地圖頁面。{selectedType === 'PRACTICAL' ? "您可以隨時在「個人檔案 > 挑戰歷程」追蹤批改進度。" : "您已成功通關本道館！"}
                            </p>
                            <div className="mt-8 flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="text-xs text-gray-600 mb-1">XP EARNED</div>
                                    <div className="text-xl font-black text-primary">+1200</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
