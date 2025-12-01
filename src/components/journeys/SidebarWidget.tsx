import { JourneyDetail } from '@/types';
import { Globe, Smartphone, Award } from 'lucide-react';
import Link from 'next/link';

export default function SidebarWidget({ journey }: { journey: JourneyDetail }) {
  return (
    <div className="space-y-6 sticky top-24">
      {/* 1. 證書卡片 */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 text-center shadow-lg">
        {/* 證書圖片區 (模擬) */}
        <div className="bg-white p-2 rounded-lg mb-4 aspect-[4/3] flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 border-4 border-double border-slate-200 m-2" />
          <div className="text-slate-900">
            <div className="text-2xl font-serif font-bold mb-1">CERTIFICATE</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">of Achievement</div>
            <div className="font-script text-3xl text-blue-900 mb-2">Your Name</div>
            <div className="text-[8px] text-slate-400">Has successfully completed the course</div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">課程證書</h3>
        
        <button className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-lg transition-colors">
          {journey.actionButtons.primary}
        </button>
      </div>

      {/* 2. 功能列表 (Tags) */}
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-3 text-slate-300">
          <Globe size={20} className="text-slate-400" />
          <span className="font-medium">中文課程</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <Smartphone size={20} className="text-slate-400" />
          <span className="font-medium">支援行動裝置</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <Award size={20} className="text-slate-400" />
          <span className="font-medium">專業的完課認證</span>
        </div>
      </div>
    </div>
  );
}