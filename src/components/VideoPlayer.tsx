"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ★★★ 核心修正：使用 dynamic import 載入 ReactPlayer ★★★
// ssr: false 代表這個元件只會在瀏覽器端渲染，避開 Server 端錯誤與型別衝突
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

// 為了讓 TypeScript 開心，我們定義一個寬鬆的型別
interface ProgressState {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
}

interface VideoPlayerProps {
    url: string;
    onEnded?: () => void;
    onProgress?: (state: ProgressState) => void;
}

export default function VideoPlayer({ url, onEnded, onProgress }: VideoPlayerProps) {
    // 檢查是否是在瀏覽器環境 (雖然 dynamic 已處理，但雙重保險有時能解型別問題)
    const isClient = typeof window !== 'undefined';

    return (
        <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-lg">
            {/* 使用 Suspense 或直接渲染 dynamic component */}
            {isClient && (
                <ReactPlayer
                    className="absolute top-0 left-0"
                    url={url}
                    width="100%"
                    height="100%"
                    controls={true}
                    onEnded={onEnded}
                    // 依然保留 as any 以防萬一
                    onProgress={onProgress as any}
                    config={{
                        file: {
                            forceHLS: true,
                        },
                    } as any}
                />
            )}
        </div>
    );
}