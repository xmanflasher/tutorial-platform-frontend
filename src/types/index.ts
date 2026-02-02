// src/types/index.ts

// ==========================================
// 1. 公開頁面與行銷相關 (Courses, Leaderboard, Ads)
// ==========================================

// 定義課程的資料結構 (首頁卡片用)
export interface Course {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  description: string;
  slug: string;
  image?: string;
  tags?: string[];

  // 新增欄位以支援截圖 UI
  statusLabel?: string;     // e.g. "尚未擁有"
  couponText?: string;      // e.g. "你有一張 3,000 折價券"
  primaryAction: {          // 主按鈕 (e.g. 試聽課程、僅限付費)
    text: string;
    href: string;
    style: 'solid' | 'outline' | 'disabled';
  };
  secondaryAction?: {       // 次按鈕 (e.g. 立刻購買)
    text: string;
    href: string;
    style: 'solid' | 'outline';
  };
}

// 定義排行榜使用者的資料結構
export interface LeaderboardUser {
  id: number;
  rank: number; // 排名
  name: string;
  title: string; // 頭銜 (e.g. 初級工程師)
  level: number;
  score: number;
  avatar?: string; // 頭像 URL (選填)
  trend?: 'up' | 'down' | 'same';
}

// 頂部廣告條
export interface Announcement {
  id: number;
  message: string;
  linkText: string;
  linkHref: string;
}

// 資源連結卡片 (首頁中間的四個區塊)
export interface ResourceCard {
  id: number;
  iconName: 'BookOpen' | 'FileText' | 'Users' | 'Award'; // 對應 Lucide Icon 字串
  title: string;
  description: string;
  primaryAction: { text: string; href: string };
  secondaryAction?: { text: string; href: string }; // 給 Discord 用
}

// 講師資訊
export interface Instructor {
  name: string;
  title: string;
  description: string;
  achievements: string[]; // 條列式經歷
  avatar: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    line?: string;
  };
}

export interface Reward {
  exp: number;
  coin: number;
  subscriptionExtensionInDays: number;
  journeyId: number;
  externalRewardDescription: string;
}
// ==========================================
// ★★★ 核心修改：引入 Journey 相關定義 ★★★
// ==========================================
// 這裡會自動匯出 Journey.ts 裡面的所有 export
// 包含：Gym, Chapter, JourneyDetail, MemberMission, GymStatus, RenderStage...等
export * from './Journey';
export * from './Gym';
export * from './record';