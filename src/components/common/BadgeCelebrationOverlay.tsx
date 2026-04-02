// src/components/common/BadgeCelebrationOverlay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles } from 'lucide-react';
import ConfettiCanvas from '@/components/effects/ConfettiCanvas';

interface BadgeCelebrationOverlayProps {
  badgeId: number;
  badgeName: string;
  imageUrl?: string;
  onClose: (badgeId: number) => void;
}

/**
 * 徽章慶祝彈窗組件
 * 只負責 UI 呈現與彈窗過場，將「撒花特效」抽離。
 */
export default function BadgeCelebrationOverlay({ badgeId, badgeName, imageUrl, onClose }: BadgeCelebrationOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // 進入時延遲一點點撒花，效果更好
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 撒花特效：已解耦至獨立組件 */}
      <ConfettiCanvas active={showConfetti} duration={4000} />

      <AnimatePresence>
        {/* 背景遮罩 */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose(badgeId)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* 慶祝主卡片 */}
        <motion.div
          key="modal"
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 100,
            delay: 0.1 
          }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-yellow-400/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(250,204,21,0.2)] overflow-hidden"
        >
          {/* 光暈特效 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-400/20 rounded-full blur-[80px] -z-10" />
          
          <button 
            onClick={() => onClose(badgeId)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "mirror" 
              }}
              className="relative p-6 bg-yellow-400/10 rounded-full border border-yellow-400/20"
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={badgeName} 
                  className="w-32 h-32 object-contain filter drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                />
              ) : (
                <Trophy size={80} className="text-yellow-400" />
              )}
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2 text-yellow-400"
              >
                <Sparkles size={24} />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-yellow-400 font-bold tracking-widest text-sm uppercase mb-2">新的里程碑！</p>
            <h2 className="text-3xl font-extrabold text-white mb-4">
               解鎖徽章: {badgeName}
            </h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              恭喜！您已在軟體設計與開發的道路上邁出了堅實的一步。<br/>
              這枚徽章象徵著您對卓越技術的追求。
            </p>

            <button
              onClick={() => onClose(badgeId)}
              className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/20"
            >
              太棒了！
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
