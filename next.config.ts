import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["i.ytimg.com"], // Allow images from YouTube's CDN
  },
};

export default nextConfig;
