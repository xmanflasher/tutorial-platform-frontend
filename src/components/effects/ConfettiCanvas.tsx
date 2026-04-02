// src/components/effects/ConfettiCanvas.tsx
'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCanvasProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
}

/**
 * 獨立的撒花特效組件
 * 透過 active 屬性觸發，不與特定業務邏輯綁定
 */
export default function ConfettiCanvas({ active, onComplete, duration = 3000 }: ConfettiCanvasProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fire = useCallback(() => {
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // 兩側炸開
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return interval;
  }, [duration, onComplete]);

  useEffect(() => {
    let interval: any;
    if (active) {
      interval = fire();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, fire]);

  return null; // 此組件僅負責觸發 canvas-confetti 的副作用
}
