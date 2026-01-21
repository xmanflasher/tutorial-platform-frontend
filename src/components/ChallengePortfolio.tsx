"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Loader2, ChevronLeft, ChevronRight, Maximize2, X,
    FileText, ScrollText, PenLine, MousePointerClick,
    Calendar, StickyNote, RotateCcw, ChevronRight as ChevronRightIcon,
    BookOpen // 新增 icon
} from "lucide-react";
// 引入 react-markdown
import ReactMarkdown, { Components } from 'react-markdown';

// --- Constants ---
const RATING_LABELS: Record<string, string> = {
    "1": "需求結構化分析",
    "2": "區分結構與行為",
    "3": "抽象/萃取能力",
    "4": "建立 Well-Defined Context",
    "5": "熟悉設計模式的 Form",
    "6": "游刃有餘的開發能力"
};

// --- Types ---
// ... (保持不變)
interface ChallengeRecord {
    id: number;
    gymId: number;
    gymName?: string;
    gymChallengeId: number;
    status: "SUCCESS" | "FAILED" | "SUBMITTED" | "IN_PROGRESS";
    feedback?: string;
    ratings?: Record<string, string>;
    submission?: Record<string, string>;
    createdAt: number;
    reviewedAt?: number;
}

interface GymData {
    id: number;
    name: string;
}

interface ChallengePortfolioProps {
    targetUserId: string;
}

// --- Helper & ZoomableImage & SubmissionGallery ---
// ... (這幾個組件與之前完全相同，為節省篇幅省略，請保留你原本的程式碼)
const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        dateStr: `${date.getMonth() + 1}/${date.getDate()}`
    };
};

const ZoomableImage = ({ src, alt }: { src: string, alt: string }) => {
    // ... (請保留原本的 ZoomableImage 程式碼)
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey || true) {
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setScale(s => Math.min(Math.max(s * delta, 0.5), 5));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        setPosition({
            x: e.clientX - startPos.current.x,
            y: e.clientY - startPos.current.y
        });
    };

    const handleMouseUp = () => { isDragging.current = false; };

    const resetZoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-hidden relative bg-[#0d0e11] cursor-move flex items-center justify-center select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                draggable={false}
                className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out origin-center"
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            />
            <button
                onClick={resetZoom}
                className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-opacity opacity-70 hover:opacity-100 z-10"
                title="重置縮放"
            >
                <RotateCcw size={20} />
            </button>
            <div className="absolute top-4 right-4 bg-black/40 text-white px-2 py-1 rounded text-xs pointer-events-none">
                {Math.round(scale * 100)}%
            </div>
        </div>
    );
};

const SubmissionGallery = ({ submission, title }: { submission?: Record<string, string>, title: string }) => {
    // ... (請保留原本的 SubmissionGallery 程式碼)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => { setCurrentIndex(0); }, [submission]);

    const labelMap: Record<string, string> = { "ood_uml": "物件導向設計 (OOD)", "ooa_uml": "物件導向分析 (OOA)", "ood_sequence_diagram": "循序圖 (Sequence Diagram)" };

    const images = submission
        ? Object.entries(submission)
            .filter(([key, val]) => val && val.startsWith("http") && key !== "code_files")
            .map(([key, val]) => ({ key, url: val, label: labelMap[key] || key }))
        : [];

    if (images.length === 0) {
        return (
            <div className="w-full h-full min-h-[400px] bg-[#161b22] rounded-xl flex flex-col items-center justify-center text-gray-500 border border-gray-800 border-dashed">
                <FileText className="w-10 h-10 mb-2 opacity-50" />
                <p>此挑戰未上傳圖片</p>
                <div className="mt-4 text-yellow-500 font-bold text-lg px-4 text-center">{title}</div>
            </div>
        );
    }

    const handleNext = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); };
    const handlePrev = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); };
    const currentImage = images[currentIndex];

    return (
        <div className="flex flex-col w-full h-full">
            <div className="bg-[#0d0e11] rounded-t-xl overflow-hidden flex-1 relative group border border-gray-800">
                <ZoomableImage src={currentImage.url} alt={currentImage.label} />

                {images.length > 1 && (
                    <>
                        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-yellow-500 hover:text-black text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 z-20"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-yellow-500 hover:text-black text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 z-20"><ChevronRight className="w-5 h-5" /></button>
                    </>
                )}
                <button onClick={() => setIsLightboxOpen(true)} className="absolute top-3 right-3 bg-black/60 hover:bg-white hover:text-black rounded-full p-2 text-white transition-all opacity-0 group-hover:opacity-100 z-20"><Maximize2 className="w-4 h-4" /></button>
            </div>

            <div className="bg-[#161b22] py-3 px-4 rounded-b-lg border-x border-b border-gray-800 flex flex-col items-center justify-center gap-1">
                <div className="text-yellow-500 font-bold text-lg text-center leading-tight">
                    {title}
                </div>
                <div className="text-gray-500 font-mono text-xs">
                    {currentImage.label} ({currentIndex + 1}/{images.length})
                </div>
            </div>

            {isLightboxOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col animate-in fade-in duration-200">
                    <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#161b22]">
                        <span className="text-white font-bold text-lg">{title} - {currentImage.label}</span>
                        <button onClick={() => setIsLightboxOpen(false)} className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-full"><X size={24} /></button>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        <ZoomableImage src={currentImage.url} alt={currentImage.label} />
                        {images.length > 1 && (<><button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white hover:text-black rounded-full text-white z-50"><ChevronLeft size={32} /></button><button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white hover:text-black rounded-full text-white z-50"><ChevronRight size={32} /></button></>)}
                    </div>
                </div>
            )}
        </div>
    );
};


// --- New Component: Markdown Renderer (處理 CSS 樣式) ---
const MarkdownRenderer = ({ content }: { content: string }) => {
    // 定義 Markdown 標籤對應的 Tailwind 樣式
    const markdownComponents: Components = {
        // 標題 (###)
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-yellow-500 mt-6 mb-3" {...props} />,
        // 列表 ( * )
        ul: ({ node, ...props }) => <ul className="list-disc list-outside pl-5 space-y-2 mb-4 text-gray-300" {...props} />,
        // 列表項
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
        // 段落
        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
        // 分隔線 (---)
        hr: ({ node, ...props }) => <hr className="my-6 border-gray-700" {...props} />,
    };

    return (
        <ReactMarkdown components={markdownComponents}>
            {content}
        </ReactMarkdown>
    );
};

// --- New Component: Feedback Modal (完整內容彈窗) ---
const FeedbackModal = ({ isOpen, onClose, title, feedback }: { isOpen: boolean, onClose: () => void, title: string, feedback: string }) => {
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


// --- Component 3: 評語卡片 (修改版) ---
const FeedbackCard = ({ feedback, title, isCollapsed, onToggleCollapse }: {
    feedback?: string,
    title: string,
    isCollapsed: boolean,
    onToggleCollapse: () => void
}) => {
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
                        {/* pointer-events-auto 讓按鈕可以被點擊 */}
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


// --- Main Page Component ---
// ... (保持不變，請複製你原本的 Main Page Component)
export default function ChallengePortfolio({ targetUserId }: ChallengePortfolioProps) {
    const [records, setRecords] = useState<ChallengeRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<ChallengeRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [gymMap, setGymMap] = useState<Record<number, string>>({});
    const [isFeedbackCollapsed, setIsFeedbackCollapsed] = useState(false);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/gyms`);
                if (res.ok) {
                    const gyms: GymData[] = await res.json();
                    const map: Record<number, string> = {};
                    gyms.forEach(g => map[g.id] = g.name);
                    setGymMap(map);
                }
            } catch (e) {
                console.error("Failed to fetch gyms", e);
            }
        };
        fetchGyms();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!targetUserId) return;
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8080/api/users/${targetUserId}/journeys/gyms/challenges/records`);

                if (!res.ok) { setRecords([]); return; }
                const data = await res.json();

                if (Array.isArray(data)) {
                    const filtered = data
                        .filter((r: ChallengeRecord) => r.reviewedAt != null || r.status === 'SUCCESS')
                        .sort((a, b) => b.createdAt - a.createdAt);

                    setRecords(filtered);
                    if (filtered.length > 0) setSelectedRecord(filtered[0]);
                } else {
                    setRecords([]);
                }
            } catch (error) { console.error("Fetch Error:", error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [targetUserId]);

    if (loading) return <div className="h-96 flex items-center justify-center text-white"><Loader2 className="animate-spin w-10 h-10 text-yellow-500" /></div>;

    return (
        <div className="mt-8 container mx-auto px-4 lg:px-8 pb-12 flex flex-col">

            {/* --- Block A: 上方展示區 (Master Detail View) --- */}
            <div className="mb-8 shrink-0">
                {selectedRecord ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-row gap-4 h-[500px] lg:h-[600px] transition-all duration-500">

                            {/* 左: 圖片 */}
                            <div className={`transition-all duration-500 ease-in-out h-full
                                ${isFeedbackCollapsed ? 'w-[95%]' : 'w-1/2 lg:w-2/3'}
                            `}>
                                <SubmissionGallery
                                    submission={selectedRecord.submission}
                                    title={selectedRecord.gymName || gymMap[selectedRecord.gymId] || `挑戰 #${selectedRecord.gymId}`}
                                />
                            </div>

                            {/* 右: 評語 */}
                            <div className={`transition-all duration-500 ease-in-out h-full
                                ${isFeedbackCollapsed ? 'w-[5%]' : 'w-1/2 lg:w-1/3'}
                            `}>
                                <FeedbackCard
                                    feedback={selectedRecord.feedback}
                                    title={selectedRecord.gymName || gymMap[selectedRecord.gymId] || `挑戰 #${selectedRecord.gymId}`}
                                    isCollapsed={isFeedbackCollapsed}
                                    onToggleCollapse={() => setIsFeedbackCollapsed(!isFeedbackCollapsed)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[500px] flex flex-col items-center justify-center border border-gray-800 border-dashed rounded-xl bg-[#161b22]/50">
                        <p className="text-gray-500 text-lg">目前沒有已批改的挑戰紀錄</p>
                    </div>
                )}
            </div>

            {/* --- Block B: 下方時間軸列表 --- */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 pl-4 border-l-4 border-yellow-500 flex items-center gap-3 shrink-0">
                    <ScrollText className="w-5 h-5" />
                    挑戰紀錄
                </h3>

                {/* h-[600px] 大約可以顯示 3-4 個 Card */}
                <div className="relative h-[600px] overflow-y-auto pr-2 custom-scrollbar">

                    <div className="relative min-h-full">

                        {/* 貫穿線條 (固定在左側 103px) */}
                        <div className="absolute left-[103px] top-4 bottom-4 w-0.5 bg-gray-700 hidden md:block"></div>

                        <div className="space-y-6 pb-4">
                            {records.map((record) => {
                                const { year, dateStr } = formatDate(record.createdAt);
                                const isSelected = selectedRecord?.id === record.id;
                                const displayName = record.gymName || gymMap[record.gymId] || `挑戰 #${record.gymId}`;

                                return (
                                    <div
                                        key={record.id}
                                        className={`flex flex-col md:flex-row gap-4 md:gap-8 group cursor-pointer`}
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        {/* 日期區 */}
                                        <div className="hidden md:flex flex-col items-end w-[100px] shrink-0 pt-1 text-right">
                                            <span className={`text-2xl font-bold leading-none transition-colors ${isSelected ? 'text-yellow-500' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                {dateStr}
                                            </span>
                                            <span className="text-sm text-gray-600 font-mono mt-1">{year}</span>
                                        </div>

                                        {/* 時間軸節點 (位於線條上) */}
                                        <div className="hidden md:flex absolute left-[97px] items-center justify-center mt-2.5">
                                            <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10
                                                ${isSelected
                                                    ? 'bg-yellow-500 border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.6)] scale-125'
                                                    : 'bg-[#0d0e11] border-gray-600 group-hover:border-gray-400'
                                                }`}>
                                            </div>
                                        </div>

                                        {/* 卡片本體 */}
                                        <div className={`flex-1 transition-all duration-300 transform ${isSelected ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>
                                            <div className={`bg-[#161b22] border rounded-lg p-4 shadow-md transition-all
                                                ${isSelected
                                                    ? 'border-yellow-500/50 ring-1 ring-yellow-500/20 bg-[#1c2128]'
                                                    : 'border-gray-800 hover:border-gray-600 hover:bg-[#1f242c]'
                                                }`}>

                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                        {displayName}
                                                    </h4>
                                                    <div className="md:hidden flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3" /> {year}/{dateStr}
                                                    </div>
                                                </div>

                                                {/* 內容摘要 (一行 + ...) */}
                                                {record.feedback && (
                                                    <div className="text-xs text-gray-500 mb-3 line-clamp-1">
                                                        {record.feedback.replace(/[#*`]/g, '')}
                                                    </div>
                                                )}

                                                {/* Ratings Tags */}
                                                {record.ratings && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {Object.entries(record.ratings).map(([key, value]) => (
                                                            <span key={key} className={`text-[10px] px-2 py-0.5 rounded border font-mono
                                                                ${isSelected
                                                                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                                                                    : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                                                                {RATING_LABELS[key] || `維度 ${key}`}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className={`mt-2 text-[10px] flex items-center gap-1 transition-opacity ${isSelected ? 'text-yellow-500' : 'text-gray-600 opacity-0 group-hover:opacity-100'}`}>
                                                    <MousePointerClick className="w-3 h-3" />
                                                    {isSelected ? '正在檢視中' : '點擊查看詳情'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}