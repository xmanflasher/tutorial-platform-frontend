'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error manually for monitoring
    console.error('Next.js Client Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-12 bg-slate-900/50 rounded-3xl backdrop-blur-xl border border-white/5 shadow-2xl max-w-lg"
      >
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold font-heading mb-4 text-white">
          發生非預期錯誤 (500)
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          程式碼中好像出現了小蟲。系統已自動記錄此錯誤，
          請嘗試重新載入，或稍後再試。
        </p>

        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl font-medium shadow-lg shadow-blue-500/20"
          >
            再試一次
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl font-medium"
          >
            返回首頁
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-black/40 rounded-lg text-left overflow-auto max-h-32 text-xs text-red-400 font-mono">
            {error.message}
          </div>
        )}
      </motion.div>
    </div>
  );
}
