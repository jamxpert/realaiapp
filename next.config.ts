import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Put the CSS (about 8 KB compressed, thanks to Tailwind) in the HTML, so the first paint
    // doesn't wait for a separate stylesheet download. Faster for first-time visitors on mobile.
    inlineCss: true,
  },
  images: {
    // YouTube thumbnails for the <YouTube> video facade.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
