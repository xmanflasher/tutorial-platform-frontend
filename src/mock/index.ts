import { Announcement, Course, ResourceCard, Instructor, LeaderboardUser, JourneyDetail } from '@/types';

// 廣告條
export const MOCK_ANNOUNCEMENT: Announcement = {
  id: 'ann-1',
  message: '將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！',
  linkText: '前往',
  linkHref: '/courses/design-patterns-journey',
};

// 課程列表 (更新為支援新的 UI 欄位)
export const MOCK_FEATURED_COURSES: Course[] = [
  {
    id: 'c1',
    title: '軟體設計模式精通之旅',
    subtitle: '用一趟旅程的時間，成為硬核的 Coding 實戰高手',
    author: '水球潘',
    description: '用一趟旅程的時間，成為硬核的 Coding 實戰高手',
    slug: 'design-patterns',
    statusLabel: '尚未擁有',
    couponText: '你有一張 3,000 折價券',
    primaryAction: { text: '試聽課程', href: '/courses/trial/dp', style: 'solid' },
    secondaryAction: { text: '立刻購買', href: '/checkout/dp', style: 'outline' },
    tags: ['軟體架構', '設計模式'],
    image: '/images/course_0.png'
  },
  {
    id: 'c2',
    title: 'AI x BDD：規格驅動全自動開發術',
    subtitle: 'AI Top 1% 工程師必修課，掌握規格驅動的全自動化開發',
    author: '水球潘',
    description: 'AI Top 1% 工程師必修課，掌握規格驅動的全自動化開發',
    slug: 'ai-bdd',
    statusLabel: '尚未擁有',
    // 這門課沒有折價券，測試無 Coupon 的狀態
    primaryAction: { text: '僅限付費', href: '#', style: 'disabled' },
    secondaryAction: { text: '立刻購買', href: '/checkout/ai-bdd', style: 'outline' },
    tags: ['AI', 'BDD'],
    image: '/images/course_4.png'    
  },
  // 可以多加一筆測試 Grid 3 欄效果
  {
    id: 'c3',
    title: 'Clean Architecture 實戰',
    subtitle: '打造可維護、可測試的架構',
    author: '水球潘',
    description: '深入解析 Clean Architecture，並透過實戰專案演練',
    slug: 'clean-arch',
    statusLabel: '已擁有',
    primaryAction: { text: '開始上課', href: '/courses/clean-arch', style: 'solid' },
    tags: ['架構'],
  },
];

// 1. 定義個別課程資料 (這裡放你原本的內容，為了版面我先省略詳細文字)
export const MOCK_RESOURCE_CARDS: ResourceCard[] = [
  {
    id: 'r1',
    iconName: 'BookOpen',
    title: '軟體設計模式之旅課程',
    description: '「用一趟旅程的時間，成為硬核的 Coding 高手」—— 精通一套高效率的 OOAD 思路。',
    primaryAction: { text: '查看課程', href: '/courses' },
  },
  {
    id: 'r2',
    iconName: 'FileText',
    title: '水球潘的部落格',
    description: '觀看水球撰寫的軟體工程師職涯、軟體設計模式及架構學問，以及領域驅動設計等公開文章。',
    primaryAction: { text: '閱讀文章', href: 'https://blog.waterballsa.tw' },
  },
  {
    id: 'r3',
    iconName: 'Users',
    title: '直接與老師或是其他工程師交流',
    description: '加入水球成立的工程師 Discord 社群，與水球以及其他工程師線上交流，培養學習習慣及樂趣。',
    primaryAction: { text: '加入 Facebook 社團', href: '#' },
    secondaryAction: { text: '加入 Discord', href: '#' },
  },
  {
    id: 'r4',
    iconName: 'Award',
    title: '技能評級及證書系統',
    description: '通過技能評級、獲取證書，打造你的職涯籌碼，讓你在就業市場上脫穎而出。',
    primaryAction: { text: '了解更多', href: '/certification' },
  },
];

export const MOCK_INSTRUCTOR: Instructor = {
  name: '水球潘',
  title: '七年程式教育者 & 軟體設計學講師',
  description: '致力於將複雜的軟體設計概念轉化為易於理解和實踐的教學內容。',
  avatar: '/images/instructor-avatar.jpg',
  achievements: [
    '主修 Christopher Alexander 設計模式、軟體架構、分散式系統架構、Clean Architecture、領域驅動設計等領域',
    '過去 40 多場 Talk 平均 93 位觀眾參與',
    '主辦的學院社群一年內成長超過 6000 位成員',
    '帶領軟體工程方法論學習組織「GaaS」超過 200 多位成員，引領 30 組自組織團隊',
    '領域驅動設計社群核心志工 & 講師',
  ],
  socialLinks: {
    facebook: '#',
    youtube: '#',
    instagram: '#',
  },
};

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', rank: 1, name: 'Elliot', title: '初級工程師', level: 19, score: 31040, avatar: 'E' },
  { id: 'u2', rank: 2, name: '精靈Ken Lin', title: '初級工程師', level: 18, score: 29130, avatar: 'K' },
  { id: 'u3', rank: 3, name: 'Clark Chen', title: '初級工程師', level: 17, score: 27260, avatar: 'C' },
  { id: 'u4', rank: 4, name: 'Adam Huang', title: '初級工程師', level: 16, score: 25440, avatar: 'A' },
  { id: 'u5', rank: 5, name: '酥炸香菇天婦羅', title: '初級工程師', level: 16, score: 25374, avatar: 'S' },
  { id: 'u6', rank: 6, name: 'Bella Wu', title: '初級工程師', level: 15, score: 24050, avatar: 'B' },
  { id: 'u7', rank: 7, name: 'David Lee', title: '初級工程師', level: 15, score: 23890, avatar: 'D' },
  { id: 'u8', rank: 8, name: 'Fiona Chang', title: '初級工程師', level: 14, score: 22560, avatar: 'F' },
  { id: 'u9', rank: 9, name: 'George Wang', title: '初級工程師', level: 14, score: 22340, avatar: 'G' },
  { id: 'u10', rank: 10, name: 'Hannah Lin', title: '初級工程師', level: 13, score: 21020, avatar: 'H' },
];

const SDP_DATA: JourneyDetail = {
  id: 'j1',
  slug: 'software-design-pattern',
  title: '軟體設計模式精通之旅',
  subtitle: '「用一趟旅程的時間，成為硬核的 Coding 高手。」',
  description: `這門課帶你從軟體抽象思維出發，透過將「無形變有形」來掌握高效率的迭代式設計思路。並以 Christopher Alexander 更細膩的思路來解析設計模式。
  
  並透過由淺入深的題目及線上 Code Review 服務，使你一路鍛鍊變強，用數個月的時間，就能掌握七年的進階軟體架構設計能力。最終透過三大複雜框架的鍛鍊，使你能游刃有餘地獨立分析、設計及開發出任何實戰框架，成為軟體設計的佼佼者。`,
  totalVideos: 49,
  tags: ['大量實戰題'],
  price: 3000, // 假設價格
  features: ['中文課程', '支援行動裝置', '專業的完課認證'],
  certificateImage: '/images/certificate-placeholder.jpg', // 需替換
  actionButtons: {
    primary: '立即加入課程',
    secondary: '預約 1v1 諮詢'
  },
  chapters: [
    {
      id: 'ch0',
      name: '課程介紹 & 試聽',
      lessons: [
        { id: 'l1', name: '課程導覽：為什麼你需要這門課？', type: 'video', isFree: true, duration: '05:30' },
        { id: 'l2', name: '試聽：策略模式 (Strategy Pattern)', type: 'video', isFree: true, duration: '12:15' },
      ]
    },
    {
      id: 'ch1',
      name: '副本零：冒險者指引',
      lessons: [
        { id: 'l3', name: '平台使用手冊', type: 'text' },
        { id: 'l4', name: '如何使用課程贊助給大家的專業 UML Editor — Astah Pro ?', type: 'text' },
        { id: 'l5', name: '加入 Discord 學員專屬社群', type: 'text' },
      ]
    },
    {
      id: 'ch2',
      name: '副本一：行雲流水的設計底層思路',
      lessons: [
        { id: 'l6', name: '物件導向基礎回顧', type: 'video', duration: '15:00' },
        { id: 'l7', name: '內聚力與耦合度 (Cohesion & Coupling)', type: 'video', duration: '20:10' },
        { id: 'l8', name: 'SOLID 原則實戰解析', type: 'video', duration: '35:20' },
      ]
    },
    {
      id: 'ch3',
      name: '副本二：Christopher Alexander 設計模式',
      lessons: [
        { id: 'l9', name: '設計模式起源', type: 'video', duration: '10:00' },
        { id: 'l10', name: '工廠模式 (Factory Pattern)', type: 'video', duration: '25:00' },
        { id: 'l11', name: '觀察者模式 (Observer Pattern)', type: 'video', duration: '22:30' },
      ]
    },
    {
      id: 'ch4',
      name: '副本三：複雜框架實戰演練',
      lessons: [
        { id: 'l12', name: 'RPG 遊戲戰鬥系統架構', type: 'video', duration: '40:00' },
        { id: 'l13', name: '電商訂單狀態機設計', type: 'video', duration: '45:00' },
      ]
    },
    {
      id: 'ch5',
      name: '副本四：規模化架構思維',
      lessons: []
    },
    {
      id: 'ch6',
      name: '副本五：生命週期及控制反轉',
      lessons: []
    }
  ],
  menus: [
    {
      name: "所有單元mock",
      href: "/journeys/software-design-pattern",
      icon: "layers"
    },
    {
      name: "挑戰地圖mock",
      href: "/challenges",
      icon: "map"
    },
    {
      name: "SOP 寶典mock",
      href: "/sop",
      icon: "book-open"
    }
  ],
};
const AI_BDD_DATA: JourneyDetail = {
  id: 'journey_ai_bdd',
  slug: 'ai-bdd',
  title: 'AI x BDD：規格驅動全自動開發術',
  subtitle: '用半年的時間，徹底學會如何結合 TDD、BDD 與 AI，實現 100% 全自動化開發。',
  description: `這門課程要帶你「用半年的時間，徹底學會如何結合 TDD、BDD 與 AI，實現 100% 全自動化、高精準度的程式開發」。上完課後，你不只是理解方法，更能真正把 AI 落實到專案裡，從此不再困在無止盡的 Debug 與 Review，而是成為團隊裡能制定規格與標準的工程師。

在這趟學習過程中，你將透過影音課程、專屬社群、每週研討會與實戰演練，逐步掌握如何用規格驅動開發，讓 AI 自動完成從測試到程式修正的一整套流程。`,
  totalVideos: 8, // 網站目前顯示數量，課程為連載形式
  tags: ['大量實戰題', 'AI 自動化'],
  price: 7599, // 原價 15999
  features: ['中文課程', '支援行動裝置', '專業的完課認證'],
  certificateImage: '/images/certificate-ai-bdd.jpg', // 需替換圖片路徑
  actionButtons: {
    primary: '立即加入課程',
    secondary: ''
  },
  chapters: [
    {
      id: 'ch1',
      name: '規格驅動開發的前提',
      lessons: []
    },
    {
      id: 'ch2',
      name: '100% 全自動化開發的脈絡：規格的光譜',
      lessons: []
    },
    {
      id: 'ch3',
      name: '70% 自動化：測試驅動開發',
      lessons: []
    },
    {
      id: 'ch4',
      name: '80% 自動化：行為驅動開發 (BDD)',
      lessons: []
    },
    {
      id: 'ch5',
      name: '90% 自動化：指令集架構之可執行規格',
      lessons: []
    },
    {
      id: 'ch6',
      name: '99% 自動化：為企業打造專屬 BDD Master Agent',
      lessons: []
    },
    {
      id: 'ch7',
      name: '100% 自動化：超 AI 化全自動化開發 in 敏捷/DevOps',
      lessons: []
    }
  ],
  menus: [
    {
      name: "所有單元mock",
      href: "/journeys/ai-bdd",
      icon: "layers"
    },
    {
      name: "Prompt 寶典mock",
      href: "/journeys/ai-bdd/prompts",
      icon: "sparkles"
    },
  ],
};
// 2. ★★★ 關鍵：整合到一個大物件中，用 Slug 當作 Key ★★★
export const JOURNEY_MAP: Record<string, JourneyDetail> = {
  'software-design-pattern': SDP_DATA,
  'ai-bdd': AI_BDD_DATA,
};

// 為了方便列表顯示，也可以匯出一個陣列
export const ALL_JOURNEYS = Object.values(JOURNEY_MAP);