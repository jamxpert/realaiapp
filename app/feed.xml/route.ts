import { site } from "@/data/site";
import { getArticles, typeConfig } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

// Written to a static file at build time.
export const dynamic = "force-static";

const MAX_ITEMS = 30;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822 date for RSS, from YYYY-MM-DD. */
function rssDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export function GET() {
  const articles = getArticles()
    .filter((a) => !a.draft)
    .slice(0, MAX_ITEMS);

  const items = articles
    .map((a) => {
      const url = absoluteUrl(a.url);
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${rssDate(a.publishedAt)}</pubDate>
      <category>${escapeXml(typeConfig[a.type].label)}</category>
${a.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const newest = articles.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), "1970-01-01");
  const lastBuild = rssDate(newest);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
