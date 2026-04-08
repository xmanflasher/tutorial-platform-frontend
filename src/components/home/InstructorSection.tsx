import { Instructor } from '@/types';
import { CheckCircle2, Facebook, Youtube, Instagram, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function InstructorSection({ instructor }: { instructor: Instructor }) {
  return (
    <section>
      {/* 講師介紹卡片 */}
      <div className="bg-card rounded-xl p-8 md:p-12 mb-16 transition-colors duration-300 shadow-xl border border-border-ui">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Avatar (用 CSS 畫一個類似截圖的形狀，實際建議用圖片) */}
          <div className="w-full md:w-1/3 flex justify-center">
             <div className="w-48 h-48 rounded-full bg-slate-700 overflow-hidden border-4 border-slate-600 relative">
                {/* Placeholder for Instructor Image */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                   講師照片
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-slate-200">
            <h2 className="text-3xl font-bold text-white mb-2">{instructor.name}</h2>
            <p className="text-slate-400 mb-6">{instructor.title}</p>
            
            <p className="mb-6 leading-relaxed">
              {instructor.description}
            </p>

            <ul className="space-y-3">
              {instructor.achievements.map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <CheckCircle2 className="text-primary shrink-0 mt-1" size={18} />
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer 區域 - 完全置中排版 */}
      <footer className="-mx-8 md:-mx-12 mt-12 py-16 bg-slate-950/80 backdrop-blur-md px-8 md:px-12 border-t border-border-ui">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 text-slate-400">
          
          {/* 品牌資訊 */}
          <div className="flex flex-col items-center">
             <div className="flex items-center justify-center gap-2 mb-3 text-white font-black text-2xl italic tracking-tighter">
               Σ-Codeatl <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full not-italic tracking-normal">BETA</span>
             </div>
             <p className="text-slate-500 text-sm mb-4">軟體技術實戰學習地圖 — 建立你的技術神話</p>
          </div>

          {/* 社群連結 */}
          <div className="flex gap-6 justify-center">
            <Link href="#" className="hover:text-white transition-colors"><Facebook size={24} /></Link>
            <Link href="#" className="hover:text-white transition-colors"><Instagram size={24} /></Link>
            <Link href="#" className="hover:text-white transition-colors"><Youtube size={24} /></Link>
            <Link href="#" className="hover:text-white transition-colors"><Share2 size={24} /></Link>
          </div>
          
          {/* 導航與版權 */}
          <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
            <div className="flex gap-6 justify-center">
               <Link href="#" className="hover:text-white transition-colors">隱私權政策</Link>
               <span className="text-slate-700">|</span>
               <Link href="#" className="hover:text-white transition-colors">服務條款</Link>
            </div>
            <div className="mt-4">客服信箱：support@codeatl.tw</div>
            <div className="opacity-60">© 2026 Σ-Codeatl Team. All rights reserved.</div>
          </div>
          
        </div>
      </footer>
    </section>
  );
}