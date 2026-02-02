// 後端 API 位址
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ★ 關鍵開關：判斷是否使用 Mock 資料 (通常在開發環境開啟)
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// 模擬網路延遲，讓 Mock 更有真實感
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));