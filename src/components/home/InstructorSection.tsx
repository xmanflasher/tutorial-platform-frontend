import { Instructor } from '@/types';
import { CheckCircle2, Facebook, Youtube, Instagram, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function InstructorSection({ instructor }: { instructor: Instructor }) {
  return (
    <section>
      {/* 講師介紹卡片 */}
      <div className="bg-[#1E293B] rounded-xl p-8 md:p-12 mb-16">
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
                  <CheckCircle2 className="text-yellow-400 shrink-0 mt-1" size={18} />
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer 區域 (依照截圖放在最底部) */}
      <footer className="pt-8 border-t border-slate-800 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <Link href="#" className="text-slate-400 hover:text-white"><span className="font-bold text-xl">LINE</span></Link>
            <Link href="#" className="text-slate-400 hover:text-white"><Facebook /></Link>
            <Link href="#" className="text-slate-400 hover:text-white"><Instagram /></Link>
            <Link href="#" className="text-slate-400 hover:text-white"><Youtube /></Link>
            <Link href="#" className="text-slate-400 hover:text-white"><Share2 /></Link>
          </div>

          {/* Logo & Copyright */}
          <div className="text-center md:text-right">
             <div className="flex items-center justify-center md:justify-end gap-2 mb-2 text-white font-bold text-xl">
               Waterball <span className="text-xs block text-slate-400">水球軟體學院</span>
             </div>
             <div className="text-xs text-slate-500 space-y-1">
                <div>
                  <Link href="#" className="hover:text-slate-300">隱私權政策</Link>
                  <span className="mx-2">|</span>
                  <Link href="#" className="hover:text-slate-300">服務條款</Link>
                </div>
                <div>客服信箱: support@waterballsa.tw</div>
                <div className="mt-4">© 2025 水球特務有限公司</div>
             </div>
          </div>
        </div>
      </footer>
    </section>
  );
}