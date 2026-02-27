"use client";

import React from "react";

export default function LoadingRunner() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-24 h-24 overflow-hidden border-b-2 border-gray-700">
                {/* Simple CSS Animated Runner */}
                <div className="absolute bottom-0 left-0 w-8 h-12 bg-yellow-400 animate-runner-bounce flex items-center justify-center rounded">
                    <div className="w-2 h-2 bg-black rounded-full mb-4" /> {/* Eye */}
                </div>

                {/* Ground lines moving left */}
                <div className="absolute bottom-0 w-full h-px bg-gray-600 animate-ground-move" />
            </div>
            <p className="text-gray-400 text-sm font-medium animate-pulse">
                勇者正在趕路中...
            </p>

            <style jsx>{`
        @keyframes runner-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ground-move {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-runner-bounce {
          animation: runner-bounce 0.6s infinite ease-in-out;
        }
        .animate-ground-move {
          animation: ground-move 1s infinite linear;
        }
      `}</style>
        </div>
    );
}
