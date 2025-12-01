import { Course } from '@/types';
import CourseCard from '@/components/courses/CourseCard';

export default function WelcomeSection({ courses }: { courses: Course[] }) {
  // 只取前 3 筆顯示，確保版面整齊
  const displayCourses = courses.slice(0, 3);

  return (
    <section className="bg-[#1E293B] border-t-4 border-yellow-400 rounded-b-xl p-6 md:p-8 mb-12 shadow-2xl">
      
      {/* 1. 歡迎標題文字區 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">歡迎來到水球軟體學院</h1>
        <p className="text-slate-400 max-w-4xl leading-relaxed text-lg">
          水球軟體學院提供最先進的軟體設計思路教材，並透過線上 Code Review 來帶你掌握進階軟體架構能力。
          <br className="hidden md:block" />
          只要每週投資 5 小時，就能打造不平等的優勢，成為硬核的 Coding 實戰高手。
        </p>
      </div>

      {/* 2. 課程卡片列表 
          修改重點：
          原本可能是 md:grid-cols-2 lg:grid-cols-3
          現在改為 md:grid-cols-3 (只要大於 768px 就強制三欄，確保半螢幕時也是三欄)
          gap-5 保持緊湊
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayCourses.map((course) => (
          <div key={course.id} className="h-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </section>
  );
}