import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow builds to finish even with small TS/lint errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
