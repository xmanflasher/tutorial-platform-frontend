import { Course } from '@/types';
import CourseCard from '@/components/courses/CourseCard';

// [Best Practice] Static Hoisting: 將不依賴 Props 與 State 的靜態 JSX 移出元件
const WELCOME_HEADER = (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-white mb-4">歡迎來到 Σ-Codeatl</h1>
    <p className="text-slate-400 max-w-4xl leading-relaxed text-lg">
      Σ-Codeatl 提供最先進的軟體技術實戰學習地圖，並透過線上雙導師制度帶你掌握核心技術能力。
      <br className="hidden md:block" />
      只要每週投資 5 小時，就能打造不平等的技術優勢，成為硬核的 Coding 實戰高手。
    </p>
  </div>
);

export default function WelcomeSection({ courses }: { courses: Course[] }) {
  // 只取前 3 筆顯示，確保版面整齊
  const displayCourses = courses.slice(0, 3);

  return (
    <section className="bg-card border-t-4 border-primary rounded-b-xl p-6 md:p-8 mb-12 shadow-2xl transition-colors duration-300">
      {WELCOME_HEADER}

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