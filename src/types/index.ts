// 定義課程的資料結構
export interface Course {
  id: string;
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
  id: string;
  rank: number; // 排名
  name: string;
  title: string; // 頭銜 (e.g. 初級工程師)
  level: number;
  score: number;
  avatar?: string; // 頭像 URL (選填)
  trend?: 'up' | 'down' | 'same';
}

// 1. 頂部廣告條
export interface Announcement {
  id: string;
  message: string;
  linkText: string;
  linkHref: string;
}

// 2. 資源連結卡片 (首頁中間的四個區塊)
export interface ResourceCard {
  id: string;
  iconName: 'BookOpen' | 'FileText' | 'Users' | 'Award'; // 對應 Lucide Icon 字串
  title: string;
  description: string;
  primaryAction: { text: string; href: string };
  secondaryAction?: { text: string; href: string }; // 給 Discord 用
}

// 3. 講師資訊
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

// 單元 (Lesson)
export interface Lesson {
  id: string;
  name: string;
  type: 'video' | 'scroll' | 'google-form'| 'boss';
  premiumOnly?: boolean; // 是否為試看
  videoLength?: string; // e.g. "10:05"
}

// 章節 (Chapter)
export interface Chapter {
  id: string;
  name: string;
  lessons: Lesson[];
}
//選單介面 (sidebar)
export interface JourneyMenu {
  name: string;
  href: string;
  icon: string; // 後端傳來的是字串 key

}

// 旅程詳情頁 (Journey Detail)
export interface JourneyDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string; // "用一趟旅程的時間..."
  description: string; // 長文簡介
  totalVideos: number;
  tags: string[]; // e.g. ["大量實戰題"]
  chapters: Chapter[]; // 課程大綱
  menus: JourneyMenu[];
  // 右側資訊
  certificateImage?: string;
  features: string[]; // e.g. ["中文課程", "支援行動裝置", "專業的完課認證"]
  price: number;
  actionButtons: {
    primary: string; // "立即加入課程"
    secondary: string; // "預約 1v1 諮詢"
  };
}