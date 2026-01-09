import {
  getAnnouncement,
  getFeaturedCourses,
  getResourceCards,
  getInstructor,
  getJourneyBySlug
} from '@/lib/api';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import WelcomeSection from '@/components/home/WelcomeSection';
import ResourceGrid from '@/components/home/ResourceGrid';
import InstructorSection from '@/components/home/InstructorSection';

export const metadata = {
  title: '首頁 - 水球軟體學院',
  description: '軟體設計模式精通之旅，成為硬核的 Coding 實戰高手',
};

const DEFAULT_JOURNEY_SLUG = "software-design-pattern";

export default async function HomePage() {
  const [announcement, courses, resourceCards, instructor, defaultJourney] = await Promise.all([
    getAnnouncement(),
    getFeaturedCourses(),
    getResourceCards(),
    getInstructor(),
    getJourneyBySlug(DEFAULT_JOURNEY_SLUG),
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