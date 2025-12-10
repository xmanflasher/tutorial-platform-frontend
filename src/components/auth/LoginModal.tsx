'use client';

import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMockLogin: (email: string) => void; // 用於觸發 Mock 登入
}

export default function LoginModal({ isOpen, onClose, onMockLogin }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#1e1f24] rounded-xl border border-gray-700 shadow-2xl p-8">

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* LOGO 與標題 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white">
            W
          </div>
          <h2 className="text-xl font-bold text-white">水球軟體學院</h2>
          <p className="text-sm text-gray-400">WATERBALLSA.TW</p>
        </div>

        <h3 className="text-center text-gray-300 mb-6">請選擇登入方式</h3>

        {/* 登入按鈕群 */}
        <div className="space-y-4">
          {/* Facebook (Mock) - 保持僅 Alert */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#1864d6] text-white font-medium py-3 rounded-lg transition-colors"
            onClick={() => alert("沒有 API Key，請使用下方的 Mock 登入")}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.66-2.797 3.547v1.204h4.909l-.71 3.667h-4.199v7.98c0 .003-7.01 0-7.017 0z" /></svg>
            使用 Facebook 登入
          </button>

          {/* Google (Mock) - 保持僅 Alert */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg transition-colors"
            onClick={() => alert("沒有 API Key，請使用下方的 Mock 登入")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.743-.064-1.474-.188-2.195H12.2v4.15h6.47c-.28 1.498-1.076 2.766-2.288 3.585l3.703 2.87c2.172-2.008 3.66-4.972 3.66-8.41" /><path fill="#34A853" d="M12.2 24c3.24 0 5.957-1.074 7.942-2.909l-3.703-2.87c-1.076.721-2.451 1.148-4.239 1.148-3.276 0-6.046-2.213-7.035-5.192l-3.636 2.812C3.475 20.655 7.518 24 12.2 24" /><path fill="#FBBC05" d="M5.165 14.177c-.25-.75-.39-1.551-.39-2.377s.14-1.627.39-2.377l-3.636-2.812C.527 8.537 0 10.205 0 12.2s.527 3.663 1.529 5.59l3.636-2.812" /><path fill="#EA4335" d="M12.2 4.75c1.764 0 3.35.607 4.606 1.806l3.435-3.44C18.155 1.157 15.438 0 12.2 0 7.518 0 3.475 3.345 1.529 6.61l3.636 2.812c.989-2.979 3.759-5.192 7.035-5.192" /></svg>
            使用 Google 登入
          </button>
        </div>

        {/* 分隔線 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#1e1f24] text-gray-500">開發者測試用</span>
          </div>
        </div>

        {/* Mock 登入區塊 (這裡修正邏輯) */}
        <div className="grid grid-cols-2 gap-3">
          {/* 修正1: 管理者 (Email 對應 DataSeeder) */}
          <button
            onClick={() => onMockLogin('xmanflasher@gmail.com')}
            className="bg-gray-800 hover:bg-gray-700 text-yellow-400 text-sm py-2 rounded border border-gray-700 transition-colors"
          >
            ⚡ 登入管理者 (Lv.19)
          </button>

          {/* 修正2: 路人 (改用 elliot@test.com，因為 user1 不在資料庫) */}
          <button
            onClick={() => onMockLogin('elliot@test.com')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded border border-gray-700 transition-colors"
          >
            🤖 登入路人 (Lv.19)
          </button>
        </div>

      </div>
    </div>
  );
}