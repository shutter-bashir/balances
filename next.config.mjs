import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  // `next dev` builds into its own folder. Netlify's deploy renames .next, and on Windows
  // that fails ("Failed publishing static content") while a dev server holds files in it.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  // Keep local-only files out of the server bundles uploaded to the host. data/ holds
  // balances written by the dev server; IMAGES/ is the source for public/card-images.
  outputFileTracingExcludes: {
    "/**": ["./data/**/*", "./IMAGES/**/*", "./*.md"],
  },
});

export default nextConfig;
