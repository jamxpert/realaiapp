import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is built ahead of time into plain files in out/, which Cloudflare serves
  // (see wrangler.jsonc). No server runs, so security headers live in public/_headers.
  output: "export",
  poweredByHeader: false,
  experimental: {
    // Put the CSS (about 8 KB compressed, thanks to Tailwind) in the HTML, so the first paint
    // doesn't wait for a separate stylesheet download. Faster for first-time visitors on mobile.
    inlineCss: true,
  },
  images: {
    // A static site has no image server, so images are served as they are.
    // Keep cover images small (WebP or compressed PNG, about 1200px wide).
    unoptimized: true,
  },
};

export default nextConfig;
