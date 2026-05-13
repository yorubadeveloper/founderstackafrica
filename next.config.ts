import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "fuse.js"],
  },
};

export default nextConfig;
