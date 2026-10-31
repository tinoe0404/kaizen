import type { NextConfig } from "next";
import { validateEnv } from "./lib/env";

// Enforce environment variable validation at build time
validateEnv();

const isProduction = process.env.VERCEL_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 days
    deviceSizes: [360, 414, 640, 828, 1080, 1280, 1600],
  },

  async headers() {
    const headers: { source: string; headers: { key: string; value: string }[] }[] = [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];

    // Block indexing on non-production deployments
    if (!isProduction) {
      headers.push({
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      });
    }

    return headers;
  },
};

export default nextConfig;
