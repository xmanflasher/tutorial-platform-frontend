// src/lib/api-config.ts

// 後端 API 位址
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ★ 關鍵開關：判斷是否使用 Mock
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// 模擬延遲 (Mock 模式用)
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));