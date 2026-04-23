export const revalidate = 300; // 每 5 分鐘在背景更新一次 (ISR)，避免後端冷啟動導致的前端卡死

import { Suspense } from 'react';
import { homeService } from '@/services';
import WelcomeSection, { WELCOME_HEADER } from '@/components/home/WelcomeSection';
import ResourceGrid from '@/components/home/ResourceGrid';
import InstructorSection from '@/components/home/InstructorSection';
import Skeleton, { CourseCardSkeleton, ResourceCardSkeleton } from '@/components/common/Skeleton';

export const metadata = {
  title: '首頁 - Σ-Codeatl',
  description: 'Σ-Codeatl 軟體技術實戰學習地圖，掌握從 JS 到架構設計的硬核開發能力',
};

// [Best Practice] Async Server Components (React Streaming)
// 將不同的 API 請求拆分成獨立的 Server Component，搭配 Suspense 讓首頁能夠瞬間載入


async function WelcomeLoader() {
  const courses = await homeService.getFeaturedCourses();
  return <WelcomeSection courses={courses} />;
}

async function ResourceLoader() {
  const cards = await homeService.getResourceCards();
  return <ResourceGrid cards={cards} />;
}

async function InstructorLoader() {
  const instructor = await homeService.getInstructor();
  return <InstructorSection instructor={instructor} />;
}

export default function HomePage() {
  return (
    <div className="pb-10 max-w-7xl mx-auto px-4 pt-6">
      {/* 2. 歡迎區塊與主打課程 (使用精確的骨架結構) */}
      <Suspense fallback={
        <section className="bg-card border-t-4 border-primary rounded-b-xl p-6 md:p-8 mb-12 shadow-2xl">
          {WELCOME_HEADER}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </section>
      }>
        <WelcomeLoader />
      </Suspense>

      {/* 3. 資源連結方格 */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ResourceCardSkeleton />
          <ResourceCardSkeleton />
          <ResourceCardSkeleton />
          <ResourceCardSkeleton />
        </div>
      }>
        <ResourceLoader />
      </Suspense>

      {/* 4. 講師介紹與 Footer */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-2xl" />}>
        <InstructorLoader />
      </Suspense>
    </div>
  );
}