"use client";

import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";

interface ProgressState {
    played: number;        // 百分比 (0~1)
    playedSeconds: number; // 已播放秒數
    loaded: number;
    loadedSeconds: number;
}

interface VideoPlayerProps {
    url: string;
    onEnded?: () => void;
    onProgress?: (state: ProgressState) => void;
}

export default function VideoPlayer({ url, onEnded, onProgress }: VideoPlayerProps) {
    const [isMounted, setIsMounted] = useState(false);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // 1. 提取 YouTube Video ID
    const getYouTubeId = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : "";
    };

    const videoId = getYouTubeId(url);

    // 1. 專門處理 Hydration (解決 Server/Client 不一致)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // 2. 專門處理 Cleanup (組件卸載時，確保 Timer 被清除)
    useEffect(() => {
        return () => {
            // 這裡不需要依賴 array，因為是用 ref，隨時都能讀到最新值
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, []);

    // 2. 處理播放器狀態變更
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        console.log("✅ [YouTube API] Ready");
        playerRef.current = event.target;
    };

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 狀態代碼: 1 = 播放中, 2 = 暫停, 0 = 結束
        const player = event.target;

        if (event.data === 1) { // 播放中
            console.log("▶️ [YouTube API] Playing");
            startProgressTracking(player);
        } else {
            // 暫停或結束時停止追蹤
            stopProgressTracking();
            if (event.data === 0) {
                console.log("⏹️ [YouTube API] Ended");
                if (onEnded) onEnded();
            }
        }
    };

    // 3. 手動實作 onProgress (每秒更新一次)
    const startProgressTracking = (player: YouTubePlayer) => {
        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
            if (!player || !onProgress) return;

            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();

            if (duration > 0) {
                onProgress({
                    played: currentTime / duration,
                    playedSeconds: currentTime,
                    loaded: player.getVideoLoadedFraction(),
                    loadedSeconds: player.getVideoLoadedFraction() * duration
                });
            }
        }, 1000); // 每 1 秒觸發一次
    };

    const stopProgressTracking = () => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    };

    // 防止 SSR Hydration Error
    if (!isMounted) {
        return (
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    載入播放器元件...
                </div>
            </div>
        );
    }

    if (!videoId) {
        return (
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center text-red-500">
                無效的影片 ID
            </div>
        );
    }

    const opts: YouTubeProps['opts'] = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 0,
            modestbranding: 1, // 隱藏部分 YouTube logo
            rel: 0,            // 結束時不要推薦其他影片
        },
    };

    return (
        <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
            <div className="absolute top-0 left-0 w-full h-full">
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    className="w-full h-full" // 確保 iframe 填滿容器
                    iframeClassName="w-full h-full" // 確保生成的 iframe 也是滿版
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                />
            </div>
        </div>
    );
}