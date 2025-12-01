import Link from 'next/link';
import { Course } from '@/types';
import { Image as ImageIcon } from 'lucide-react'; // 引入圖示

const getButtonStyle = (style: 'solid' | 'outline' | 'disabled') => {
  switch (style) {
    case 'solid':
      return 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 border border-transparent';
    case 'outline':
      return 'bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300';
    case 'disabled':
      return 'bg-slate-700 text-slate-400 cursor-not-allowed border border-transparent';
    default:
      return '';
  }
};

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col bg-[#111827] border border-slate-700/50 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 shadow-lg relative group h-full">
      
      {/* 1. 圖片區域 */}
      <div className="h-48 w-full bg-slate-800 relative overflow-hidden group">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
             {/* 修正：改用 Icon，避免長文字撐爆寬度 */}
             <ImageIcon size={48} className="text-slate-600 mb-2 opacity-50" />
             <span className="text-xs text-slate-600 font-mono tracking-widest uppercase opacity-50">NO IMAGE</span>
          </div>
        )}
        
        {/* 狀態標籤 (懸浮在圖片右上角) */}
        {course.statusLabel && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full shadow-md z-10">
            {course.statusLabel}
          </div>
        )}
      </div>

      {/* 2. 內容區域 */}
      <div className="p-5 flex-1 flex flex-col">
        {/* 標題 (限制 2 行，防止撐高) */}
        <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2 h-14">
          {course.title}
        </h3>

        {/* 作者 */}
        <div className="mb-3">
          <span className="text-yellow-500 text-sm font-bold">
            {course.author}
          </span>
        </div>

        {/* 描述 (限制 3 行) */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {course.description}
        </p>

        {/* 3. 底部區塊 (Coupon + 按鈕) */}
        <div className="mt-auto space-y-3">
          
          {/* 折價券 */}
          {course.couponText ? (
            <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold py-2 px-3 rounded text-center truncate">
              {course.couponText}
            </div>
          ) : (
             // 佔位，保持卡片高度一致
             <div className="h-[34px]" />
          )}

          {/* 按鈕群組 */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={course.primaryAction.href}
              className={`py-2 text-center text-sm font-bold rounded transition-all flex items-center justify-center truncate px-1 ${getButtonStyle(course.primaryAction.style)}`}
            >
              {course.primaryAction.text}
            </Link>

            {course.secondaryAction && (
              <Link
                href={course.secondaryAction.href}
                className={`py-2 text-center text-sm font-bold rounded transition-all flex items-center justify-center truncate px-1 ${getButtonStyle(course.secondaryAction.style)}`}
              >
                {course.secondaryAction.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}