export const dynamic = 'force-dynamic';//強制設定動態渲染 (解決 Route 錯誤)

import { homeService, journeyService } from '@/services';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import WelcomeSection from '@/components/home/WelcomeSection';
import ResourceGrid from '@/components/home/ResourceGrid';
import InstructorSection from '@/components/home/InstructorSection';

export const metadata = {
  title: '首頁 - Σ-Codeatl',
  description: 'Σ-Codeatl 軟體技術實戰學習地圖，掌握從 JS 到架構設計的硬核開發能力',
};

const DEFAULT_JOURNEY_SLUG = "software-design-pattern";

export default async function HomePage() {
  const [announcement, courses, resourceCards, instructor, defaultJourney] = await Promise.all([
    homeService.getAnnouncement(),
    homeService.getFeaturedCourses(),
    homeService.getResourceCards(),
    homeService.getInstructor(),
    journeyService.getJourneyBySlug(DEFAULT_JOURNEY_SLUG),
  ]);

  return (
    <>
      <div className="pb-10">
        {/* 1. 頂部廣告條 */}
        <AnnouncementBar data={announcement} />

        {/* 2. 歡迎區塊與主打課程 */}
        <WelcomeSection courses={courses} />

        {/* 3. 資源連結方格 */}
        <ResourceGrid cards={resourceCards} />

        {/* 4. 講師介紹與 Footer */}
        <InstructorSection instructor={instructor} />
      </div>
    </>

  );
}