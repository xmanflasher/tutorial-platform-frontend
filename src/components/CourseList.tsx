// src/components/CourseList.tsx
import Link from 'next/link';

// 定義 Course 的資料型別 (根據你的 api 回傳格式)
interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail?: string;
}

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  if (!courses || courses.length === 0) {
    return <div className="text-center text-gray-500">目前沒有課程。</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link 
          key={course.id} 
          href={`/courses/${course.slug || course.id}`}
          className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* 縮圖區塊 (如果有圖片的話) */}
          <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <span>課程縮圖</span>
            )}
          </div>
          
          {/* 內容區塊 */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {course.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}