# 階段 1: 基礎設置
FROM node:20-alpine AS base
WORKDIR /app
# 設定環境變數，關閉 Next.js 遙測功能
ENV NEXT_TELEMETRY_DISABLED 1

# 階段 2: 依賴安裝
FROM base AS deps
# 複製 package.json 和 package-lock.json (NPM 的鎖定檔案)
COPY package.json package-lock.json ./
# 使用 npm ci 進行乾淨安裝 (適用於 CI/CD 環境)
RUN npm ci

# 階段 3: 建構 Next.js 應用程式
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
# 複製專案其餘檔案
COPY . .
# 執行 Next.js 建構命令 (使用 npm)
RUN npm run build

# 階段 4: 運行時 (輕量級)
FROM base AS runner
# 設置非 root 用戶以提高安全性
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 複製建構好的檔案和運行所需的檔案
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
# 啟動 Next.js 服務 (使用 npm)
CMD ["npm", "start"]