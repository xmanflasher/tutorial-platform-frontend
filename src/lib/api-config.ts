// 後端基礎位址 (不含 /api)
// 支援處理尾隨斜線和重複的 /api 路徑
export const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
  .replace(/\/+$/, '') // 移除尾隨斜線
  .replace(/\/api$/, ''); // 移除 /api 後綴

// 後端 API 位址 (含 /api)
export const API_BASE_URL = `${BASE_URL}/api`;

// ★ 關鍵開關：判斷是否使用 Mock 資料 (通常在開發環境開啟)
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// 模擬網路延遲，讓 Mock 更有真實感
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));