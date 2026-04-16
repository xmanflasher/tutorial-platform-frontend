import { 
    Announcement, 
    Course, 
    ResourceCard, 
    Instructor, 
    LeaderboardMember, 
    JourneyDetail, 
    MemberMission 
} from '@/types';
import { User } from '@/context/AuthContext';

export const MOCK_USER: User = {
    id: 100,
    name: '驗收大神 (Mock)',
    nickName: '大神本尊',
    email: 'god_mode@mock.tw',
    avatar: '/images/avatar_1.png',
    level: 99,
    exp: 99999,
    nextLevelExp: 100000,
    role: 'ADMIN',
    jobTitle: '軟體架構導讀者',
    region: 'Σ-Sector 01'
};

// ==========================================
// 全自動同步的 Mock 資料 (Generated)
// ==========================================
import { MOCK_MEMBERS } from './membersMock';
import { MOCK_JOURNEYS } from './journeysMock';
import { MOCK_LESSONS } from './lessonsMock';
import { MOCK_CHAPTERS } from './chaptersMock';
import { MOCK_GYMS } from './gymsMock';
import { MOCK_CHALLENGES } from './challengesMock';
import { MOCK_MISSIONS as MOCK_MISSIONS_RAW } from './missionsMock';
import { MOCK_JOURNEY_MENUS } from './journey_menusMock';
import { MOCK_LESSON_CONTENTS } from './lesson_contentsMock';
import { MOCK_GYM_BADGES } from './gym_badgesMock';
import { MOCK_MISSION_REQUIREMENTS } from './mission_requirementsMock';

// 匯出 Generated 原始資料
export { 
    MOCK_MEMBERS, MOCK_JOURNEYS, MOCK_LESSONS, MOCK_CHAPTERS, 
    MOCK_GYMS, MOCK_CHALLENGES, MOCK_MISSIONS_RAW, MOCK_JOURNEY_MENUS,
    MOCK_LESSON_CONTENTS, MOCK_GYM_BADGES, MOCK_MISSION_REQUIREMENTS
};

// ==========================================
// 首頁相關 Mock Data (手動定義或整合)
// ==========================================

// 廣告條
export const MOCK_ANNOUNCEMENT: Announcement = {
  id: 1,
  message: 'Σ-Codeatl 開幕慶：看完全部影片即可獲得課程折價券！',
  linkText: '前往修煉',
  linkHref: '/journeys/software-design-pattern',
};

// 首頁精選課程 (從 Generated 資料動態組合成 Course 格式)
export const MOCK_FEATURED_COURSES: Course[] = MOCK_JOURNEYS
    .filter((j: any) => j.visible !== false) // 尊重隱身屬性
    .sort((a: any, b: any) => a.id - b.id)    // 依照 ID 排序
    .slice(0, 3)                             // 只取前三門
    .map((j: any) => {
        const instructor = MOCK_MEMBERS.find(m => m.id === j.instructorId);
        return {
            id: j.id,
            title: j.name,
            subtitle: instructor ? `${instructor.name} 的專業課程` : '尚硅谷經典教程',
            author: instructor?.name || 'Σ-Codeatl 導師',
            description: j.description || '',
            slug: j.slug,
            statusLabel: j.id === 6 ? '免費課程' : '尚未擁有',
            primaryAction: { 
                text: j.id === 6 ? '開始學習' : '試聽課程', 
                href: `/journeys/${j.slug}`, 
                style: 'solid' 
            },
            image: `/images/course_${j.id}.png`
        };
    });

// 資源卡片
export const MOCK_RESOURCE_CARDS: ResourceCard[] = [
  {
    id: 1,
    iconName: 'BookOpen',
    title: 'JavaScript 基礎實戰完整課程',
    description: '從零開始學 JavaScript，透過實作掌握 DOM、非同步與 API。',
    primaryAction: { text: '查看課程', href: '/courses' },
  },
  {
    id: 2,
    iconName: 'FileText',
    title: 'Σ-Codeatl 技術專欄',
    description: '觀看講師撰寫的軟體工程師職涯、軟體設計模式及架構學問，及領域驅動設計等公開文章。',
    primaryAction: { text: '閱讀文章', href: 'https://blog.codeatl.tw' },
  },
  {
    id: 3,
    iconName: 'Users',
    title: '直接與老師或是其他工程師交流',
    description: '加入 Σ-Codeatl 成立的工程師 Discord 社群，與講師以及其他工程師線上交流，培養學習習慣及樂趣。',
    primaryAction: { text: '加入 Facebook 社團', href: '#' },
    secondaryAction: { text: '加入 Discord', href: '#' },
  },
  {
    id: 4,
    iconName: 'Award',
    title: '技能評級及證書系統',
    description: '通過技能評級、獲取證書，打造你的職涯籌碼，讓你在就業市場上脫穎而出。',
    primaryAction: { text: '了解更多', href: '/certification' },
  },
];

// 導師資訊
export const MOCK_INSTRUCTOR: Instructor = {
  name: '李立超 (超哥)',
  title: '尚硅谷前端高級講師 & 經典 JS 教程作者',
  description: '具備多年開發與教學經驗。對 JavaScript 基礎、ES 標準、DOM、BOM 擁有深厚造詣。其 140 集實戰教學影片是無數前端開發者的啟蒙經典。',
  avatar: '/images/li-lichao.jpg',
  achievements: [
    '【尚硅谷】JavaScript 教程 140 集實戰教學作者',
    '累計播放次數超過數百萬次，啟蒙無數前端新人',
    '精通 ES 標準、BOM、DOM 以及前端全棧技術',
    '熱衷於開源技術分享與 IT 教育體系建構',
  ],
  socialLinks: {
    facebook: '#',
    youtube: '#',
    instagram: '#',
  },
};

// 排行榜
export const MOCK_LEADERBOARD: LeaderboardMember[] = [
  { id: 1, rank: 1, name: 'Elliot', jobTitle: '初級工程師', level: 19, exp: 31040, avatar: 'E' },
  { id: 2, rank: 2, name: '精靈Ken Lin', jobTitle: '初級工程師', level: 18, exp: 29130, avatar: 'K' },
  { id: 3, rank: 3, name: 'Clark Chen', jobTitle: '初級工程師', level: 17, exp: 27260, avatar: 'C' },
  { id: 4, rank: 4, name: 'Adam Huang', jobTitle: '初級工程師', level: 16, exp: 25440, avatar: 'A' },
  { id: 5, rank: 5, name: '酥炸香菇天婦羅', jobTitle: '初級工程師', level: 16, exp: 25374, avatar: 'S' },
  { id: 6, rank: 6, name: 'Bella Wu', jobTitle: '初級工程師', level: 15, exp: 24050, avatar: 'B' },
  { id: 7, rank: 7, name: 'David Lee', jobTitle: '初級工程師', level: 15, exp: 23890, avatar: 'D' },
  { id: 8, rank: 8, name: 'Fiona Chang', jobTitle: '初級工程師', level: 14, exp: 22560, avatar: 'F' },
  { id: 9, rank: 9, name: 'George Wang', jobTitle: '初級工程師', level: 14, exp: 22340, avatar: 'G' },
  { id: 10, rank: 10, name: 'Hannah Lin', jobTitle: '初級工程師', level: 13, exp: 21020, avatar: 'H' },
];

// ==========================================
// 旅程詳情 (Journey Detail)
// ==========================================

const SDP_DATA: JourneyDetail = {
  id: 1,
  slug: 'software-design-pattern',
  title: '軟體設計模式精通之旅',
  subtitle: '「用一趟旅程的時間，成為硬核的 Coding 高手。」',
  description: `這門課帶你從軟體抽象思維出發，透過將「無形變有形」來掌握高效率的迭代式設計思路。並以 Christopher Alexander 更細膩的思路來解析設計模式。
  
  並透過由淺入深的題目及線上 Code Review 服務，使你一路鍛鍊變強，用數個月的時間，就能掌握七年的進階軟體架構設計能力。最終透過三大複雜框架的鍛鍊，使你能游刃有餘地獨立分析、設計及開發出任何實戰框架，成為軟體設計的佼佼者。`,
  totalVideos: 49,
  tags: ['大量實戰題'],
  price: 3000,
  features: ['中文課程', '支援行動裝置', '專業的完課認證'],
  actionButtons: {
    primary: '立即加入課程',
    secondary: '預約 1v1 諮詢'
  },
  chapters: [
    {
      id: 0,
      name: '課程介紹 & 試聽',
      lessons: [
        { id: 'l1', name: '課程導覽：為什麼你需要這門課？', type: 'video', premiumOnly: true, videoLength: '05:30' },
        { id: 'l2', name: '試聽：策略模式 (Strategy Pattern)', type: 'video', premiumOnly: true, videoLength: '12:15' },
      ]
    },
    {
      id: 1,
      name: '副本零：冒險者指引',
      lessons: [
        { id: 'l3', name: '平台使用手冊', type: 'scroll' },
        { id: 'l4', name: '如何使用課程贊助給大家的專業 UML Editor — Astah Pro ?', type: 'scroll' },
        { id: 'l5', name: '加入 Discord 學員專屬社群', type: 'scroll' },
      ]
    },
    {
      id: 2,
      name: '副本一：行雲流水的設計底層思路',
      lessons: [
        { id: 'l6', name: '物件導向基礎回顧', type: 'video', videoLength: '15:00' },
        { id: 'l7', name: '內聚力與耦合度 (Cohesion & Coupling)', type: 'video', videoLength: '20:10' },
        { id: 'l8', name: 'SOLID 原則實戰解析', type: 'video', videoLength: '35:20' },
      ]
    },
    {
      id: 3,
      name: '副本二：Christopher Alexander 設計模式',
      lessons: [
        { id: 'l9', name: '設計模式起源', type: 'video', videoLength: '10:00' },
        { id: 'l10', name: '工廠模式 (Factory Pattern)', type: 'video', videoLength: '25:00' },
        { id: 'l11', name: '觀察者模式 (Observer Pattern)', type: 'video', videoLength: '22:30' },
      ]
    },
    {
      id: 4,
      name: '副本三：複雜框架實戰演練',
      lessons: [
        { id: 'l12', name: 'RPG 遊戲戰鬥系統架構', type: 'video', videoLength: '40:00' },
        { id: 'l13', name: '電商訂單狀態機設計', type: 'video', videoLength: '45:00' },
      ]
    },
    {
      id: 5,
      name: '副本四：規模化架構思維',
      lessons: []
    },
    {
      id: 6,
      name: '副本五：生命週期及控制反轉',
      lessons: []
    }
  ],
  menus: [
    { name: "所有單元(Mock)", href: "/journeys/software-design-pattern", icon: "layers" },
    { name: "挑戰地圖(Mock)", href: "/journeys/software-design-pattern/map", icon: "map" }, // 修正連結
    { name: "SOP 寶典(Mock)", href: "/journeys/software-design-pattern/sop", icon: "book-open" }
  ],
  missions: [], // 已補上
  gyms: [],    // 已補上
};

const AI_BDD_DATA: JourneyDetail = {
  id: 2,
  slug: 'ai-bdd',
  title: 'AI x BDD：規格驅動全自動開發術',
  subtitle: '用半年的時間，徹底學會如何結合 TDD、BDD 與 AI，實現 100% 全自動化開發。',
  description: `這門課程要帶你「用半年的時間，徹底學會如何結合 TDD、BDD 與 AI，實現 100% 全自動化、高精準度的程式開發」。上完課後，你不只是理解方法，更能真正把 AI 落實到專案裡，從此不再困在無止盡的 Debug 與 Review，而是成為團隊裡能制定規格與標準的工程師。

在這趟學習過程中，你將透過影音課程、專屬社群、每週研討會與實戰演練，逐步掌握如何用規格驅動開發，讓 AI 自動完成從測試到程式修正的一整套流程。`,
  totalVideos: 8,
  tags: ['大量實戰題', 'AI 自動化'],
  price: 7599,
  features: ['中文課程', '支援行動裝置', '專業的完課認證'],
  actionButtons: {
    primary: '立即加入課程',
    secondary: ''
  },
  chapters: [
    { id: 1, name: '規格驅動開發的前提', lessons: [] },
    { id: 2, name: '100% 全自動化開發的脈絡：規格的光譜', lessons: [] },
    { id: 3, name: '70% 自動化：測試驅動開發', lessons: [] },
    { id: 4, name: '80% 自動化：行為驅動開發 (BDD)', lessons: [] },
    { id: 5, name: '90% 自動化：指令集架構之可執行規格', lessons: [] },
    { id: 6, name: '99% 自動化：為企業打造專屬 BDD Master Agent', lessons: [] },
    { id: 7, name: '100% 自動化：超 AI 化全自動化開發 in 敏捷/DevOps', lessons: [] }
  ],
  menus: [
    { name: "所有單元(Mock)", href: "/journeys/ai-bdd", icon: "layers" },
    { name: "Prompt 寶典(Mock)", href: "/journeys/ai-bdd/prompts", icon: "sparkles" },
  ],
  missions: [], // 已補上
  gyms: [],    // 已補上
};

// ★ 新增：任務 Mock 資料
export const MOCK_MISSIONS: MemberMission[] = [
  {
    missionId: 1,
    name: "初入茅廬",
    description: "觀看第一章的所有影片",
    status: "AVAILABLE",
    rewardDescription: "經驗值 100",
    unlockConditionDescription: "無",
    duration: 30,
    deadline: null,
    currentProgress: 0,
    opportunityCardsUsed: 0,
    maxOpportunityCards: 2,
    isExtendable: false
  },
  {
    missionId: 2,
    name: "實戰演練",
    description: "完成道館挑戰",
    status: "LOCKED",
    rewardDescription: "金幣 50, 經驗值 200",
    unlockConditionDescription: "需先完成：初入茅廬",
    duration: 30,
    deadline: null,
    currentProgress: 0,
    opportunityCardsUsed: 0,
    maxOpportunityCards: 2,
    isExtendable: false
  }
];

// ★★★ 關鍵：整合到一個大物件中，用 Slug 當作 Key ★★★
export const JOURNEY_MAP: Record<string, JourneyDetail> = {
  'software-design-pattern': SDP_DATA,
  'ai-bdd': AI_BDD_DATA,
  'javascript-basics-140': {
      id: 3,
      slug: 'javascript-basics-140',
      title: 'JavaScript 基礎實戰 (140集精通)',
      subtitle: '從零基礎到精通 DOM/BOM 實戰',
      description: '本課程涵蓋了 ES 標準、BOM 以及 DOM 的大部分內容，適合有一定 HTML 和 CSS 基礎的同學學習。透過對該課程的学习，可以使同學初步掌握 JavaScript，對面向對象的語言有一個初步的理解。',
      totalVideos: 140,
      tags: ['零基礎', '尚硅谷'],
      price: 0,
      features: ['免費課程', '尚硅谷出品', '140集精華'],
      actionButtons: { primary: '立即開始', secondary: '' },
      chapters: [
          { id: 1, name: 'JavaScript 基礎語法', lessons: [] },
          { id: 2, name: 'DOM 操作實戰', lessons: [] },
          { id: 3, name: 'BOM 與事件處理', lessons: [] }
      ],
      menus: [],
      missions: [],
      gyms: []
  }
};

// 為了方便列表顯示，也可以匯出一個陣列
export const ALL_JOURNEYS = Object.values(JOURNEY_MAP);