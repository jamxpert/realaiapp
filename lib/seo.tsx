import type { Metadata } from "next";
import { site } from "@/data/site";
import type { Crumb } from "@/components/Breadcrumbs";

/** Absolute URL for a site path, for JSON-LD, RSS and the sitemap. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Site path, e.g. "/reviews". Used for the canonical URL and og:url. */
  path: string;
  /** True when the route has its own opengraph-image.tsx; otherwise the site image is used. */
  hasOwnImage?: boolean;
  /** Use the title as-is, without "| RealAIApps" (home page). */
  absoluteTitle?: boolean;
  article?: { publishedTime: string; modifiedTime: string; tags: string[]; section: string };
}

/**
 * Full metadata for a page. Next merges Open Graph shallowly, so every page
 * sets all of it here instead of relying on the root layout.
 */
export function pageMetadata({ title, description, path, hasOwnImage = false, absoluteTitle = false, article }: PageMetadataInput): Metadata {
  const shareTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  // Setting openGraph on a page drops the image inherited from app/opengraph-image.tsx,
  // so name it here. Routes with their own opengraph-image.tsx must not: it would win over theirs.
  const images = hasOwnImage
    ? undefined
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: site.name,
      locale: "en_US",
      ...(images ? { images } : {}),
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            tags: article.tags,
            section: article.section,
          }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, ...(images ? { images } : {}) },
  };
}

// ---------- JSON-LD ----------

export type JsonLdObject = { "@type": string } & Record<string, unknown>;

/** Renders schema.org data. "<" is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const items = Array.isArray(data) ? data : [data];
  const payload = items.length === 1 ? { "@context": "https://schema.org", ...items[0] } : { "@context": "https://schema.org", "@graph": items };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }} />
  );
}

const profiles = site.social.map((s) => s.href).filter(Boolean);

export const organization: JsonLdObject = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/icon.svg"),
  email: site.email,
  ...(profiles.length > 0 ? { sameAs: profiles } : {}),
};

export function websiteSchema(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Breadcrumbs as shown on the page. The current page (no href) uses `currentPath`. */
export function breadcrumbSchema(items: Crumb[], currentPath: string): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href ?? currentPath),
    })),
  };
}
