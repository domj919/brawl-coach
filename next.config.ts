import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.brawlify.com" },
      { protocol: "https", hostname: "cdn-old.brawlify.com" },
    ],
  },
};

export default nextConfig;
