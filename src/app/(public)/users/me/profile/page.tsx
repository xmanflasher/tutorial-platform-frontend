'use client';

import { Github, Disc, Link2, Info, Receipt } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">

      {/* 1. 基本資料區塊 */}
      <section className="bg-[#1e1f24] border border-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-yellow-400">基本資料</h2>
          <button className="px-4 py-1.5 text-xs font-bold border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-400/10 transition-colors flex items-center gap-2">
            ✏️ 編輯資料
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">暱稱</label>
            <div className="text-white font-medium text-base">再一次就掛機</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">職業</label>
            <div className="text-white font-medium text-base">-</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">等級</label>
            <div className="text-white font-medium text-base">1</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">突破道館數</label>
            <div className="text-white font-medium text-base">0</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <div className="text-white font-medium text-base">xmanflasher@gmail.com</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">生日</label>
            <div className="text-white font-medium text-base">尚未設定</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">性別</label>
            <div className="text-white font-medium text-base">尚未設定</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">地區</label>
            <div className="text-white font-medium text-base">尚未設定</div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-500 mb-1">Github 連結</label>
            <div className="text-white font-medium text-base">...</div>
          </div>
        </div>
      </section>

      {/* 2. Discord 綁定 */}
      <section className="bg-[#1e1f24] border border-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-yellow-400 mb-1 flex items-center gap-2">
              Discord 帳號綁定
            </h2>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs mb-2">沒有獲得學號或身份組嗎？ <span className="underline cursor-pointer hover:text-white">點此登入存取</span></p>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-yellow-400 text-slate-900 font-bold rounded hover:bg-yellow-500 transition-colors">
              <Link2 size={18} />
              綁定 Discord
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#111827] p-4 rounded border border-gray-700">
          <Disc className="text-indigo-400" size={28} />
          <span className="text-gray-400">尚未綁定 Discord 帳號</span>
        </div>
      </section>

      {/* 3. GitHub 綁定 */}
      <section className="bg-[#1e1f24] border border-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-yellow-400 mb-1">GitHub 帳號</h2>
            <p className="text-gray-400 text-sm">綁定 GitHub 帳號後，可享受更多功能</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-slate-900 font-bold rounded hover:bg-yellow-500 transition-colors">
            <Link2 size={18} />
            綁定 GitHub
          </button>
        </div>
        <div className="flex items-center gap-3 bg-[#111827] p-4 rounded border border-gray-700">
          <Github className="text-white" size={28} />
          <span className="text-gray-400">尚未綁定 GitHub 帳號</span>
        </div>
      </section>

      {/* 4. GitHub Repos (參考截圖) */}
      <section className="bg-[#1e1f24] border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">課程 GitHub Repos</h2>
        <div className="border border-gray-700 bg-[#111827] p-4 rounded mb-4 flex gap-3 items-center">
          <Info className="text-yellow-400 shrink-0" size={20} />
          <span className="text-gray-300 text-sm">購買 AI x BDD 課程後，即可加入以下課程專屬的 GitHub Repos！</span>
        </div>

        {/* Repo Card 1 */}
        <div className="border border-gray-700 rounded p-4 mb-3 flex justify-between items-center">
          <div>
            <div className="text-blue-400 font-medium mb-1">水球軟體學院：AI x BDD : 規格驅動全自動開發術</div>
            <div className="text-gray-500 text-xs">Waterball-Software-Academy/AI-x-BDD-Spec-Driven...</div>
            <div className="text-yellow-600 text-xs mt-1">購買「AI x BDD : 規格驅動全自動開發術」課程即可加入</div>
          </div>
          <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 text-xs rounded border border-yellow-700/50">特定課程專屬</span>
        </div>
        {/* Repo Card 2 */}
        <div className="border border-gray-700 rounded p-4 flex justify-between items-center">
          <div>
            <div className="text-blue-400 font-medium mb-1">SDD.os : 課程中用到的高精度測試翻譯技術</div>
            <div className="text-gray-500 text-xs">SDD-TW/sdd.os</div>
            <div className="text-yellow-600 text-xs mt-1">購買「AI x BDD : 規格驅動全自動開發術」課程即可加入</div>
          </div>
          <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 text-xs rounded border border-yellow-700/50">特定課程專屬</span>
        </div>
      </section>

      {/* 5. 訂單紀錄 */}
      <section className="bg-[#1e1f24] border border-gray-800 rounded-lg p-6 min-h-[200px] flex flex-col">
        <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <Receipt size={24} /> 訂單紀錄
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          目前沒有訂單記錄
        </div>
      </section>
    </div>
  );
}