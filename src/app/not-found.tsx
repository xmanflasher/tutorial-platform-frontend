'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-semibold">Oops! 迷失在代碼海中了</h2>
        <p className="mt-2 text-slate-400 max-w-md mx-auto">
          看來這個頁面已經被重構、移除或根本不存在。
          別擔心，我們帶你回到學院中心。
        </p>
        
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full font-medium"
          >
            回學院大首頁
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 border border-border-ui hover:bg-slate-800 transition-colors rounded-full font-medium"
          >
            返回上一頁
          </button>
        </div>
      </motion.div>
      
      {/* 背景裝飾 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}
