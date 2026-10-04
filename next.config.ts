import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
