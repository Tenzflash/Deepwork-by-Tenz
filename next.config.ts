import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixes the ESLint issue so the build doesn't fail on warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // This is the CRITICAL fix for "Unexpected token <" on Vercel
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'deepwork-by-tenz.vercel.app'
      ],
    },
  },
};

export default nextConfig;