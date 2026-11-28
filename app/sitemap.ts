import type { MetadataRoute } from "next";
import { type Article, getArticles, getArticlesByLanguage, typeConfig } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { staticPages } from "@/lib/static-pages";
import { tools } from "@/lib/tools";

/** Newest updatedAt in a list, or undefined if the list is empty. */
function newest(list: Article[]): string | undefined {
  return list.reduce<string | undefined>((max, a) => (max === undefined || a.updatedAt > max ? a.updatedAt : max), undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles().filter((a) => !a.draft);
  const newestTool = tools.reduce((max, t) => (t.priceCheckedOn > max ? t.priceCheckedOn : max), "");

  const listings: { path: string; lastModified?: string }[] = [
    { path: "/", lastModified: newest(articles) },
    ...(["review", "list", "comparison", "tutorial"] as const).map((type) => ({
      path: typeConfig[type].base,
      lastModified: newest(articles.filter((a) => a.type === type)),
    })),
    { path: "/urdu", lastModified: newest(getArticlesByLanguage("roman-urdu").filter((a) => !a.draft)) },
    { path: "/tools", lastModified: newestTool },
  ];

  return [
    ...listings.map(({ path, lastModified }) => ({ url: absoluteUrl(path), ...(lastModified ? { lastModified } : {}) })),
    ...articles.map((a) => ({ url: absoluteUrl(a.url), lastModified: a.updatedAt })),
    ...tools.map((t) => ({ url: absoluteUrl(`/tools/${t.slug}`), lastModified: t.priceCheckedOn })),
    ...Object.values(staticPages).map((p) => ({ url: absoluteUrl(p.path), lastModified: p.updated })),
  ];
}
