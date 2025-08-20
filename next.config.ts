import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ignoring TypeScript errors during build
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true
  },};

export default nextConfig;
