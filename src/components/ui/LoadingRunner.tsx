"use client";

import React from "react";
import Image from "next/image";

const DEFAULT_GIFS = [
    "/images/gifs/EagleWarrior-walk.gif",
    "/images/gifs/EagleWarrior-run.gif"
];

export default function LoadingRunner({ gifs = DEFAULT_GIFS }: { gifs?: string[] }) {
    const [gifSrc, setGifSrc] = React.useState(gifs[0]);

    React.useEffect(() => {
        if (gifs.length > 0) {
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            setGifSrc(randomGif);
        }
    }, [gifs]);

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
                
                {/* The Eagle Warrior GIF */}
                <div className="relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                    <Image
                        src={gifSrc}
                        alt="Loading Runner"
                        width={120}
                        height={120}
                        unoptimized // GIFs need this in Next.js to animate correctly
                        className="object-contain"
                    />
                </div>

                {/* Refined Ground Line */}
                <div className="absolute bottom-4 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent overflow-hidden">
                    <div className="w-full h-full bg-primary/30 animate-ground-move" />
                </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
                <p className="text-primary/80 text-lg font-bold tracking-widest animate-pulse">
                    勇者正在趕路中...
                </p>
                <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                        <div 
                            key={i}
                            className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes ground-move {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-ground-move {
                    animation: ground-move 1.5s infinite linear;
                }
            `}</style>
        </div>
    );
}
