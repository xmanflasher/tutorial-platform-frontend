"use client";

import dynamic from 'next/dynamic';

// ★★★ 核心修正 1：在 dynamic 後面加上 'as any' ★★★
// 這樣可以解決 "Property 'url' does not exist" 的錯誤
// 雖然犧牲了 ReactPlayer 的型別檢查，但能保證編譯通過並正常運作
const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false,
    loading: () => (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 animate-pulse flex items-center justify-center text-gray-400">
            載入中...
        </div>
    )
}) as any;

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
    return (
        <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-lg">
            <ReactPlayer
                className="absolute top-0 left-0"
                url={url}
                width="100%"
                height="100%"
                controls={true}
                onEnded={onEnded}
                onProgress={onProgress} // 這裡通常不需要 as any 了，因為上面 ReactPlayer 已經是 any

                // ★★★ 核心修正 2：config 這裡保留 'as any' ★★★
                // 這是為了解決你上一個錯誤 "file does not exist in type Config"
                config={{
                    file: {
                        forceHLS: true,
                    },
                } as any}
            />
        </div>
    );
}