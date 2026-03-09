"use client";

import React, { useState, useRef } from "react";
import { RotateCcw } from "lucide-react";

interface ZoomableImageProps {
    src: string;
    alt: string;
}

const ZoomableImage = ({ src, alt }: ZoomableImageProps) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(s => Math.min(Math.max(s * delta, 0.5), 5));
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

export default ZoomableImage;
