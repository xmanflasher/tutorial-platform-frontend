import { homeService } from '@/services';
import CourseCard from '@/components/courses/CourseCard';
import { Receipt } from 'lucide-react';

export const metadata = {
  title: '所有課程 - 水球軟體學院',
};

export default async function CoursesPage() {
  const courses = await homeService.getFeaturedCourses();

  return (
    <div className="max-w-7xl mx-auto pb-12">

      {/* 1. 課程列表區塊 
          修改重點：
          改為 md:grid-cols-3，確保在半視窗 (平板尺寸) 下依然維持三欄並排，
          卡片不會因為變成兩欄而拉寬變胖。
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {courses.map((course) => (
          <div key={course.id} className="h-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* 2. 訂單紀錄區塊 */}
      <section className="border border-slate-700 rounded-xl bg-[#111827] p-8 min-h-[300px] flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Receipt className="text-white" size={28} />
          <h2 className="text-2xl font-bold text-yellow-400">訂單紀錄</h2>
        </div>

        <div className="flex-1 flex items-center justify-center text-slate-500">
          目前沒有訂單紀錄
        </div>
      </section>

    </div>
  );
}