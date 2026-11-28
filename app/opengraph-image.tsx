import { site } from "@/data/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

// Built once into a file at build time (the site is a static export).
export const dynamic = "force-static";
export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: `${site.tagline} Honest reviews and tutorials in English and Roman Urdu.` });
}
