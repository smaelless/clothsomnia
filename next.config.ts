import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * `next dev` and `next build` both write to .next by default, so running a
   * build while the dev server is up corrupts the dev chunks and the browser
   * dies with "__webpack_modules__[moduleId] is not a function".
   *
   * Builds go to their own directory instead, so the two can never collide.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
