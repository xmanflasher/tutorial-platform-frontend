import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // 支援 SVG 圖片
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // ✅ 將所有網域都統一寫在 remotePatterns
    remotePatterns: [
      {
        // 針對 DiceBear 頭像 API
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**", // 允許該網域下的所有路徑
      },
      {
        // 針對 WaterballSA CDN (原 domains 設定移過來這裡)
        protocol: "https",
        hostname: "cdn.waterballsa.tw",
        port: "",
        pathname: "/**", // 允許該網域下的所有路徑
      },
    ],
  },
};

export default nextConfig;