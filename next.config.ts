/*
 * Next.js config.
 *
 * Vue 3 equivalent: vite.config.js.
 *
 * turbopack.root: this folder is the project root. Without it, Next looks for
 * the nearest lockfile and may pick an unrelated one in a parent folder
 * ("workspace root" warning).
 */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
