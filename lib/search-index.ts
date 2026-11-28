import { kindLabels } from "./article-summary";
import { getArticles } from "./content";
import type { SearchEntry } from "./search-types";
import { categoryLabels } from "./tool-utils";
import { getTool, tools } from "./tools";

/** Every published article and tool, built once at build time. */
export function buildSearchIndex(): SearchEntry[] {
  const articleEntries: SearchEntry[] = getArticles()
    .filter((a) => !a.draft)
    .map((a) => ({
      kind: kindLabels[a.type],
      url: a.url,
      title: a.title,
      description: a.description,
      keywords: [...a.tags, ...a.toolSlugs.map((s) => getTool(s)?.name ?? s)],
      romanUrdu: a.language === "roman-urdu",
    }));
  const toolEntries: SearchEntry[] = tools.map((t) => ({
    kind: "Tool",
    url: `/tools/${t.slug}`,
    title: t.name,
    description: t.shortDescription,
    keywords: [categoryLabels[t.category], t.category, t.bestFor, ...t.useCases],
    romanUrdu: false,
  }));
  return [...articleEntries, ...toolEntries];
}
