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

// =============================================================================
// 1. 環境變數設定與開關
// =============================================================================
import { API_BASE_URL, USE_MOCK_DATA, delay } from '@/lib/api-config';

// =============================================================================
// 2. API 實作
// =============================================================================

/**
 * 取得單一旅程詳情 (支援 Mock/Fetch 切換)
 */
export async function getJourneyBySlug(slug: string): Promise<JourneyDetail> {
  // [模式 A] Mock Data
  if (USE_MOCK_DATA) {
    console.log(`[API Mode: MOCK] 讀取假資料 slug: ${slug}`);
    await delay(200);
    const journey = JOURNEY_MAP[slug];
    if (!journey) {
      console.warn(`[Mock] 找不到 slug="${slug}" 的資料，回傳預設值。`);
      return JOURNEY_MAP['software-design-pattern'];
    }
    return journey;
  }

  // [模式 B] Real Fetch
  // 這是您之前缺少的「真實請求」邏輯
  const url = `${API_BASE_URL}/journeys/${slug}`;
  console.log(`[API Mode: REAL] 正在請求後端: ${url}`);
  console.log(`[API Debug] 正在請求 URL: ${url}`);
  try {
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`Backend response status: ${res.status}`);
    }
    
    const data = await res.json();
    // 資料補全 (因為後端目前沒有圖片欄位，前端補上以免畫面壞掉)
    return {
      ...data,
      slug: data.slug || slug || 'software-design-pattern',
      certificateImage: '/images/certificate-placeholder.jpg',
      features: ['中文課程', '支援行動裝置', '專業的完課認證'],
      // 防呆：確保按鈕欄位存在
      actionButtons: data.actionButtons || { primary: '立即加入', secondary: '了解更多' }
    };

  } catch (error) {
    console.error(`[API Error] 請求失敗，自動降級回傳 Mock 資料以維持顯示`, error);
    // 降級策略：連不上後端時，暫時顯示 Mock，避免畫面全白
    return JOURNEY_MAP[slug] || JOURNEY_MAP['software-design-pattern'];
  }
}

/**
 * 取得課程列表 (支援 Mock/Fetch 切換)
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  if (USE_MOCK_DATA) {
    console.log(`[API Mode: MOCK] 讀取假課程列表`);
    await delay(300);
    return MOCK_FEATURED_COURSES;
  }

  const url = `${API_BASE_URL}/journeys`;
  console.log(`[API Mode: REAL] 正在請求後端: ${url}`);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch courses');
    
    const data: JourneyDetail[] = await res.json();

    // DTO 轉換：後端回傳的是 JourneyDetail 陣列，首頁卡片需要 Course 格式
    return data.map(journey => ({
      id: journey.id,
      title: journey.title,
      subtitle: journey.subtitle,
      author: '水球潘', 
      description: journey.description,
      slug: journey.slug,
      
      // [修正] 這裡如果不給圖片，真實模式下就會沒有封面圖
      // 因為後端目前還沒回傳 imageUrl，我們先用前端的邏輯給它一張預設圖
      // 如果是 AI 課程就給 AI 圖，否則給設計模式圖 (這是一個暫時的 UI 邏輯)
      image: journey.slug.includes('ai') 
        ? '/images/course_4.png' // 確保您的 public/images 有這張圖
        : '/images/course_0.png',
        
      tags: journey.tags,
      statusLabel: '尚未擁有',
      couponText: journey.price > 3000 ? '你有一張 3,000 折價券' : undefined,
      primaryAction: { 
        text: '試聽課程', 
        href: `/journeys/${journey.slug}`, 
        style: 'solid' 
      },
      secondaryAction: { 
        text: '立刻購買', 
        href: '#', 
        style: 'outline' 
      }
    }));

  } catch (error) {
    console.error(`[API Error] 課程列表請求失敗`, error);
    return MOCK_FEATURED_COURSES;
  }
}

// --- 以下 API 後端尚未實作，目前維持 Mock ---

export async function getAnnouncement(): Promise<Announcement> {
  await delay(100);
  return MOCK_ANNOUNCEMENT;
}

export async function getResourceCards(): Promise<ResourceCard[]> {
  await delay(200);
  return MOCK_RESOURCE_CARDS;
}

export async function getInstructor(): Promise<Instructor> {
  await delay(200);
  return MOCK_INSTRUCTOR;
}

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  await delay(400);
  return MOCK_LEADERBOARD;
}