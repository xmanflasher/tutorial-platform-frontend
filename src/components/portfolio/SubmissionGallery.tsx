"use client";

import React, { useState, useEffect } from "react";
import { FileText, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

interface SubmissionGalleryProps {
    submission?: Record<string, string>;
    title: string;
}

const SubmissionGallery = ({ submission, title }: SubmissionGalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => { setCurrentIndex(0); }, [submission]);

    const labelMap: Record<string, string> = {
        "ood_uml": "物件導向設計 (OOD)",
        "ooa_uml": "物件導向分析 (OOA)",
        "ood_sequence_diagram": "循序圖 (Sequence Diagram)",
        "architecture_image": "邏輯/架構分析圖",
        "code_screenshot": "核心程式碼截圖"
    };

    const images = submission
        ? Object.entries(submission)
            .filter(([key, val]) => val && (val.startsWith("http") || val.startsWith("data:")) && key !== "code_files")
            .map(([key, val]) => ({ key, url: val, label: labelMap[key] || key }))
        : [];

    if (images.length === 0) {
        return (
            <div className="w-full h-full min-h-[400px] bg-[#161b22] rounded-xl flex flex-col items-center justify-center text-gray-500 border border-border-ui border-dashed">
                <FileText className="w-10 h-10 mb-2 opacity-50" />
                <p>此挑戰未上傳圖片</p>
                <div className="mt-4 text-primary font-bold text-lg px-4 text-center">{title}</div>
            </div>
        );
    }

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const currentImage = images[currentIndex];

    return (
        <div className="flex flex-col w-full h-full">
            <div className="bg-background rounded-t-xl overflow-hidden flex-1 relative group border border-border-ui">
                <ZoomableImage src={currentImage.url} alt={currentImage.label} />

                {images.length > 1 && (
                    <>
                        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary hover:text-black text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 z-20"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary hover:text-black text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 z-20"><ChevronRight className="w-5 h-5" /></button>
                    </>
                )}
                <button onClick={() => setIsLightboxOpen(true)} className="absolute top-3 right-3 bg-black/60 hover:bg-white hover:text-black rounded-full p-2 text-white transition-all opacity-0 group-hover:opacity-100 z-20"><Maximize2 className="w-4 h-4" /></button>
            </div>

            <div className="bg-[#161b22] py-3 px-4 rounded-b-lg border-x border-b border-border-ui flex flex-col items-center justify-center gap-1">
                <div className="text-primary font-bold text-lg text-center leading-tight">
                    {title}
                </div>
                <div className="text-gray-500 font-mono text-xs">
                    {currentImage.label} ({currentIndex + 1}/{images.length})
                </div>
            </div>

            {isLightboxOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col animate-in fade-in duration-200">
                    <div className="flex justify-between items-center p-4 border-b border-border-ui bg-[#161b22]">
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

export default SubmissionGallery;
