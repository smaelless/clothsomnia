import type { NextConfig } from "next";

/**
 * `next dev` and `next build` both write to .next by default, so running a
 * build while the dev server is up corrupts the dev chunks and the browser
 * dies with "__webpack_modules__[moduleId] is not a function".
 *
 * Local builds therefore go to their own directory. Vercel, however, runs
 * `npm run build` and then looks for .next specifically — redirecting the
 * output there breaks the deploy with a missing routes-manifest.
 *
 * So the override is honoured locally and ignored in CI: both problems fixed,
 * neither trading against the other.
 */
const isCI = Boolean(process.env.VERCEL || process.env.CI);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: isCI ? ".next" : (process.env.NEXT_DIST_DIR ?? ".next"),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
