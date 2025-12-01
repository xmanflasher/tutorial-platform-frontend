import { 
  Announcement, 
  Course, 
  ResourceCard, 
  Instructor, 
  LeaderboardUser,
  JourneyDetail 
} from '@/types';
import { 
  MOCK_ANNOUNCEMENT, 
  MOCK_FEATURED_COURSES, 
  MOCK_RESOURCE_CARDS, 
  MOCK_INSTRUCTOR, 
  MOCK_LEADERBOARD,
  JOURNEY_MAP 
} from '@/mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAnnouncement(): Promise<Announcement> {
  await delay(100);
  return MOCK_ANNOUNCEMENT;
}

export async function getFeaturedCourses(): Promise<Course[]> {
  await delay(300);
  return MOCK_FEATURED_COURSES;
}

export async function getResourceCards(): Promise<ResourceCard[]> {
  await delay(200);
  return MOCK_RESOURCE_CARDS;
}

export async function getInstructor(): Promise<Instructor> {
  await delay(200);
  return MOCK_INSTRUCTOR;
}

export async function getLeaderboard(type: 'learning' | 'growth' = 'learning'): Promise<LeaderboardUser[]> {
  await delay(400);
  // 這裡未來可以根據 type 回傳不同資料，目前先回傳同一份
  return MOCK_LEADERBOARD;
}

export async function getJourneyBySlug(slug: string) {
  // 模擬 API 延遲
  // await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`[API] Fetching journey for slug: ${slug}`);
  const journey = JOURNEY_MAP[slug];
  if (!journey) {
    console.warn(`[API] ⚠️ Journey not found for slug "${slug}". Fallback to default.`);
    // 預設回傳設計模式，或是丟出 404
    return JOURNEY_MAP['software-design-pattern'];
  }
  return journey;
}