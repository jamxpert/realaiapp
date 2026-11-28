import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Built once into a file at build time (the site is a static export).
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
