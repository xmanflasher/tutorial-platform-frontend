import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 👇 新增這兩行
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
    domains: ['cdn.waterballsa.tw'], // 允許此網域的圖片
  },
};

export default nextConfig;