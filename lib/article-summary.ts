// The small, serialisable view of an article used by cards, filters and search.
// No zod, fs or MDX imports here, so client components can use this file.
import type { Category } from "./tool-utils";

export type ArticleKind = "review" | "list" | "comparison" | "tutorial";

export const kindLabels = {
  review: "Review",
  list: "Best tools",
  comparison: "Comparison",
  tutorial: "Tutorial",
} as const satisfies Record<ArticleKind, string>;

export interface ArticleSummary {
  type: ArticleKind;
  slug: string;
  url: string;
  title: string;
  description: string;
  language: "en" | "roman-urdu";
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  cover: { src: string; width: number; height: number; alt: string };
  tags: string[];
  toolSlugs: string[];
  /** Reviews only: the category of the reviewed tool. */
  category?: Category;
  /** Tutorials only. */
  difficulty?: "beginner" | "intermediate";
  draft: boolean;
}
